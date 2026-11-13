// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import { satteri } from "@astrojs/markdown-satteri";
import netlify from "@astrojs/netlify";
import expressiveCode from "astro-expressive-code";

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
        gfm: true,
        headingAttributes: true,
        directive: true,
        definitionList: true,
      },
    }),
  },

  fonts: [
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
