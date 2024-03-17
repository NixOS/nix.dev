{ lib, inputs, system }:
let
  # encode a convention for naming versioned inputs
  inputName = package: "${package.pname}_" + lib.strings.replaceStrings [ "." ] [ "-" ] (version package);

  version = package: lib.versions.majorMinor package.version;

  # filter for unique package versions
  unique-versions = packages:
    let
      version-exists = with lib; p: ps: elem (version p) (map (x: version x) ps);
    in
    lib.lists.foldl' (acc: elem: if version-exists elem acc then acc else acc ++ [ elem ]) [ ] packages;

  # get the Nix shipped with a given release of Nixpkgs
  nix-from = inputs: pkgs: (import inputs.${inputName pkgs.nix}).default;

  nixpkgs-with-manual = nixpkgs:
    let
      pkgs = import nixpkgs { inherit system; config = { }; overlays = [ ]; };
      doc = import "${nixpkgs}/doc" {
        inherit pkgs;
        nixpkgs = { inherit (nixpkgs) rev; };
      };
      version = { inherit (pkgs.lib) version; };
    in
    pkgs // doc // version;

  version-sort = releases:
    with lib;
    reverseList (lists.naturalSort (attrNames releases));
in
rec {
  inherit version unique-versions;

  nix-releases =
    with lib.attrsets;
    mapAttrs (_: input: (import input).default)
      (filterAttrs
        (name: _: lib.strings.match "^nix_([0-9]+)-([0-9]+)$" name != null)
        inputs);

  nixpkgs-releases =
    with lib.attrsets;
    mapAttrs
      (_: input: nixpkgs-with-manual input)
      (filterAttrs
        (name: _: lib.strings.match "^nixpkgs_([0-9]+)-([0-9]+)$" name != null)
        inputs);

  supported-releases = rec {
    nixpkgs-rolling = nixpkgs-with-manual inputs.nixpkgs-rolling;
    nixpkgs-stable = with lib; nixpkgs-releases.${head (version-sort nixpkgs-releases)};
    nixpkgs-prev-stable = with lib; nixpkgs-releases.${head (tail (version-sort nixpkgs-releases))};

    nix-rolling = nix-from inputs nixpkgs-rolling;
    nix-latest = with lib; nix-releases.${last (lists.naturalSort (attrNames nix-releases))};
    nix-stable = nix-from inputs nixpkgs-stable;
    nix-prev-stable = nix-from inputs nixpkgs-prev-stable;
  };
}
