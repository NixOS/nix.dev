// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import { satteri } from "@astrojs/markdown-satteri";
import netlify from "@astrojs/netlify";
import expressiveCode from "astro-expressive-code";
import icon from "astro-iconset";

import tailwindcss from "@tailwindcss/vite";

import alpinejs from "@astrojs/alpinejs";

import firaCodeUnicodeRanges from "@fontsource-variable/fira-code/unicode.json" with { type: "json" };

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
            src: ["./src/assets/fonts/route159/Route159-Regular.woff2"],
            weight: "normal",
            style: "normal",
          },
          {
            src: ["./src/assets/fonts/route159/Route159-Bold.woff2"],
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
      // The files and their unicode ranges come from the package rather than
      // the fontsource provider, which would download them at build time.
      // symbols2 has the box-drawing characters used in directory trees; the
      // Cyrillic and Greek subsets aren't used by any code on the site.
      provider: fontProviders.local(),
      name: "Fira Code",
      cssVariable: "--font-fira-code",
      fallbacks: ["monospace"],
      options: {
        variants: [
          {
            src: [
              "@fontsource-variable/fira-code/files/fira-code-latin-wght-normal.woff2",
            ],
            weight: "300 700",
            style: "normal",
            unicodeRange: [firaCodeUnicodeRanges.latin],
          },
          {
            src: [
              "@fontsource-variable/fira-code/files/fira-code-latin-ext-wght-normal.woff2",
            ],
            weight: "300 700",
            style: "normal",
            unicodeRange: [firaCodeUnicodeRanges["latin-ext"]],
          },
          {
            src: [
              "@fontsource-variable/fira-code/files/fira-code-symbols2-wght-normal.woff2",
            ],
            weight: "300 700",
            style: "normal",
            unicodeRange: [firaCodeUnicodeRanges.symbols2],
          },
        ],
      },
    },
  ],

  adapter: netlify(),

  vite: {
    plugins: [tailwindcss()],
  },
});
