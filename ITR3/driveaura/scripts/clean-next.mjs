/**
 * Remove build caches so Webpack/Next don't load stale chunk references
 * (e.g. Cannot find module './611.js', './331.js', './vendor-chunks/@firebase.js').
 */
import { rmSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const dirs = [".next", join("node_modules", ".cache"), ".turbo"];

for (const rel of dirs) {
  const dir = join(root, rel);
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true });
    console.log(`Removed ${rel}`);
  }
}
console.log("Clean complete. Run npm run dev or npm run build.");
