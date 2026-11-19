// main.ts — entry program for make.fun news-image-20261118.
// Copies the pre-drawn entry.png into $MAKEFUN_OUTPUT_DIR/entry.png.
// Standard library only, no network. Deterministic: byte-identical output.
import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}
mkdirSync(outDir, { recursive: true });
const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, "entry.png");
const bytes = readFileSync(src);
// sanity: PNG signature + 1024x1024 + under 1 MiB, so a broken file never ships
const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!bytes.subarray(0, 8).equals(sig)) throw new Error("entry.png is not a PNG");
if (bytes.readUInt32BE(16) !== 1024 || bytes.readUInt32BE(20) !== 1024) {
  throw new Error("entry.png is not 1024x1024");
}
if (bytes.length > 1048576) throw new Error("entry.png exceeds 1 MiB");
copyFileSync(src, join(outDir, "entry.png"));
const hash = createHash("sha256").update(bytes).digest("hex");
const size = statSync(join(outDir, "entry.png")).size;
console.log(`entry.png copied to ${join(outDir, "entry.png")} (${size} bytes, sha256 ${hash})`);
