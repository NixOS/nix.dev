// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

import netlify from "@astrojs/netlify";

export default defineConfig({
  integrations: [
    starlight({
      title: "Documentation",
      logo: { src: "./src/assets/nixos-logo.svg", alt: "NixOS" },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/nixos/nix",
        },
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/nixos/nixpkgs",
        },
      ],
      sidebar: [
        {
          label: "Guides",
          items: [
            // Each item here is one entry in the navigation menu.
            { label: "Example Guide", slug: "guides/example" },
          ],
        },
        {
          label: "Reference (on-demand)",
          items: [
            { label: "packages/hello", link: "/reference/packages/hello" },
            { label: "packages/git", link: "/reference/packages/git" },
            { label: "lib/mkOption", link: "/reference/lib/mkOption" },
          ],
        },
      ],
    }),
  ],

  adapter: netlify(),
});
