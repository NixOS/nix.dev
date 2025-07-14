{
  inputs ? import ./nix/inputs.nix,
  system ? builtins.currentSystem,
  pkgs ? import inputs.main.nixpkgs-rolling {
    config = { };
    overlays = [ ];
    inherit system;
  },
  withManuals ? false, # building the manuals is expensive
}:
let
  lib = pkgs.lib;
  releases = import ./nix/releases.nix { inherit lib inputs system; };
  # Sphinx skin got very ugly in 24.05, let's not bump it without fixing that
  pkgs-pinned = import inputs.nixpkgs."23.11" {
    config = { };
    inherit system;
  };
  nix-dev-python-pkgs = with pkgs-pinned.python3.pkgs; [
    linkify-it-py
    myst-parser
    sphinx
    sphinx-book-theme
    sphinx-copybutton
    sphinx-design
    sphinx-notfound-page
    sphinx-sitemap
    pkgs.perl
  ];
  # generated with nix run github:rgri/tex2nix -- *.tex *.sty
  nix-dev-latex = [ (pkgs.callPackage ./nix/tex-env.nix {
    extraTexPackages = {
      inherit (pkgs.texlive) latexmk gnu-freefont;
    };
  }) ];
  nix-dev =
    pkgs.stdenv.mkDerivation {
      name = "nix-dev";
      src = ./.;
      nativeBuildInputs = [
        nix-dev-python-pkgs
        nix-dev-latex
      ];
      buildPhase =
        let
          substitutedNixManualReference = pkgs.substitute {
            src = ./source/reference/nix-manual.md;
            substitutions = lib.concatLists (lib.mapAttrsToList (from: to: [ "--subst-var-by" from to ]) releases.substitutions);
          };
        in
        ''
          ${lib.optionalString withManuals "cp -f ${substitutedNixManualReference} source/reference/nix-manual.md"}
          make html
          make latexpdf
        '';
      installPhase =
        let
          # Various versions of the Nix manuals, grep for (nix-manual)= to find where they are displayed.
          # FIXME: This requires human interaction to update! See ./CONTRIBUTING.md for details.
          release = version: nix: ''
            cp -R --no-preserve=mode ${nix.doc}/share/doc/nix/manual $out/manual/nix/${version}

            # add upstream page redirects of the form `<from> <to> <status>`, excluding comments and empty lines
            # not all releases have that though
            if [[ -f ${nix.doc}/share/doc/nix/manual/_redirects ]]; then
              sed '/^#/d;/^$/d;s#^\(.*\) \(.*\) #/manual/nix/${version}\1 /manual/nix/${version}\2 #g' ${nix.doc}/share/doc/nix/manual/_redirects >> $out/_redirects
            fi

            # provide a single-page view from mdBook's print feature.
            # this is hacky but cheap and does work.
            sed -z 's|\s*window\.addEventListener(\x27load\x27, function() {\s*window\.setTimeout(window.print, 100);\s*});||g' ${nix.doc}/share/doc/nix/manual/print.html > $out/manual/nix/${version}/nix-${version}.html
          '';
          # Redirects from mutable URLs like /manual/nix/latest/... to /manual/nix/2.21/...
          mutableRedirect = mutable: immutable: ''
            echo "/manual/nix/${mutable}/* /manual/nix/${immutable}/:splat 302" >> $out/_redirects
          '';
        in
        ''
          mkdir -p $out/manual/nix
          cp -R build/html/* $out/
          cp build/latex/nix-dev.pdf $out/
          cp netlify.toml $out/
        '' + lib.optionalString withManuals ''
          ${lib.concatStringsSep "\n" (lib.mapAttrsToList release releases.nixReleases)}
          ${lib.concatStringsSep "\n" (lib.mapAttrsToList mutableRedirect releases.mutableNixManualRedirects)}
        '';
    };

  devmode = pkgs.devmode.override {
    buildArgs = ''-A build --show-trace'';
    open = "/index.html";
  };
  update-nix-releases = pkgs.callPackage ./nix/update-nix-releases.nix { };
  update-nixpkgs-releases = pkgs.callPackage ./nix/update-nixpkgs-releases.nix { };
in
{
  # build with `nix-build -A build`
  build = nix-dev;

  shell = pkgs.mkShell {
    inputsFrom = [ nix-dev ];
    packages = [
      devmode
      update-nix-releases
      update-nixpkgs-releases
      pkgs.npins
      pkgs.python3.pkgs.black
      pkgs.vale
      pkgs.netlify-cli
    ];
  };
}
