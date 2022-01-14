const esbuild = require("esbuild");
const args = process.argv.slice(2);

const isDevelopment = args.includes("--dev");
const isWatching = isDevelopment && args.includes("--watch");
const isProduction = !isDevelopment;

esbuild.build({
  entryPoints: ["./src/index.ts"],
  outdir: "build",
  minify: isProduction,
  watch: isWatching,
  bundle: true,
});
