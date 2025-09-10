import { build } from "esbuild";

const watch = process.argv.includes("--watch");

await build({
  entryPoints: ["src/spotify-grid-card.ts"],
  bundle: true,
  minify: true,
  sourcemap: true,
  outfile: "dist/spotify-grid-card.js",
  format: "esm",
  target: ["es2022"],
  treeShaking: true,
  logLevel: "info",
  watch,
});
