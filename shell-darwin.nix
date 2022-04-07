# @zupo uses this file to work on nix.dev on his M1 Monterey

let
  nixpkgs = builtins.fetchTarball {
    # https://status.nixos.org/ -> nixos-21.11 on 2022-04-06
    url = "https://github.com/nixos/nixpkgs/archive/ccb90fb9e11459aeaf83cc28d5f8910816d90dd0.tar.gz";
  };
  pkgs = import nixpkgs {};
  poetry2nix = import (fetchTarball {
    # https://github.com/nix-community/poetry2nix/commits/master on 2022-04-06
    url = "https://github.com/nix-community/poetry2nix/archive/99c79568352799af09edaeefc858d337e6d9c56f.tar.gz";
  }) {
    pkgs = pkgs;
  };

  env = poetry2nix.mkPoetryEnv {
    pyproject = ./pyproject.toml;
    poetrylock = ./poetry.lock;
    editablePackageSources = {};
  };
in

pkgs.mkShell {
  name = "dev-shell";
  buildInputs = [
    env
    pkgs.poetry
	  ];

}
