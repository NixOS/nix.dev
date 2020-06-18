{
  description = "nix.dev static website";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-20.03";

  outputs = { self, nixpkgs }:
    let
      systems = [
        "x86_64-linux"
        "i686-linux"
        "x86_64-darwin"
        "aarch64-linux"
      ];

      forAllSystems = generator: nixpkgs.lib.genAttrs systems generator;

      website = system:
        let
          pkgs = import nixpkgs { inherit system; };
          python = import ./requirements.nix { inherit pkgs; };

        in pkgs.stdenv.mkDerivation {
          name = "nix-dev";
          src = self;

          buildInputs = [
            python.interpreter
          ];

          buildPhase = ''
            make html
          '';

          installPhase = ''
            mkdir -p $out/html
            cp -r build/html/ $out/
          '';
        };

    in {
      defaultPackage = forAllSystems website;
    };
}
