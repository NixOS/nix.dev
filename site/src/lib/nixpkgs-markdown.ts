/**
 * Input preprocessing to convert the markdown flavour of the nixpkgs manual to plain CommonMark.
 *
 */

export interface AnchorTarget {
  href: string;
  text: string;
}

export interface ConvertOptions {
  /** Resolves an `(#anchor)` reference. */
  anchor?: (id: string) => AnchorTarget | undefined;
  /** Man page urls keyed by `page(section)`, from manpage-urls.json. */
  manpageUrls?: Record<string, string>;
  /** Called with a description of content this converter has to drop. */
  onDrop?: (what: string) => void;
}

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

/** Increases the level of every heading, capped at `######` (h6) */
export function shiftHeadings(text: string, levels: number): string {
  const lines = text.split("\n");
  const { fenced } = scanFences(lines);
  return lines
    .map((line, i) => {
      if (fenced[i]) return line;
      const heading = /^ {0,3}(#+)(.*)$/.exec(line);
      if (!heading) return line;
      const depth = Math.min(heading[1]!.length + levels, 6);
      return "#".repeat(depth) + heading[2];
    })
    .join("\n");
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

/** Ids of the bracketed spans a document uses as inline anchors. */
export function inlineAnchorIds(text: string): string[] {
  const found: string[] = [];
  for (const match of text.matchAll(BRACKETED_SPAN)) {
    const id = /(?:^|\s)#([\w.-]+)/.exec(match[2]!);
    if (id) found.push(id[1]!);
  }
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

/**
 * TODO: Hamornize the source
 * Names the manual uses that the syntax highlighter spells differently.
 */
const LANGUAGE_ALIASES: Record<string, string> = {
  "shell-session": "shellsession",
};

/**
 * Walks the fenced blocks. `{=include=}` blocks are ignored
 *
 * Language names are lowercased: i.e. `ShellSession` -> `shellsession`
 *
 * Indentation is ignored here
 */
function convertFences(lines: string[], onDrop?: (what: string) => void): void {
  let open: Fence | null = null;
  let dropping = false;
  lines.forEach((raw, i) => {
    const indent = indentOf(raw);
    const line = raw.slice(indent.length);
    if (open === null) {
      const fence = fenceAt(line, true);
      if (!fence) return;

      // TODO: Remove all remaining {=include=} from nixpkgs
      open = fence;
      dropping = fence.info.startsWith("{=include=}");
      if (dropping) {
        onDrop?.(`${fence.info} block`);
        lines[i] = "";
        return;
      }

      // TODO: Add nixpkgs linter so people dont misspell shell-session?
      const [name = "", ...meta] = fence.info.split(/\s+/);
      const language =
        LANGUAGE_ALIASES[name.toLowerCase()] ?? name.toLowerCase();
      const info = [language, ...meta].join(" ").trimEnd();

      lines[i] = indent + fence.char.repeat(fence.count) + info;
      return;
    }
    const end = fenceAt(line, false);
    if (end && end.char === open.char && end.count >= open.count) open = null;
    if (dropping) {
      lines[i] = "";
      if (open === null) dropping = false;
    }
  });
}

function indentOf(line: string): string {
  return /^[ \t]*/.exec(line)![0]!;
}

const ADMONITIONS: Record<string, string> = {
  note: "Note",
  tip: "Tip",
  important: "Important",
  warning: "Warning",
  caution: "Caution",
};

const CONTAINER_OPEN = /^([ \t]*)(:{3,})\s*\{([^}]*)\}\s*$/;
const CONTAINER_CLOSE = /^([ \t]*)(:{3,})\s*$/;

/**
 * Rewrites `:::{.class}` containers. Admonitions become blockquotes with a
 * bold label; an example or figure keeps its content and loses its markers,
 * because its own heading already labels it.
 */
function convertContainers(lines: string[], fenced: boolean[]): string[] {
  const out: string[] = [];
  const open: { label: string | null; indent: string; marker: number }[] = [];

  const emit = (line: string) => {
    const innermost = open[open.length - 1];
    const base = innermost?.indent ?? "";
    const quotes = open.filter((frame) => frame.label !== null).length;
    const content = line.startsWith(base) ? line.slice(base.length) : line;
    const prefix = base + "> ".repeat(quotes);
    out.push(content === "" ? prefix.trimEnd() : prefix + content);
  };

  lines.forEach((line, i) => {
    if (!fenced[i]) {
      const opened = CONTAINER_OPEN.exec(line);
      if (opened) {
        const label =
          opened[3]!
            .split(/\s+/)
            .filter((token) => token.startsWith("."))
            .map((token) => ADMONITIONS[token.slice(1)])
            .find(Boolean) ?? null;
        const id = /(?:^|\s)#([\w.-]+)/.exec(opened[3]!);
        open.push({ label, indent: opened[1]!, marker: opened[2]!.length });
        if (label) {
          emit(`**${label}**`);
          emit("");
        } else {
          out.push("");
        }
        // an example or figure is referenced by its id, so it needs an anchor
        // of its own once the container markup is gone
        if (id) {
          emit(`<span id="${id[1]}"></span>`);
          emit("");
        }
        return;
      }
      const closed = CONTAINER_CLOSE.exec(line);
      const innermost = open[open.length - 1];
      if (closed && innermost) {
        if (closed[2]!.length >= innermost.marker) open.pop();
        emit("");
        return;
      }
    }
    emit(line);
  });

  return out;
}

/** `[label]{#id .class}`, the manual's bracketed spans. */
const BRACKETED_SPAN = /\[([^\]]*)\]\{([^}]*)\}/g;

