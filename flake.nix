{
  description = "nix.dev static website";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-23.05";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, flake-utils}:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          overlays = [
            # Add sphinx-sitemap from an overlay until
            # it becomes available from nixpkgs-unstable
            (import ./overlay.nix)
          ];
        };
      in {
        packages.default = pkgs.stdenv.mkDerivation {
          name = "nix-dev";
          src = self;
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

        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs.python310.pkgs; [
            black
            livereload
            linkify-it-py
            myst-parser
            sphinx
            sphinx-book-theme
            sphinx-copybutton
            sphinx-design
            sphinx-notfound-page
            sphinx-sitemap
          ];
        };
      }
    );
}
