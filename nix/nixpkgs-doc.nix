# Wrap the nixpkgs docs
#
{
  runCommand,
  nixpkgs,
  lib-docs,
  revision,
}:
runCommand "nixpkgs-doc" { } ''
  # Vendor the nixpkgs/doc folder
  # This hold the nixpkgs manual
  cp -rL --no-preserve=mode ${nixpkgs}/doc $out

  # Vendor nixpkgs.lib function documentation
  cp --no-preserve=mode ${lib-docs}/lib-functions.json $out/

  # Remember the revision, so we can show the correct source attributions
  echo ${revision} >$out/.revision
''
