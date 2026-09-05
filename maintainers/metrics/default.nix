{ python3, lib, writeShellApplication, gh }:
{
  github-dump = writeShellApplication {
    name = "github-dump";
    runtimeInputs = [ gh ];
    text = builtins.readFile ./github-dump.sh;
  };
  metrics = python3.pkgs.buildPythonPackage {
    name = "metrics";
    propagatedBuildInputs = with python3.pkgs; [
      pandas
    ];
    src = with lib.fileset; toSource {
      root = ./.;
      fileset = unions [
        ./metrics.py
        ./setup.py
      ];
    };
  };
}
