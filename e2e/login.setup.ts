import { expect, test as setup } from "@playwright/test";

/**
 * Logger ind én gang og gemmer sessionen.
 *
 * Uden det her logger hver test ind for sig, og efter otte forsøg slår
 * admin-loginets brute-force-værn til (per-IP 8 pr. 15 min). Testene begyndte
 * derfor at fejle på nummer ni — værnet gjorde præcis sit arbejde.
 */
const SESSION = "e2e/.session.json";

setup("log ind én gang", async ({ page }) => {
  await page.goto("/admin");
  await page.getByLabel("Brugernavn").fill("test");
  await page.getByLabel("Adgangskode").fill("test-kode-1234");
  await page.locator('form button[type="submit"]').first().click();

  // Login-siden bærer samme overskrift som kommandocentret, så den kan ikke
  // bruges som kvittering. Vent på, at adgangskodefeltet forsvinder.
  await expect(page.getByLabel("Adgangskode")).toHaveCount(0, { timeout: 15_000 });

  await page.goto("/admin/regnskab?del=oversigt");
  await expect(page.locator("nav.regnskab-nav")).toBeVisible({ timeout: 15_000 });

  await page.context().storageState({ path: SESSION });
});
