{
  description = "nix.dev static website";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-23.05";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, flake-utils}:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };
      in {
        packages.default = pkgs.stdenv.mkDerivation {
          name = "nix-dev";
          src = self;
          buildInputs = with pkgs.python310Packages; [
            livereload
            myst-parser
            sphinx
            sphinx-book-theme
            sphinx-copybutton
            sphinx-design
            black
          ];
          buildPhase = ''
            make html
          '';
          installPhase = ''
            mkdir -p $out
            cp -R build/html/* $out/
          '';
        };
      }
    );
}
