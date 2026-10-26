import type { OxfmtConfig } from "oxfmt";

export default {
  ignorePatterns: [
    "src/app/_payload/importMap.js",
    "src/migrations/",
    "src/payload-types.ts",
    "src/routeTree.gen.ts",
    "tsconfig.json",
  ],
  sortImports: true,
  sortTailwindcss: true,
  sortPackageJson: true,
} satisfies OxfmtConfig;
