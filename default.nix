{ inputs ? import ./nix/sources.nix
, system ? builtins.currentSystem
,
}:
let
  pkgs = import inputs.nixpkgs-prev-stable {
    config = { };
    overlays = [ (import ./overlay.nix) ];
    inherit system;
  };
  lib = pkgs.lib;

  nix-dev =
    let
      # Various versions of the Nix manuals, grep for (nix-manual)= to find where they are displayed.
      # FIXME: This requires human interaction to update! See ./CONTRIBUTING.md for details.
      releases = rec {
        nixpkgs-rolling = import inputs.nixpkgs-rolling { } // { inherit (nixpkgs-rolling.lib) version; };
        nixpkgs-stable = import inputs.nixpkgs-stable { } // { inherit (nixpkgs-stable.lib) version; };
        nixpkgs-prev-stable = import inputs.nixpkgs-prev-stable { } // { inherit (nixpkgs-prev-stable.lib) version; };
        nix-latest = (import inputs.nix-latest).default;
        # TODO: to further simplify this and get Nix from Nixpkgs with all required files present,
        # make a patch release of Nix after https://github.com/NixOS/nix/pull/9949 lands,
        # and bump the respective version in the respective Nixpkgs `release-*` branch.
        nix-rolling = (import inputs.nix-rolling).default;
        nix-stable = (import inputs.nix-stable).default;
        nix-prev-stable = (import inputs.nix-prev-stable).default;
      };
      version = package: lib.versions.majorMinor package.version;
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
            with lib.attrsets;
            with lib.strings;
            replaceStrings
              (mapAttrsToList (release: _: "@${release}@") releases)
              (mapAttrsToList (_: package: version package) releases)
              (builtins.readFile ./source/reference/nix-manual.md);
        in
        ''
          cp -f ${builtins.toFile "nix-manual.md" nix-manual-index} $TMP/nix.dev/source/reference/nix-manual.md
          make html
        '';
      installPhase =
        with lib.attrsets;
        with lib.strings;
        let
          nix-releases =
            let
              package = name: elemAt (splitString "-" name) 0;
              release = name: elemAt (splitString "-" name) 1;
              filtered = filterAttrs (name: value: (package name) == "nix") releases;
            in
            mapAttrs' (name: value: { name = release name; inherit value; }) filtered;
          # the same Nix version could appear in multiple Nixpkgs releases,
          # but we want to copy each exactly once.
          unique-version =
            let
              version-exists = p: ps: elem (version p) (map (x: version x) ps);
            in
            lib.lists.foldl' (acc: elem: if version-exists elem acc then acc else acc ++ [ elem ]) [ ];
          copy = nix: ''
            cp -Rf ${nix.doc}/share/doc/nix/manual/* $out/manual/nix/${version nix}
          '';
          # add upstream page redirects of the form `<from> <to> <status>`, excluding comments and empty lines
          # TODO: once https://github.com/NixOS/nix/pull/9949 lands, bump the source and use:
          #       ${nix.doc}/share/doc/nix/manual/_redirects
          # also remove the then unnecessary file from the root directory of the manual:
          #        rm $out/manual/nix/${version nix}/_redirects
          redirects = nix: ''
            sed '/^#/d;/^$/d;s#^\(.*\) \(.*\) #/manual/nix/${version nix}\1 /manual/nix/${version nix}\2 #g' ${nix.src}/doc/manual/_redirects >> $out/_redirects
          '';
          shortlink = release: nix: ''
            echo /nix/manual/${release}/* /nix/manual/${nix.version}/:splat 302 >> $out/_redirects
          '';
        in
        ''
          mkdir -p $out
          cp -R build/html/* $out/
          # NOTE: the comma in the shell expansion makes it also work for singleton lists
          mkdir -p $out/manual/nix/{${concatStringsSep "," (mapAttrsToList (_: nix: version nix) nix-releases)},}
          ${concatStringsSep "\n" (map copy (unique-version (attrValues nix-releases)))}
          ${concatStringsSep "\n" (map redirects (unique-version (attrValues nix-releases)))}
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
in
{
  # build with `nix-build -A build`
  build = nix-dev;

  shell = pkgs.mkShell {
    inputsFrom = [ nix-dev ];
    packages = [
      devmode
      update-nix-releases
      pkgs.niv
      pkgs.python310.pkgs.black
      pkgs.vale
    ];
  };
}