/** `{role}`content``, a MyST role. */
const ROLE = /\{([a-z][a-z0-9]*)\}(`+)(.+?)\2/g;

const EMPTY_LINK = /\[\]\((#[\w.-]+)\)/g;
const ANCHOR_LINK = /\[([^\]]+)\]\((#[\w.-]+)\)/g;

/**
 * Example of a role: {manpage}`nix.conf(5)` -> [nix.conf(5)](https://path/nix/5)
 * The 'manpage' role needs to be resolved via manpage-urls.json
 * The rest is passed through
 * TODO: Make this a sätteri plugin
 * satteri({ mdastPlugins: [ mystRoles( ... ) ] })
 */
function renderRole(
  name: string,
  content: string,
  options: ConvertOptions,
): string {
  if (name === "command") return `**\`${content}\`**`;
  if (name === "manpage") {
    const url = options.manpageUrls?.[content];
    return url ? `[\`${content}\`](${url})` : `\`${content}\``;
  }
  // file, var, env, option and anything else the manual marks up inline
  return `\`${content}\``;
}

/** Applies `convert` to the parts of a line that are not inline code. */
function outsideCode(line: string, convert: (text: string) => string): string {
  const out: string[] = [];
  let rest = line;
  for (;;) {
    const start = rest.search(/`+/);
    if (start < 0) {
      out.push(convert(rest));
      return out.join("");
    }
    const ticks = /`+/.exec(rest.slice(start))![0];
    const end = rest.indexOf(ticks, start + ticks.length);
    if (end < 0) {
      out.push(convert(rest));
      return out.join("");
    }
    out.push(convert(rest.slice(0, start)));
    out.push(rest.slice(start, end + ticks.length));
    rest = rest.slice(end + ticks.length);
  }
}

function convertReferences(text: string, options: ConvertOptions): string {
  return text
    .replace(BRACKETED_SPAN, (span, label: string, attrs: string) => {
      const id = /(?:^|\s)#([\w.-]+)/.exec(attrs);
      if (!id) return span;
      return `<span id="${id[1]}">${label}</span>`;
    })
    .replace(EMPTY_LINK, (_span, anchor: string) => {
      const target = options.anchor?.(anchor.slice(1));
      if (!target) {
        options.onDrop?.(`link to unknown anchor ${anchor}`);
        return `\`${anchor}\``;
      }
      return `[${target.text}](${target.href})`;
    })
    .replace(ANCHOR_LINK, (_link, label: string, anchor: string) => {
      const target = options.anchor?.(anchor.slice(1));
      if (!target) {
        options.onDrop?.(`link to unknown anchor ${anchor}`);
        return label;
      }
      return `[${label}](${target.href})`;
    });
}

/** Rewrites roles, bracketed spans and anchor references line by line */
function convertInline(
  lines: string[],
  fenced: boolean[],
  options: ConvertOptions,
): void {
  lines.forEach((line, i) => {
    if (fenced[i]) return;
    const roles = line.replace(
      ROLE,
      (_role, name: string, _ticks: string, content: string) =>
        renderRole(name, content, options),
    );
    lines[i] = outsideCode(roles, (text) => convertReferences(text, options));
  });
}

/** Rewrites nixpkgs-flavoured markdown (mix of MyST & Custom syntax) into CommonMark
 *
 * TODO: Reduce the preprocsssing; (1) write mdast plugins; (2) migrate content; (3) remainder.
 * The remainder shall get smaller over time.
 */
export function toCommonmark(
  markdown: string,
  options: ConvertOptions = {},
): string {
  const lines = markdown.split("\n");
  convertFences(lines, options.onDrop);

  const blocks = scanFences(lines).fenced;
  convertInline(lines, blocks, options);

  return convertContainers(lines, blocks).join("\n");
}
