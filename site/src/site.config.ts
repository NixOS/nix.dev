import FileText from "@lucide/astro/icons/file-text";
import Package from "@lucide/astro/icons/package";
import NixSnowflake from "./assets/nix-snowflake.svg";

export const config = {
  siteTitle: "Nix Docs",
  description:
    "The documentation for the NixOS project — Nix, NixOS, and Nixpkgs — with guides and references in one place",
  copyright: {
    author: "Nix contributors",
    license: {
      text: "CC-BY-SA-4.0",
      href: "https://github.com/NixOS/nixos-homepage/blob/main/LICENSES/CC-BY-SA-4.0.txt",
    },
  },
  headerLinks: [
    {
      text: "Nix on GitHub",
      href: "https://github.com/nixos/nix",
      icon: NixSnowflake,
    },
    {
      text: "Nixpkgs on GitHub",
      href: "https://github.com/nixos/nixpkgs",
      icon: Package,
    },
    {
      text: "Nix.dev on GitHub",
      href: "https://github.com/nixos/nix.dev",
      icon: FileText,
    },
  ],
  footerLinks: [
    {
      text: "Imprint",
      href: "https://nixos.org/imprint",
    },
    {
      text: "Privacy Policy",
      href: "https://nixos.org/privacy",
    },
  ],
};
