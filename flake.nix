{
  description = "nix.dev static website";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-23.05";
  inputs.flake-utils.url = "github:numtide/flake-utils";
  inputs.poetry2nix = {
    inputs.flake-utils.follows = "flake-utils";
    inputs.nixpkgs.follows = "nixpkgs";
    url = "github:nix-community/poetry2nix";
  };

  outputs = { self, nixpkgs, flake-utils, poetry2nix }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          overlays = [ poetry2nix.overlay ];
        };
        poetryOverrides = self: super: {

          # Refs https://github.com/nix-community/poetry2nix/issues/218#issuecomment-981615612
          typing-extensions = super.typing-extensions.overridePythonAttrs (
            old: {
              buildInputs = (old.buildInputs or [ ]) ++ [ self.flit-core ];
            }
          );

          sphinx = super.sphinx.overridePythonAttrs (
            old: {
              buildInputs = (old.buildInputs or [ ]) ++ [ self.flit-core ];
            }
          );

          accessible-pygments = super.accessible-pygments.overridePythonAttrs (
            old: {
              buildInputs = (old.buildInputs or [ ]) ++ [ super.setuptools ];
            }
          );

          sphinx-sitemap = super.sphinx-sitemap.overridePythonAttrs (
            old: {
              buildInputs = (old.buildInputs or [ ]) ++ [ super.setuptools ];
            }
          );

          sphinx-notfound-page = super.sphinx-notfound-page.overridePythonAttrs (
            old: {
              buildInputs = (old.buildInputs or [ ]) ++ [ super.flit-core ];
            }
          );
        };
      in
      rec {
        packages = flake-utils.lib.flattenTree {
          nix-dev-pyenv = pkgs.poetry2nix.mkPoetryEnv {
            projectDir = self;
            python = pkgs.python39;
            overrides = [
              (self: super: {
                pydata-sphinx-theme = super.pydata-sphinx-theme.override { preferWheel = true; };
                sphinx-book-theme = super.sphinx-book-theme.override { preferWheel = true; };
              })
              pkgs.poetry2nix.defaultPoetryOverrides
              poetryOverrides
            ];
          };
          nix-dev-html = pkgs.stdenv.mkDerivation {
            name = "nix-dev";
            src = self;
            buildInputs = [ packages.nix-dev-pyenv ];
            buildPhase = ''
              make html
            '';
            installPhase = ''
              mkdir -p $out
              cp -R build/html/* $out/
            '';
          };
        };
        defaultPackage = packages.nix-dev-html;
      }
    );

}
