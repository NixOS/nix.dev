{ pkgs }:
(pkgs.lib.evalModules {
  modules = [
    ./options.nix
    ./config.nix
  ];
}).config
