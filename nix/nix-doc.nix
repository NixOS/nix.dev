# Wrap the rendered Nix manual for search indexing
#
{
  lib,
  runCommand,
  nix,
}:
runCommand "nix-doc" { } ''
  # Vendor the HTML of the Nix manual
  cp -rL --no-preserve=mode ${nix.doc}/share/doc/nix/manual $out

  # Remember where nix.dev serves this version, so search results can link there
  echo https://nix.dev/manual/nix/${lib.versions.majorMinor nix.version}/ >$out/.url
''
