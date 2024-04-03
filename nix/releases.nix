{ lib, inputs, system }:
let
  # Import Nixpkgs, get the pkgs set back
  pkgsFor = source:
    import source {
      inherit system;
      config = { };
      overlays = [ ];
    };

  # The pkgs for nixpkgs rolling release
  pkgsRolling = pkgsFor inputs.main.nixpkgs-rolling;

  # The pkgs for each release:
  # {
  #   "23.11" = pkgs..;
  #   "23.05" = pkgs..;
  # }
  pkgsReleases = lib.mapAttrs (release: source:
    pkgsFor source
  ) inputs.nixpkgs;


  # Information on Nixpkgs versions
  # TODO: Use https://github.com/NixOS/infra/blob/master/channels.nix in the future
  nixpkgsVersions = rec {
    # List of sorted version strings, e.g. [ "22.11" "23.05" "23.11" ]
    sorted = lib.sort lib.versionOlder (lib.attrNames pkgsReleases);
    # Number of versions, e.g. 3
    count = lib.length sorted;
    # String for the latest version, e.g. "23.11"
    latest = lib.elemAt sorted (count - 1);
    # String for the version before the latest one, e.g. "23.05"
    prevLatest = lib.elemAt sorted (count - 2);
  };

  # The Nix version string for a pkgs, e.g. "2.18"
  nixVersionForPkgs = pkgs:
    # FIXME: We ignore the patch version here, which means that we could end up showing a different version than what's actually in Nixpkgs
    lib.versions.majorMinor pkgs.nix.version;

  # The build for each Nix version:
  # {
  #   "2.18" = { outPath = ...; ... };
  #   "2.19" = { outPath = ...; ... };
  #   ...
  # }
  nixReleases = lib.mapAttrs (release: source:
    # TODO: Unfortunately, the use of flake-compat prevents passing system with stable Nix..
    (import source).default
  ) inputs.nix;

  # Information on Nix versions
  nixVersions = rec {
    # List of sorted version strings, e.g. [ "2.18" "2.19" "2.20" ]
    sorted = lib.sort lib.versionOlder (lib.attrNames nixReleases);
    # Number of versions, e.g. 3
    count = lib.length sorted;
    # String for the latest version, e.g. "2.20"
    latest = lib.elemAt sorted (count - 1);
  };

  # Mutable link redirects to set up for the Nix manual
  # E.g. /manual/nix/latest redirects to /manual/nix/2.20, which is encoded as:
  # {
  #   "latest" = "2.20";
  #   ...
  # }
  mutableNixManualRedirects = {
    latest = nixVersions.latest;
    rolling = nixVersionForPkgs pkgsRolling;
    stable = nixVersionForPkgs pkgsReleases.${nixpkgsVersions.latest};
    prev-stable = nixVersionForPkgs pkgsReleases.${nixpkgsVersions.prevLatest};
  };

  # Substitutions to perform on ../source/reference/nix-manual.md
  # E.g. @nix-latest@ gets replaced with 2.20, which is encoded as:
  # {
  #   "nix-latest" = "2.20";
  #   ...
  # }
  substitutions = {
    nixpkgs-stable = nixpkgsVersions.latest;
    nixpkgs-prev-stable = nixpkgsVersions.prevLatest;
  } // lib.mapAttrs' (name: value:
    lib.nameValuePair "nix-${name}" value
  ) mutableNixManualRedirects;
in
{
  inherit nixReleases mutableNixManualRedirects substitutions;
}
