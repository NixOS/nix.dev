// @ts-check
import { defineConfig } from "astro/config";
import { satteri } from '@astrojs/markdown-satteri';
import netlify from "@astrojs/netlify";
import expressiveCode, { ExpressiveCodeTheme } from "astro-expressive-code";
import icon from "astro-iconset";

import { light as nixCodeLight, dark as nixCodeDark } from "./src/assets/nixCodeTheme.ts";

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
    })
  ],

  markdown: {
    processor: satteri({
      features: {
        directive: true,
      },
    }),
  },

  adapter: netlify(),

  vite: {
    plugins: [tailwindcss()],
  },
});
