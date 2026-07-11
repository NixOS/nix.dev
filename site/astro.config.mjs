// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import netlify from "@astrojs/netlify";
import starlightSidebarTopics from "starlight-sidebar-topics";

export default defineConfig({
  integrations: [
    starlight({
      title: "Documentation",
      logo: { src: "./src/assets/nixos-logo.svg", alt: "NixOS" },
      favicon: "./src/assets/nixos-logo.svg",
      customCss: [ "./src/styles/style.css" ],
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
      components: {
        Banner: "./src/components/Banner.astro",
      },
      plugins: [
        starlightSidebarTopics([
          {
            label: "Nix",
            link: "/nix/",
            icon: "nix",
            items: [{ autogenerate: { directory: "nix" } }],
          },
          {
            label: "NixOS",
            link: "/nixos/",
            icon: "laptop",
            items: [{ autogenerate: { directory: "nixos" } }],
          },
          {
            label: "Nixpkgs",
            link: "/nixpkgs/",
            icon: "puzzle",
            items: [{ autogenerate: { directory: "nixpkgs" } }],
          },
        ]),
      ],
    }),
  ],

  adapter: netlify(),
});
