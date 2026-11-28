import { glob, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { AstroIntegration } from "astro";
import * as pagefind from "pagefind";

/** The rendered Nix manual with the nix.dev URL */
const NIX_DOC_DIR = path.resolve(process.env.NIX_DOC_DIR ?? "./nix-doc");
const NIX_DOC_SKIP = ["404.html", "print.html", "toc.html"];

function check<T extends { errors: string[] }>(response: T): T {
  if (response.errors.length > 0) {
    throw new Error(`pagefind: ${response.errors.join("\n")}`);
  }
  return response;
}

/**
 * Index the Nix manual as external links
 */
async function addNixManual(index: pagefind.PagefindIndex): Promise<number> {
  const base = (await readFile(path.join(NIX_DOC_DIR, ".url"), "utf8")).trim();
  let count = 0;
  for await (const file of glob("**/*.html", { cwd: NIX_DOC_DIR })) {
    if (NIX_DOC_SKIP.includes(file)) continue;
    const html = await readFile(path.join(NIX_DOC_DIR, file), "utf8");
    const [head, main, ...rest] = html.split("<main>");
    if (head === undefined || main === undefined || rest.length > 0) {
      throw new Error(`pagefind: ${file} needs exactly one <main> element`);
    }
    const title = /<title>([^<]*)<\/title>/.exec(head);
    if (!title?.[1]) throw new Error(`pagefind: ${file} has no <title>`);
    const book = title[1].lastIndexOf(" - ");
    const page = book === -1 ? title[1] : title[1].slice(0, book);
    check(
      await index.addHTMLFile({
        url: new URL(file, base).href,
        content:
          head.replace(
            title[0],
            `<title data-pagefind-meta="title">${page}</title>`,
          ) +
          '<main data-pagefind-body data-pagefind-filter="category:Nix">' +
          main,
      }),
    );
    count++;
  }
  return count;
}

/**
 * Build the Pagefind index.
 */
export default function pagefindIntegration(): AstroIntegration {
  return {
    name: "pagefind",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        const out = fileURLToPath(dir);
        // Some languages that Pagefind has no stemmer for.
        // "deriv", "derivatio" -> "derivation"
        const { index } = check(
          // Hack: "zz" -> No language to index words as they are.
          // Pagefind has no way to turn stemming of.
          await pagefind.createIndex({ forceLanguage: "zz" }),
        );
        if (!index) throw new Error("pagefind: no index");
        const { page_count } = check(await index.addDirectory({ path: out }));
        const nixCount = await addNixManual(index);
        check(
          await index.writeFiles({ outputPath: path.join(out, "pagefind") }),
        );
        await pagefind.close();
        logger.info(
          `indexed ${page_count} site pages and ${nixCount} Nix manual pages`,
        );
      },
    },
  };
}
