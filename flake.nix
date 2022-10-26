{
  description = "nix.dev static website";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-22.05";
  inputs.flake-utils.url = "github:numtide/flake-utils/master";
  inputs.poetry2nix = {
    inputs.flake-utils.follows = "flake-utils";
    inputs.nixpkgs.follows = "nixpkgs";
    url = "github:nix-community/poetry2nix/master";
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
        };
      in rec {
        packages = flake-utils.lib.flattenTree {
          nix-dev-pyenv = pkgs.poetry2nix.mkPoetryEnv {
            projectDir = self;
            python = pkgs.python39;
            overrides = [
              pkgs.poetry2nix.defaultPoetryOverrides
              poetryOverrides
            ];
          };
          spellcheck = pkgs.writeShellApplication {
            name = "spellcheck";
            runtimeInputs = with pkgs; [
              moreutils
              ncurses6
              (hunspellWithDicts (with hunspellDicts; [
                en-gb-ise
                en-us
              ]))
            ];
            text = ''
              mapfile -t files < <(find . -name '*.md')
              exceptionsFile=./spelling-exceptions.dic
              newExceptionsFile=./new-spelling-exceptions.dic
              gbFile=gb.dic
              usFile=us.dic
              hunspell -d en_GB -l "''${files[@]}" | sed 's/.*: //' | sort | uniq > $gbFile
              hunspell -d en_US -l "''${files[@]}" | sed 's/.*: //' | sort | uniq > $usFile
              comm -1 -2 $gbFile $usFile > $newExceptionsFile
              mapfile -t newExceptions < <(comm -1 -3 $exceptionsFile $newExceptionsFile)
              cat $exceptionsFile $newExceptionsFile | sort | uniq | sponge $exceptionsFile
              rm $newExceptionsFile
              if [ "''${#newExceptions[@]}" -gt 0 ]; then
                echo New exceptions
                tput setaf 3
                IFS=$'\n'; echo "''${newExceptions[*]/#/ - }"
                tput sgr 0
                echo
              fi
              mapfile -t errors < <(comm -2 -3 $gbFile $exceptionsFile)
              if [ "''${#errors[@]}" -gt 0 ]; then
                echo Spellcheck errors
                tput setaf 1
                IFS=$'\n'; echo "''${errors[*]/#/ - }"
                tput sgr 0
                exit 1
              fi
            '';
          };
          nix-dev-html = pkgs.stdenv.mkDerivation {
            name = "nix-dev";
            src = self;
            buildInputs = [
              packages.spellcheck
              packages.nix-dev-pyenv
            ];
            buildPhase = ''
              spellcheck
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
