export interface Reference {
  title: string;
  description: string;
  summary: string;
  headings: { depth: number; slug: string; text: string }[];
  example: string;
}

/**
 * Resolve a reference page by slug.
 *
 * POC: deterministically synthesizes a page from the slug so ANY `/reference/*`
 * URL renders — lets us exercise on-demand rendering at scale without a 500k
 * dataset. Production: replace the body with a lookup against the real source
 * (DB / API / prebuilt index). Return `null` for unknown slugs to yield a 404.
 */
export async function getReference(slug: string): Promise<Reference | null> {
  if (!slug) return null;
  const name = slug.split("/").pop()!;
  return {
    title: name,
    description: `Reference documentation for ${name}.`,
    summary: `On-demand reference page for “${name}” (slug: ${slug}).`,
    headings: [{ depth: 2, slug: "attributes", text: "Attributes" }],
    example: `{ pkgs }:\n\npkgs.${name.replace(/[^a-zA-Z0-9_]/g, "_")}\n`,
  };
}
