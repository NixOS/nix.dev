import { defineCollection } from "astro:content";
import { type Loader } from "astro/loaders";
import { z } from "astro/zod";

import { loadDocIndex } from "./lib/nixpkgs-doc";

/** One entry per markdown file the nixpkgs nav lists. */
const docPageLoader: Loader = {
  name: "nixpkgs-doc-pages",
  async load({ store, parseData, renderMarkdown, generateDigest }) {
    const { pages } = await loadDocIndex();
    store.clear();
    for (const page of pages) {
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

/** One entry per documented library function, with its doc comment rendered. */
const libFunctionLoader: Loader = {
  name: "nixdoc-functions",
  async load({ store, parseData, renderMarkdown, generateDigest }) {
    const { functions } = await loadDocIndex();
    store.clear();
    for (const entry of functions) {
      store.set({
        id: entry.slug,
        body: entry.body,
        digest: generateDigest(entry.body),
        rendered: await renderMarkdown(entry.body),
        data: await parseData({
          id: entry.slug,
          data: {
            attrPath: entry.attrPath,
            name: entry.name,
            groups: entry.groups,
            summary: entry.summary,
            source: entry.source,
          },
        }),
      });
    }
  },
};

/** The groups the functions are filed under, in the order nixdoc exports them. */
const libGroupLoader: Loader = {
  name: "nixdoc-groups",
  async load({ store, parseData, renderMarkdown, generateDigest }) {
    const { groups } = await loadDocIndex();
    store.clear();
    for (const group of groups) {
      store.set({
        id: group.slug,
        body: group.body,
        digest: generateDigest(group.body),
        rendered: await renderMarkdown(group.body),
        data: await parseData({
          id: group.slug,
          data: { id: group.id, href: group.href, summary: group.summary },
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

  libFunctions: defineCollection({
    loader: libFunctionLoader,
    schema: z.object({
      attrPath: z.string(),
      name: z.string(),
      groups: z.array(z.string()),
      summary: z.string(),
      source: z.object({
        file: z.string(),
        line: z.number(),
        column: z.number().optional(),
      }),
    }),
  }),

  libGroups: defineCollection({
    loader: libGroupLoader,
    schema: z.object({
      /** The nixdoc group id, `strings` for `lib.strings`. */
      id: z.string(),
      href: z.string(),
      summary: z.string(),
    }),
  }),
};
