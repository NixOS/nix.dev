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

  nix-dev = pkgs.stdenv.mkDerivation {
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
    buildPhase = ''
      make html
    '';
    installPhase =
      let
        # Various versions of the Nix manuals, grep for (nix-manual)= to find where they are displayed
        # FIXME: This requires human interaction to update! See ./CONTRIBUTING.md for details.
        releases = [
          "2.19"
          "2.18"
          "2.13"
        ];
        inputName = version: pkgs.lib.strings.replaceStrings [ "." ] [ "-" ] version;
        src = version: inputs."nix_${inputName version}";
        manual = version: (import (src version)).default.doc;
        copy = version: ''
          cp -Rf ${manual version}/share/doc/nix/manual/* $out/manual/nix/${version}
          # add upstream page redirects of the form `<from> <to> <status>`, excluding comment lines and empty
          sed '/^#/d;/^$/d;s#^\(.*\) \(.*\) #/manual/nix/${version}\1 /manual/nix/${version}\2 #g' ${src version}/doc/manual/_redirects >> $out/_redirects
        '';
      in
      with pkgs.lib.strings;
      ''
        # NOTE: the comma in the shell expansion makes it also work for singleton lists
        mkdir -p $out/manual/nix/{${concatStringsSep "," releases},}
        cp -R build/html/* $out/
        ${concatStringsSep "\n" (map copy releases)}
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
