import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Agent tooling, not project source: the Impeccable design skill vendors
    // its own bundled scripts under .claude/, and keeps its working files
    // (surface briefs, review captures) under .impeccable/.
    ".claude/**",
    ".impeccable/**",
  ]),
]);

export default eslintConfig;
