import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: ["packages/*"],
    coverage: {
      reporter: ["text", "json-summary", "json"],
      reportOnFailure: true,
      include: ["packages/**/*.{ts,tsx}"],
      exclude: ["**/build/**", "**/.papi/**", "packages/eslint-config", "packages/test"],
    },
  },
});
