{
  inputs ? import ./nix/sources.nix,
  system ? builtins.currentSystem,
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
        from livereload import Server, shell

        server = Server()

        build_docs = shell("make html")

        print("Doing an initial build of the docs...")
        build_docs()

        server.watch("source/*", build_docs)
        server.watch("source/**/*", build_docs)
        server.watch("_templates/*.html", build_docs)
        server.serve(root="build/html")
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
    packages = with pkgs.python310.pkgs; [
      black
      devmode
    ];
  };
}
