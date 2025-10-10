final: prev:
let
  python-module-sphinx-sitemap =
    {
      lib,
      buildPythonPackage,
      fetchPypi,
      sphinx,
      pytest,
    }:
    let
      pname = "sphinx-sitemap";
      version = "2.5.1";
    in
    buildPythonPackage {
      inherit pname version;

      src = fetchPypi {
        inherit pname version;
        sha256 = "sha256-mEvvBou9vCbPriCai2E5LpaBq8kZG0d80w2kBuOmDuU=";
      };

      propagatedBuildInputs = [
        sphinx
      ];

      nativeCheckInputs = [
        pytest
      ];

      doCheck = true;
      checkPhase = ''
        pytest --fixtures tests
      '';

      meta = with lib; {
        description = "Sitemap generator for Sphinx";
        homepage = "https://github.com/jdillard/sphinx-sitemap";
        maintainers = with maintainers; [ ];
        license = licenses.mit;
      };
    };
in
{
  python310 = prev.python310.override {
    packageOverrides = python-final: python-prev: {
      sphinx-sitemap = python-module-sphinx-sitemap {
        inherit (prev) lib;
        inherit (python-prev) buildPythonPackage fetchPypi pytest;
        inherit (python-prev.pkgs) sphinx;
      };
    };
  };
}
