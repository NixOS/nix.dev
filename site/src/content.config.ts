import { defineCollection } from "astro:content";
import { type Loader } from "astro/loaders";
import { z } from "astro/zod";

import { loadDocIndex } from "./lib/nixpkgs-doc";

const docPageLoader: Loader = {
  name: "nixpkgs-doc-pages",
  async load({ store, parseData, renderMarkdown, generateDigest, logger }) {
    const { pages } = await loadDocIndex();
    store.clear();
    for (const page of pages) {
      logger.info(`processing: ${page.slug}`);
      store.set({
        id: page.slug,
        body: page.body,
        digest: generateDigest(page.body),
        rendered: await renderMarkdown(page.body),
        data: await parseData({
          id: page.slug,
          data: { title: page.title, file: page.file },
        }),
      });
    }
  },
};

export const collections = {
  nixpkgs: defineCollection({
    loader: docPageLoader,
    schema: z.object({
      title: z.string(),
      file: z.string(),
    }),
  }),
};
