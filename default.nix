{ inputs ? import ./nix/sources.nix
, system ? builtins.currentSystem
,
}:
let
  pkgs = import inputs.nixpkgs {
    config = { };
    overlays = [ (import ./overlay.nix) ];
    inherit system;
  };

  nix-dev =
    let
      # Various versions of the Nix manuals, grep for (nix-manual)= to find where they are displayed
      # FIXME: This requires human interaction to update! See ./CONTRIBUTING.md for details.
      nix-releases = {
        latest = "2.19";
        rolling = "2.18";
        stable = "2.18";
        prev-stable = "2.13";
      };
      nixpkgs-releases = {
        stable = "23.11";
        prev-stable = "23.05";
      };
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
      ];
      buildPhase =
        let
          nix-manual-index =
            with pkgs.lib.attrsets;
            let
              raw = builtins.readFile ./source/reference/nix-manual.md;
              nix-replacements = mapAttrsToList (release: version: "@${release}@") nix-releases;
              nixpkgs-replacements = mapAttrsToList (release: version: "@nixpkgs-${release}@") nixpkgs-releases;
            in
            pkgs.lib.strings.replaceStrings
              (nix-replacements ++ nixpkgs-replacements)
              (attrValues nix-releases ++ attrValues nixpkgs-releases)
              raw;
        in
        ''
          cp -f ${builtins.toFile "nix-manual.md" nix-manual-index} $TMP/nix.dev/source/reference/nix-manual.md
          make html
        '';
      installPhase =
        with pkgs.lib.attrsets;
        with pkgs.lib.strings;
        let
          nix-versions = with pkgs.lib; lists.unique (attrsets.attrValues nix-releases);
          inputName = version: pkgs.lib.strings.replaceStrings [ "." ] [ "-" ] version;
          nix-src = version: inputs."nix_${inputName version}";
          nix-manual = version: (import (nix-src version)).default.doc;
          copy = version: ''
            cp -Rf ${nix-manual version}/share/doc/nix/manual/* $out/manual/nix/${version}
          '';
          # add upstream page redirects of the form `<from> <to> <status>`, excluding comment lines and empty
          redirects = version: ''
            sed '/^#/d;/^$/d;s#^\(.*\) \(.*\) #/manual/nix/${version}\1 /manual/nix/${version}\2 #g' ${nix-src version}/doc/manual/_redirects >> $out/_redirects
          '';
          shortlink = release: version: ''
            echo /manual/nix/${release} /manual/nix/${version}/ 302 >> $out/_redirects
          '';
        in
        ''
          mkdir -p $out
          cp -R build/html/* $out/
          # NOTE: the comma in the shell expansion makes it also work for singleton lists
          mkdir -p $out/manual/nix/{${concatStringsSep "," nix-versions},}
          ${concatStringsSep "\n" (map copy nix-versions)}
          ${concatStringsSep "\n" (map redirects nix-versions)}
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
in
{
  # build with `nix-build -A build`
  build = nix-dev;

  shell = pkgs.mkShell {
    inputsFrom = [ nix-dev ];
    packages = [
      devmode
      pkgs.niv
      pkgs.python310.pkgs.black
      pkgs.vale
    ];
  };
}
