import { build } from "esbuild";

await build({
	entryPoints: ["src/content-script.ts"],
	// outfile: "dist/bundled-content-script.js",
	bundle: true,
	minify: true,
	outdir: "dist",
	platform: "browser",
	target: "es2020",
	format: "esm"
});
