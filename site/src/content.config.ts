import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

export const collections = {
  nixpkgs: defineCollection({
    loader: glob({
      base: "./src/content/nixpkgs",
      pattern: "**/*.md",
    }),
    schema: z.object({
    	title: z.string(),
    })
  }),
};
