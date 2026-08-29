import { defineConfig } from "vitest/config";

export default defineConfig({
  // Regnskabet regner i hele øre. En afrundingsfejl ét sted forplanter sig
  // hele vejen til momsangivelsen, så testene skal fejle hårdt og hurtigt.
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
