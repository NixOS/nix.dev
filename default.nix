{ inputs ? import ./nix/sources.nix
, system ? builtins.currentSystem
,
}:
let
  pkgs = import inputs.nixpkgs_23-05 {
    config = { };
    overlays = [ (import ./nix/overlay.nix) ];
    inherit system;
  };

  lib = pkgs.lib;
  releases = import ./nix/releases.nix { inherit lib inputs system; };

  nix-dev =
    let
      # Various versions of the Nix manuals, grep for (nix-manual)= to find where they are displayed.
      # FIXME: This requires human interaction to update! See ./CONTRIBUTING.md for details.
    in
    pkgs.stdenv.mkDerivation {
      name = "nix-dev";
      src = ./.;
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
          nix-manual-index =
            let
              inherit (lib.strings) replaceStrings;
              inherit (lib.attrsets) mapAttrsToList;
              inherit (releases) version supported-releases;
            in
            replaceStrings
              (mapAttrsToList (release: _: "@${release}@") supported-releases)
              (mapAttrsToList (_: package: version package) supported-releases)
              (builtins.readFile ./source/reference/nix-manual.md);
        in
        ''
          cp -f ${builtins.toFile "nix-manual.md" nix-manual-index} $TMP/nix.dev/source/reference/nix-manual.md
          make html
        '';
      installPhase =
        let
          inherit (releases) version;
          copy = nix: ''
            cp -Rf ${nix.doc}/share/doc/nix/manual/* $out/manual/nix/${version nix}
          '';
          # provide a single-page view from mdBook's print feature
          single-page = nix:
            ''
              sed -z 's|\s*window\.addEventListener(\x27load\x27, function() {\s*window\.setTimeout(window.print, 100);\s*});||g' ${nix.doc}/share/doc/nix/manual/print.html > $out/manual/nix/${version nix}/nix-${version nix}.html
            '';
          # add upstream page redirects of the form `<from> <to> <status>`, excluding comments and empty lines
          redirects = nix:
            # not all releases have that though
            lib.optionalString (lib.pathExists "${nix.doc}/share/doc/nix/manual/_redirects") ''
              sed '/^#/d;/^$/d;s#^\(.*\) \(.*\) #/manual/nix/${version nix}\1 /manual/nix/${version nix}\2 #g' ${nix.doc}/share/doc/nix/manual/_redirects >> $out/_redirects
            '';
          shortlink = release: nix: ''
            echo /nix/manual/${release}/* /nix/manual/${version nix}/:splat 302 >> $out/_redirects
          '';
          inherit (releases) unique-versions nix-releases;
          inherit (lib.attrsets) mapAttrsToList attrValues;
          inherit (lib.strings) concatStringsSep;
        in
        ''
          mkdir -p $out
          cp -R build/html/* $out/
          # NOTE: the comma in the shell expansion makes it also work for singleton lists
          mkdir -p $out/manual/nix/{${concatStringsSep "," (mapAttrsToList (_: nix: version nix) nix-releases)},}
          ${concatStringsSep "\n" (map copy (unique-versions (attrValues nix-releases)))}
          ${concatStringsSep "\n" (map single-page (unique-versions (attrValues nix-releases)))}
          ${concatStringsSep "\n" (map redirects (unique-versions (attrValues nix-releases)))}
          ${concatStringsSep "\n" (mapAttrsToList shortlink nix-releases)}
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
      pkgs.niv
      pkgs.python310.pkgs.black
      pkgs.vale
    ];
  };
  nix_2-15 = (import inputs.nix_2-15).default;
  nix_2-16 = (import inputs.nix_2-16).default;
  nix_2-14 = (import inputs.nix_2-14).default;
}
