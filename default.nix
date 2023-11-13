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
    installPhase = ''
      mkdir -p $out
      cp -R build/html/* $out/
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
      pkgs.python310.pkgs.black
      pkgs.vale
    ];
  };
}
