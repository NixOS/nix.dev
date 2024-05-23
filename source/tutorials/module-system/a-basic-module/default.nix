{ pkgs ? import <nixpkgs> { } }:
let
  result = pkgs.lib.evalModules {
    modules = [
      ./options.nix
      ./config.nix
    ];
  };
in
result.config
