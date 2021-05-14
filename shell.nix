let
  mach-nix = import (builtins.fetchGit {
    url = "https://github.com/DavHau/mach-nix/";
    ref = "refs/tags/3.2.0";
  }) {
    pypiDataRev = "15175225c8295e08e5b95b2965892820a64e9746";
    pypiDataSha256 = "00f87qsdg312iy5f47vr3jjw1jd3d0j89n6zmja536im5f1qzrs9";
  };
in
mach-nix.mkPythonShell {
  requirements = builtins.readFile ./requirements.txt;
}
