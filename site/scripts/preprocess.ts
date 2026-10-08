import { readFileSync } from "node:fs";
import { toCommonmark } from "../src/lib/nixpkgs-markdown.ts";

const [fname] = process.argv.slice(2);

if (!fname) {
  throw "First argument must be the file to convert";
}
// File in nixpkgs syntax
const orig = readFileSync(fname, "utf8");

// Converted file content as a string
const converted = toCommonmark(orig);

// Print to stdout
process.stdout.write(converted);
