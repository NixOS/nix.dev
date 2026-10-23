// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import { satteri } from "@astrojs/markdown-satteri";
import netlify from "@astrojs/netlify";
import expressiveCode from "astro-expressive-code";
import icon from "astro-iconset";

import tailwindcss from "@tailwindcss/vite";

import alpinejs from "@astrojs/alpinejs";

export default defineConfig({
  site: "https://docs.nixos.org/",

  // until we have a landing page for nixpkgs
  redirects: {
    "/nixpkgs": "/nixpkgs/preface",
  },

  integrations: [
    icon({
      // server-rendered routes cause entire iconset to be bundled if required
      // icons are not explicitly listed here:
      // include: { mdi: [ "github", ] },
    }),
    expressiveCode({
      themes: ["catppuccin-latte", "catppuccin-mocha"],
      defaultProps: {
        wrap: true,
      },
      styleOverrides: {
        codeFontFamily: "var(--font-fira-code), ui-monospace, monospace",
      },
      useDarkModeMediaQuery: false,
      themeCssSelector: (theme, { styleVariants }) =>
        theme.name === styleVariants[1]?.theme.name ? ".dark" : false,
    }),
    alpinejs({ entrypoint: "./src/alpine.ts" }),
  ],

  markdown: {
    processor: satteri({
      features: {
        directive: true,
        definitionList: true,
      },
    }),
  },

  fonts: [
    {
      provider: fontProviders.local(),
      name: "Route159",
      cssVariable: "--font-route159",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/route159/Route159-Regular.woff"],
            weight: "normal",
            style: "normal",
          },
          {
            src: ["./src/assets/fonts/route159/Route159-Bold.woff"],
            weight: "bold",
            style: "normal",
          },
        ],
      },
    },
    {
      // Inter's own Latin subset: a quarter of the size of the full font, but
      // unlike the Fontsource and Google Fonts subsets it keeps Inter's
      // OpenType features (dlig, cv01-cv13, ss01-ss08, ...) and the opsz axis
      provider: fontProviders.local(),
      name: "InterVariable",
      cssVariable: "--font-inter",
      options: {
        variants: [
          {
            src: ["inter-ui/variable-latin/InterVariable-subset.woff2"],
            weight: "100 900",
            style: "normal",
            featureSettings: "'dlig'",
          },
          {
            src: ["inter-ui/variable-latin/InterVariable-Italic-subset.woff2"],
            weight: "100 900",
            style: "italic",
            featureSettings: "'dlig'",
          },
        ],
      },
    },
    {
      provider: fontProviders.npm({ remote: false }),
      name: "Fira Code Variable",
      styles: ["normal", "italic"],
      cssVariable: "--font-fira-code",
      weights: ["100 900"],
      featureSettings: "'dlig'",
      options: {
        package: "@fontsource-variable/fira-code",
        file: "index.css",
      },
    },
  ],

  adapter: netlify(),

  vite: {
    plugins: [tailwindcss()],
  },
});
