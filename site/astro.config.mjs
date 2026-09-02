// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import { satteri } from "@astrojs/markdown-satteri";
import netlify from "@astrojs/netlify";
import expressiveCode, { ExpressiveCodeTheme } from "astro-expressive-code";
import icon from "astro-iconset";

import {
  light as nixCodeLight,
  dark as nixCodeDark,
} from "./src/assets/nixCodeTheme.ts";

import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://docs.nixos.org/",

  integrations: [
    icon({
      // server-rendered routes cause entire iconset to be bundled if required
      // icons are not explicitly listed here:
      // include: { mdi: [ "github", ] },
    }),
    expressiveCode({
      themes: [
        ExpressiveCodeTheme.fromJSONString(JSON.stringify(nixCodeLight)),
        ExpressiveCodeTheme.fromJSONString(JSON.stringify(nixCodeDark)),
      ],
      defaultProps: {
        wrap: true,
      },
      styleOverrides: {
        codeFontFamily: '"Fira Code Variable", ui-monospace, monospace',
      },
    }),
  ],

  markdown: {
    processor: satteri({
      features: {
        directive: true,
      },
    }),
  },

  fonts: [
    {
      provider: fontProviders.npm({ remote: false }),
      name: "InterVariable",
      styles: ["normal", "italic"],
      cssVariable: "--font-inter",
      weights: ["100 900"],
      featureSettings: "'dlig', 'ss01', 'ss07', 'ss08', 'zero'",
      options: {
        package: "inter-ui",
        file: "inter-variable.css",
      },
    },
  ],

  adapter: netlify(),

  vite: {
    plugins: [tailwindcss()],
  },
});
