/**
 * Reader for a nixdoc manifest-mode export (schema v1), the data behind a
 * `{ "collection": ..., "type": "nixdoc" }` nav entry.
 *
 * Note: that each library function has docs in the nixpkgs-commonmark flavour
 * The result therefore needs to flow through nixpkgs-markdown.ts preprocessing for now.
 */

import { z } from "astro/zod";

import {
  shiftHeadings,
  toCommonmark,
  unterminatedFence,
  type ConvertOptions,
} from "./nixpkgs-markdown";

const SCHEMA_VERSION = 1;

const sourceSchema = z.object({
  file: z.string(),
  line: z.number(),
  column: z.number().optional(),
});

const exportSchema = z.object({
  schemaVersion: z.literal(SCHEMA_VERSION),
  groups: z.array(
    z.object({
      id: z.string(),
      description: z
        .string()
        .default("")
        .transform((text) => text.trim()),
    }),
  ),
  entries: z.array(
    z.object({
      id: z.string(),
      attrPath: z.string(),
      name: z.string(),
      description: z.string(),
      groups: z.array(z.string()),
      source: sourceSchema,
    }),
  ),
});

export type NixdocSource = z.infer<typeof sourceSchema>;
export type NixdocExport = z.infer<typeof exportSchema>;
export type NixdocGroup = NixdocExport["groups"][number];
export type NixdocEntry = NixdocExport["entries"][number];

export function parseExport(where: string, data: unknown): NixdocExport {
  const parsed = exportSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `${where}: not a nixdoc v${SCHEMA_VERSION} export\n${parsed.error}`,
    );
  }
  return parsed.data;
}

/** HTML ids and URL segments allow limited characters */
const HOSTILE = /[^A-Za-z0-9._-]/g;

/**
 * Resource path of a function page, from its export id:
 * `lib.attrsets.mapAttrs-prime` becomes `lib/attrsets/mapAttrs-prime`.
 */
export function entrySlug(id: string): string {
  return id.replace(HOSTILE, "").split(".").join("/");
}

/** The anchor the nixpkgs manual gives a function, for cross-references. */
export function entryAnchor(id: string): string {
  return `function-library-${id.replace(HOSTILE, "")}`;
}

/** The anchor the nixpkgs manual gives a function group. */
export function groupAnchor(id: string): string {
  return `sec-functions-library-${id.replace(HOSTILE, "")}`;
}

function sourceUrl(source: NixdocSource, revision: string): string {
  return `https://github.com/NixOS/nixpkgs/blob/${revision}/${source.file}#L${source.line}`;
}

/**
 * Markdown body of a function page: the doc comment shifted one level down to
 * sit below the page title, followed by a link to its definition.
 */
export function entryBody(
  entry: NixdocEntry,
  revision: string,
  options?: ConvertOptions,
): string {
  const doc = shiftHeadings(toCommonmark(entry.description.trim(), options), 1);
  // a doc comment with an unterminated code fence would swallow the footer
  const fence = unterminatedFence(doc);
  const body = fence ? `${doc}\n${fence}` : doc;
  const located = `Located at [${entry.source.file}:${entry.source.line}](${sourceUrl(
    entry.source,
    revision,
  )}) in \`<nixpkgs>\`.`;
  return body ? `${body}\n\n${located}\n` : `${located}\n`;
}
