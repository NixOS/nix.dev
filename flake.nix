{
  description = "nix.dev static website";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-20.03";

  outputs = { self, nixpkgs }:
    let
      pkgs = import nixpkgs {
        system = "x86_64-linux";
      };

      python = import ./requirements.nix {
        inherit pkgs;
      };

      website = pkgs.stdenv.mkDerivation {
        name = "nix-dev";
        src = self;
        buildInputs = [ python.interpreter ];
        buildPhase = ''
          make html
        '';

        installPhase = ''
          mkdir -p $out/html
          cp -r build/html/ $out/
        '';
      };

    in {
      defaultPackage.x86_64-linux = website;
    };
}
