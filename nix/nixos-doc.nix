# Wrap the NixOS manual sources
#
{
  lib,
  runCommand,
  stdenv,
  nixpkgs,
  revision,
}:
let
  # The NixOS manual build fills the "@MODULE_CHAPTERS@" placeholder of nav.json
  # with the documentation files that NixOS modules declare in `meta.doc`.
  # Do the same, with each file copied into the doc tree.
  nixos = import "${nixpkgs}/nixos/lib/eval-config.nix" {
    inherit (stdenv.hostPlatform) system;
    modules = [ ];
  };
  moduleDocs = map (
    doc:
    let
      source = lib.removePrefix "${nixpkgs}/" (toString doc.value);
      dir = dirOf source;
    in
    {
      inherit source;
      # The site names a page after its file name, so a `default.md` takes the name of its folder.
      file = if baseNameOf source == "default.md" then "${dir}/${baseNameOf dir}.md" else source;
    }
  ) nixos.config.meta.doc;
in
runCommand "nixos-doc" { } ''
  # Vendor the nixos/doc/manual folder
  cp -rL --no-preserve=mode ${nixpkgs}/nixos/doc/manual $out

  ${lib.concatMapStrings (doc: ''
    install -Dm644 ${nixpkgs}/${doc.source} $out/${doc.file}
  '') moduleDocs}
  substituteInPlace $out/nav.json \
    --replace-fail '"@MODULE_CHAPTERS@"' ${
      lib.escapeShellArg (
        lib.concatMapStringsSep ",\n" (doc: builtins.toJSON { inherit (doc) file; }) moduleDocs
      )
    }

  # Remember the revision, so we can show the correct source attributions
  echo ${revision} >$out/.revision
''
