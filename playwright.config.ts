import { defineConfig, devices } from "@playwright/test";

/**
 * E2E kører mod en lokal produktionsbygning, ikke mod dev-serveren.
 * Dev-serveren opfører sig anderledes nok — anden fejlvisning, anden
 * hydrering — til at en grøn test dér ikke siger noget om produktion.
 *
 * DATA_DIR peges på en midlertidig mappe, så testene aldrig kan røre det
 * rigtige regnskab.
 */
export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/opsaetning.ts",
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  timeout: 30_000,
  use: {
    baseURL: "http://localhost:3111",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    locale: "da-DK",
    timezoneId: "Europe/Copenhagen",
  },
  projects: [
    { name: "login", testMatch: /login\.setup\.ts/ },
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], storageState: "e2e/.session.json" },
      dependencies: ["login"],
    },
    {
      name: "mobil",
      use: { ...devices["Pixel 7"], storageState: "e2e/.session.json" },
      dependencies: ["login"],
    },
  ],
  webServer: {
    // Bygger altid først. Ellers kører testene mod en gammel .next-mappe,
    // og en ændring, der ikke er bygget, ser ud til at virke.
    command: "npm run build && npm run start -- --port 3111",
    url: "http://localhost:3111",
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      DATA_DIR: "./.e2e-data",
      ADMIN_USERNAME: "test",
      ADMIN_PASSWORD: "test-kode-1234",
      AUTH_SECRET: "e2e-hemmelighed-der-kun-bruges-i-test",
      NODE_ENV: "production",
    },
  },
});
