import { defineCollection } from "astro:content";
import { type Loader } from "astro/loaders";
import { z } from "astro/zod";

import { loadDocIndex, type Manual } from "./lib/nixpkgs-doc";

const docPageLoader = (manual: Manual): Loader => ({
  name: `${manual}-doc-pages`,
  async load({ store, parseData, renderMarkdown, generateDigest, logger }) {
    const { pages } = await loadDocIndex(manual);
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
});

const schema = z.object({
  title: z.string(),
  file: z.string(),
});

export const collections = {
  nixpkgs: defineCollection({ loader: docPageLoader("nixpkgs"), schema }),
  nixos: defineCollection({ loader: docPageLoader("nixos"), schema }),
};
