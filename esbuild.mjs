import esbuild from "esbuild";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const resolvePackage = (path, resolveDir) =>
  require.resolve(path, { paths: [resolveDir || process.cwd()] });

esbuild.build({
  stdin: {
    contents: readFileSync("src/spotify-grid-card.ts", "utf8"),
    loader: "ts",
    resolveDir: process.cwd(),
    sourcefile: "src/spotify-grid-card.ts",
  },
  bundle: true,
  minify: true,
  target: ["es2020"],
  format: "esm",
  tsconfig: "tsconfig.json",
  nodePaths: ["node_modules"],
  plugins: [
    {
      name: "resolve-packages",
      setup(build) {
        build.onResolve(
          { filter: /^(?:@[^/]+\/[^/]+|lit|lit-html|lit-element|custom-card-helpers)(?:\/.*)?$/ },
          (args) => ({
            path: resolvePackage(args.path, args.resolveDir),
          })
        );
        build.onResolve({ filter: /^\.\.?\// }, (args) => {
          if (!args.resolveDir) {
            return;
          }
          return {
            path: resolve(args.resolveDir, args.path),
          };
        });
      },
    },
  ],
  outfile: "dist/spotify-grid-card.js",
}).catch(() => process.exit(1));
