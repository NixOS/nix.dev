/** Client side search using pagefind */

export const CATEGORIES = ["NixOS", "Nixpkgs", "Nix"] as const;
export type Category = (typeof CATEGORIES)[number];

export const isCategory = (value: unknown): value is Category =>
  CATEGORIES.includes(value as Category);

export const DEBOUNCE_MS = 100;

/** Classes for the `<mark>` elements in an excerpt: matches are always yellow. */
export const MARK = "[&_mark]:bg-yellow [&_mark]:text-grey-78";

interface PagefindData {
  url: string;
  excerpt: string;
  meta: { title?: string };
  filters: { category?: string[] };
}

interface PagefindSearch {
  results: { data(): Promise<PagefindData> }[];
  filters: { category?: Record<string, number> };
}

interface Pagefind {
  filters(): Promise<unknown>;
  search(
    term: string,
    options?: { filters?: { category?: Category } },
  ): Promise<PagefindSearch>;
}

/** One search result, ready to render. */
export interface Hit {
  url: string;
  title: string;
  category: string;
  /** HTML: text that Pagefind escaped, with `<mark>` around the matches. */
  excerpt: string;
}

export interface Results {
  /** Matches in all categories. */
  total: number;
  /** Matches per category. */
  counts: Partial<Record<Category, number>>;
  /** Matches in the requested category, or in all categories. */
  matches: number;
  /** Load the matches from `start` up to `end`. */
  hits(start: number, end: number): Promise<Hit[]>;
}

// A variable, so that Vite leaves the import of the built bundle alone.
const PAGEFIND_URL = "/pagefind/pagefind.js";
let pagefind: Promise<Pagefind> | undefined;

/**
 * Load Pagefind and its filter index, once. Call it early to hide the load
 * time. Pagefind counts the matches per category only after it has loaded
 * the filter index. After a failed load, the next call tries again.
 */
export const loadPagefind = (): Promise<Pagefind> =>
  (pagefind ??= import(/* @vite-ignore */ PAGEFIND_URL)
    .then(async (pf: Pagefind) => {
      await pf.filters();
      return pf;
    })
    .catch((error: unknown) => {
      pagefind = undefined;
      throw error;
    }));

type PagefindResult = PagefindSearch["results"][number];

/** We get 30 results, then pull the exact title matches up.
 * Pagefind has no exact matches or special handling for long titles
 * Titles "Derivation" and "What you didn't want to know about derivation" gets the same boost in pagefind.
 */
const TITLE_MATCH_WINDOW = 30;

/** A title or term without case, extra spaces and a plural "s". */
const titleKey = (text: string) =>
  text.toLowerCase().replace(/\s+/g, " ").trim().replace(/s$/, "");

async function titleMatchesFirst(
  term: string,
  results: PagefindResult[],
): Promise<PagefindResult[]> {
  const key = titleKey(term);
  const head = results.slice(0, TITLE_MATCH_WINDOW);
  const data = await Promise.all(head.map((result) => result.data()));
  const matches = head.filter((_, i) => {
    const title = titleKey(data[i]?.meta.title ?? "");
    return title.startsWith(key) && !title.slice(key.length).includes(" ");
  });
  if (matches.length === 0) return results;
  return [...matches, ...results.filter((result) => !matches.includes(result))];
}

export async function search(
  term: string,
  category?: Category,
): Promise<Results> {
  const pf = await loadPagefind();
  const all = await pf.search(term);
  const list = category
    ? await pf.search(term, { filters: { category } })
    : all;
  const ordered = await titleMatchesFirst(term, list.results);
  return {
    total: all.results.length,
    counts: all.filters.category ?? {},
    matches: ordered.length,
    hits: (start, end) =>
      Promise.all(
        ordered.slice(start, end).map(async (result) => {
          const data = await result.data();
          return {
            url: data.url,
            title: data.meta.title ?? data.url,
            category: data.filters.category?.[0] ?? "",
            excerpt: data.excerpt,
          };
        }),
      ),
  };
}

/** Results on another site, like the Nix manual on nix.dev, have a full URL. */
export const isExternal = (url: string): boolean => /^https?:\/\//.test(url);

/** The URL to show under a result: site paths as they are, other sites without the scheme. */
export const displayUrl = (url: string): string =>
  url.replace(/^https?:\/\//, "");

/**
 * Mark a link to another site like the sidebar does: open it in a new tab,
 * put the Lucide external-link icon after `label`, and tell screen readers.
 */
export function markExternal(link: HTMLAnchorElement, label: HTMLElement) {
  link.target = "_blank";
  link.rel = "noopener";
  label.insertAdjacentHTML(
    "beforeend",
    // Lucide external-link, as in the sidebar: 13px, stroke width 2.2.
    '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="ml-[5px] inline-block align-baseline"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>',
  );
  const note = document.createElement("span");
  note.className = "sr-only";
  note.textContent = `, opens ${new URL(link.href).host} in a new tab`;
  label.append(note);
}

/** The URL of the search page for a term and category. */
export const searchPageUrl = (term: string, category?: Category): string => {
  const params = new URLSearchParams({ q: term });
  if (category) params.set("category", category);
  return `/search/?${params}`;
};

/**
 * Call `run` with the latest arguments once calls stop for `DEBOUNCE_MS`.
 * Results of a run that a newer run superseded are dropped: `run` gets a
 * function that tells whether it is still the latest.
 */
export function latest<A extends unknown[]>(
  run: (isLatest: () => boolean, ...args: A) => Promise<void>,
) {
  let timer: number | undefined;
  let generation = 0;
  const now = (...args: A) => {
    clearTimeout(timer);
    const mine = ++generation;
    return run(() => mine === generation, ...args);
  };
  const debounced = (...args: A) => {
    clearTimeout(timer);
    timer = window.setTimeout(() => now(...args), DEBOUNCE_MS);
  };
  return { now, debounced };
}

/** Quote a search term in a heading or message. */
export const quoted = (term: string): string => `“${term}”`;
