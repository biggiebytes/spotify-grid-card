import esbuild from "esbuild";

esbuild.build({
  entryPoints: ["src/spotify-grid-card.ts"],
  bundle: true,
  minify: true,
  target: ["es2020"],
  format: "esm",
  outfile: "dist/spotify-grid-card.js",
}).catch(() => process.exit(1));
