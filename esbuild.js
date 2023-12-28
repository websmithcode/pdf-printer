import * as esbuild from "esbuild";

const buildOptions = {
  entryPoints: ["index.ts"],
  bundle: true,
  minify: true,
  target: ["node18"],
  platform: "node",
  outfile: "dist/bundle.cjs",
  banner: {
    js: "require('path').dirname(process.execPath);",
  },
};

esbuild.build(buildOptions).catch(() => process.exit(1));
