# An abstraction over the different source pins in this directory
{

  # The main npins sources, these are without any standard names:
  # {
  #   <name> = <source>;
  # }
  main = import ../npins { };

  # Sources for Nix releases, the attribute name is the release version.
  # These are done specially because updating these is non-trivial.
  # See ./update-nix-releases.nix
  # {
  #   <version> = <source>;
  # }
  nix =
    builtins.mapAttrs (name: value:
      # This matches the nix-prefetch-url --unpack --name source call in ./update-nix-releases.nix
      fetchTarball {
        name = "source";
        url = value.url;
        sha256 = value.sha256;
      }
    ) (builtins.fromJSON (builtins.readFile ./nix-versions.json));

  # Sources for Nixpkgs releases, the attribute name is the release name.
  # These can be updated with the standard npins tooling, but are tracked separately to avoid having to filter them out during processing.
  # See ./update-nixpkgs-releases.nix
  nixpkgs = import ../npins {
    json = ./sources.json;
  };

}
