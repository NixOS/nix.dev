/**
 * Input preprocessing to convert the markdown flavour of the nixpkgs manual to plain CommonMark.
 *
 */

type Fence = { count: number; char: string; info: string };

function fenceAt(line: string, allowInfo: boolean): Fence | null {
  const char = line[0];
  if (char !== "`" && char !== "~") return null;
  let count = 1;
  while (line[count] === char) count++;
  if (count < 3) return null;
  const info = line.slice(count).trim();
  if (info !== "" && !allowInfo) return null;
  return { count, char, info };
}

/**
 * Marks the lines that belong to a fenced code block, delimiters included,
 * and reports the fence still open at the end of the input. Mirrors the fence
 * tracking in nixos-render-docs so that headings, `:::` markers and `:` lines
 * inside code samples are left alone.
 */
function scanFences(lines: string[]): {
  fenced: boolean[];
  open: Fence | null;
} {
  const fenced = new Array<boolean>(lines.length).fill(false);
  let open: Fence | null = null;
  lines.forEach((raw, i) => {
    const line = raw.replace(/^ {0,3}/, "");
    if (line.startsWith("```") || line.startsWith("~~~")) {
      if (open === null) {
        open = fenceAt(line, true);
      } else {
        const end = fenceAt(line, false);
        if (end && end.char === open.char && end.count >= open.count) {
          open = null;
        }
      }
      fenced[i] = true;
      return;
    }
    fenced[i] = open !== null;
  });
  return { fenced, open };
}

/** The fence left open at the end of the text, if any. */
export function unterminatedFence(text: string): string | undefined {
  const { open } = scanFences(text.split("\n"));
  return open ? open.char.repeat(open.count) : undefined;
}

const HEADING = /^ {0,3}(#+)\s+(.*?)\s*(?:\{#([\w.-]+)\})?\s*$/;

/** Headings of a document, with the explicit anchor nixpkgs docs carry. */
export function headings(
  text: string,
): { depth: number; title: string; id?: string }[] {
  const lines = text.split("\n");
  const { fenced } = scanFences(lines);
  const found: { depth: number; title: string; id?: string }[] = [];
  lines.forEach((line, i) => {
    if (fenced[i]) return;
    const heading = HEADING.exec(line);
    if (!heading) return;
    const id = heading[3];
    found.push({
      depth: heading[1]!.length,
      title: heading[2]!,
      ...(id ? { id } : {}),
    });
  });
  return found;
}

/**
 * The `{.example #id}` and `{.figure #id}` containers of a document.
 */
export function containers(text: string): { id: string; title: string }[] {
  const lines = text.split("\n");
  const { fenced } = scanFences(lines);
  const found: { id: string; title: string }[] = [];
  lines.forEach((line, i) => {
    if (fenced[i]) return;
    const opened = CONTAINER_OPEN.exec(line);
    if (!opened) return;
    const id = /(?:^|\s)#([\w.-]+)/.exec(opened[3]!);
    if (!id) return;
    const heading = lines
      .slice(i + 1, i + 4)
      .map((next) => HEADING.exec(next))
      .find(Boolean);
    found.push({ id: id[1]!, title: heading ? heading[2]! : id[1]! });
  });
  return found;
}

/** A line that starts a block and therefore ends the lead paragraph. */
const BLOCK_START = /^\s*(#|>|:{3,}|[-*+] |\d+\. |:( |$)|```|~~~|\|)/;

/** Plain-text lead paragraph, for listings and meta descriptions. */
export function leadText(markdown: string): string {
  const lead: string[] = [];
  for (const line of markdown.split("\n")) {
    const text = line.trim();
    if (text === "") {
      if (lead.length > 0) break;
      continue;
    }
    // a document may open with a comment or a bare inline anchor
    if (text.startsWith("<!--") || /^\[\]\{[^}]*\}$/.test(text)) continue;
    if (BLOCK_START.test(line)) break;
    lead.push(text);
  }
  const plain = lead
    .join(" ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[`*_]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > 200 ? `${plain.slice(0, 199).trimEnd()}…` : plain;
}

const CONTAINER_OPEN = /^([ \t]*)(:{3,})\s*\{([^}]*)\}\s*$/;

/**
 * Rewrites anonymous `:::{.class}` containers into named directives:
 * `::: {.note}` -> `:::note`, `::: {.example #id}` -> `:::example{#id}`.
 */
function nameContainers(lines: string[], fenced: boolean[]): void {
  lines.forEach((line, i) => {
    if (fenced[i]) return;
    const opened = CONTAINER_OPEN.exec(line);
    if (!opened) return;
    const tokens = opened[3]!.split(/\s+/).filter(Boolean);
    const cls = tokens.find((token) => token.startsWith("."));
    if (!cls) return;
    const rest = tokens.filter((token) => token !== cls);
    const attributes = rest.length ? `{${rest.join(" ")}}` : "";
    lines[i] = `${opened[1]}${opened[2]}${cls.slice(1)}${attributes}`;
  });
}

/** Rewrites nixpkgs-flavoured markdown (mix of MyST & Custom syntax) into CommonMark
 *
 * TODO: Reduce the preprocsssing; (1) write mdast plugins; (2) migrate content; (3) remainder.
 * The remainder shall get smaller over time.
 */
export function toCommonmark(markdown: string): string {
  const lines = markdown.split("\n");
  nameContainers(lines, scanFences(lines).fenced);
  return lines.join("\n");
}
