import { coverageConfigDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: ["packages/*"],
    coverage: {
      reporter: ["text", "json-summary", "json"],
      reportOnFailure: true,
      include: ["packages/**"],
      exclude: [
        "**/build/**",
        "packages/eslint-config",
        "packages/test",
        ...coverageConfigDefaults.exclude,
      ],
    },
  },
});
