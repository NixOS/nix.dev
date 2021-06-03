let
  mach-nix = import (builtins.fetchGit {
    url = "https://github.com/DavHau/mach-nix/";
    ref = "refs/tags/3.2.0";
  }) {
    pypiDataRev = "9d28e464522798b5999f1ae55ba363ec12fde1e8";
    pypiDataSha256 = "0lwagvqcrj5yzw3iqyzz4radrbwa4z7p2sx4yy9chil6mlq5i68q";
  };
in
mach-nix.mkPythonShell {
  requirements = builtins.readFile ./requirements.txt;
}
