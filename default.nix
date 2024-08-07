{
  inputs ? import ./nix/inputs.nix,
  system ? builtins.currentSystem,
  pkgs ? import inputs.nixpkgs."23.05" {
    config = { };
    overlays = [ (import ./nix/overlay.nix) ];
    inherit system;
  },
}:
let
  lib = pkgs.lib;
  releases = import ./nix/releases.nix { inherit lib inputs system; };

  nix-dev =
    pkgs.stdenv.mkDerivation {
      name = "nix-dev";
      src = lib.cleanSource ./.;
      nativeBuildInputs = with pkgs.python310.pkgs; [
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
      buildPhase =
        let
          substitutedNixManualReference = pkgs.substitute {
            src = ./source/reference/nix-manual.md;
            replacements = lib.concatLists (lib.mapAttrsToList (from: to: [ "--subst-var-by" from to ]) releases.substitutions);
          };
        in
        ''
          cp -f ${substitutedNixManualReference} source/reference/nix-manual.md
          make html
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
          ${lib.concatStringsSep "\n" (lib.mapAttrsToList release releases.nixReleases)}
          ${lib.concatStringsSep "\n" (lib.mapAttrsToList mutableRedirect releases.mutableNixManualRedirects)}
        '';
    };

  devmode =
    let
      pythonEnvironment = pkgs.python310.withPackages (ps: with ps; [
        livereload
      ]);
      script = ''
        from livereload import Server
        from subprocess import Popen, PIPE
        import shlex

        server = Server()

        def nix_build():
          p = Popen(
            shlex.split("nix-build -A build"),
            # capture output as text
            stdout=PIPE,
            stderr=PIPE,
            text=True,
          )
          # we only care about failures
          stdout, stderr = p.communicate()
          if p.returncode:
            print(stderr)
          return p

        # (re-)build once before serving
        nix_build().wait()

        server.watch("source/*", nix_build)
        server.watch("source/**/*", nix_build)
        server.serve(root="result")
      '';
    in
    pkgs.writeShellApplication {
      name = "devmode";
      runtimeInputs = [ pythonEnvironment ];
      text = ''
        python ${pkgs.writeText "live.py" script}
      '';
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
      pkgs.python310.pkgs.black
      pkgs.vale
      pkgs.netlify-cli
    ];
  };
}
