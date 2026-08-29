import { expect, test } from "@playwright/test";

/**
 * E2E for regnskabet.
 *
 * Det her fanger den slags, unit-tests ikke kan: at en komponent slet ikke er
 * sat ind på siden (det skete faktisk), at et tal flyder ud af sin boks, at
 * en fane ikke kan nås, eller at en beskyttet rute er åben.
 */

test.describe("adgangskontrol", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("regnskabet er lukket uden login", async ({ page }) => {
    const svar = await page.goto("/admin/regnskab");
    // Skal ende på login-siden, ikke på regnskabet.
    expect(page.url()).not.toContain("del=");
    expect(svar?.status()).toBeLessThan(400);
    await expect(page.getByText(/ODIN · REGNSKAB/)).toHaveCount(0);
  });

  test("bilagsfiler kan ikke hentes med et gættet id", async ({ request }) => {
    const r = await request.get("/admin/regnskab/bilag/et-gaet");
    expect(r.status()).toBe(401);
  });

  test("startdata kan ikke sendes uden session", async ({ request }) => {
    const r = await request.post("/admin/regnskab/import-data", {
      data: { fakturaer: [] },
    });
    expect(r.status()).toBe(401);
  });

  test("regnskabet holdes ude af søgemaskiner", async ({ page }) => {
    await page.goto("/admin");
    const robots = await page
      .locator('meta[name="robots"]')
      .getAttribute("content");
    expect(robots).toMatch(/noindex/);
  });
});

test.describe("forsiden", () => {
  test("svarer og har præcis én h1", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("ruller ikke vandret", async ({ page }) => {
    await page.goto("/");
    const overloeb = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(overloeb, "siden er bredere end vinduet").toBe(false);
  });

  test("har ingen brudte interne links", async ({ page, request }) => {
    await page.goto("/");
    const href = await page
      .locator('a[href^="/"]:not([href^="//"])')
      .evaluateAll((a) => [...new Set(a.map((x) => x.getAttribute("href")!))]);
    for (const h of href) {
      const r = await request.get(h, { maxRedirects: 0 });
      expect(r.status(), `${h} svarede ${r.status()}`).toBeLessThan(400);
    }
  });
});

test.describe("regnskabet med login", () => {

  test("alle faner kan åbnes og viser indhold", async ({ page }) => {
    const dele = [
      "oversigt", "odin", "firma", "privat", "statistik",
      "fakturaer", "bilag", "moms", "redegoerelse",
      "skat", "fradrag", "aarsopgoerelse", "frister",
      "import", "viden", "opsaetning",
    ];
    for (const del of dele) {
      await page.goto(`/admin/regnskab?del=${del}`);
      // En fane, der kaster, ender med Next.js' fejlside.
      await expect(
        page.getByText(/Application error|Internal Server Error/i),
        `${del} kastede en fejl`,
      ).toHaveCount(0);
      // Fanen skal faktisk være den valgte — uden gennemført onboarding
      // viser siden kun Opsætning, uanset hvad der står i ?del=.
      // Områdenavigationen markerer altid den aktive gruppe.
      await expect(
        page.locator("nav.regnskab-nav a.aktiv"),
        `${del} blev ikke markeret i områdenavigationen`,
      ).toHaveCount(1);
      // Og den skal have indhold, ikke bare et tomt panel.
      await expect(
        page.locator("section.hud-panel").first(),
        `${del} har intet panel`,
      ).toBeVisible();
    }
  });

  test("startdatafeltet findes på import-fanen", async ({ page }) => {
    // Præcis den fejl, der slap igennem typecheck og build: komponenten
    // var aldrig sat ind, så der var kun CSV-feltet.
    await page.goto("/admin/regnskab?del=import");
    await expect(page.getByText(/Startdata/)).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Indlæs startdata/i }),
    ).toBeVisible();
  });

  test("periodevælgeren dækker hele spændet", async ({ page }) => {
    await page.goto("/admin/regnskab?del=statistik");
    for (const navn of [
      "Seneste 12 timer", "I dag", "7 dage", "30 dage", "90 dage",
      "Siden første faktura", "Siden firmaets start", "Alt",
    ]) {
      await expect(
        page.getByRole("button", { name: navn, exact: true }),
        `perioden "${navn}" mangler`,
      ).toBeVisible();
    }
  });

  test("periodevalg viser det faktiske datointerval", async ({ page }) => {
    await page.goto("/admin/regnskab?del=statistik");
    await page.getByRole("button", { name: "Siden firmaets start", exact: true }).click();
    // Spændet står under knapperne og skal nævne virksomhedens startdato.
    await expect(page.locator(".regnskab-periode-spand")).toContainText(/okt\.? 2025/);
    // Og valget skal forklare, hvor datoen kommer fra.
    await expect(page.locator(".regnskab-periode-note")).toContainText(/CVR/);
  });

  test("12-timers-valget forklarer, at bankdata ikke har klokkeslæt", async ({ page }) => {
    await page.goto("/admin/regnskab?del=statistik");
    await page.getByRole("button", { name: "Seneste 12 timer", exact: true }).click();
    await expect(page.locator(".regnskab-periode-note")).toContainText(/klokkeslæt/);
  });

  test("ingen tal flyder ud af deres boks", async ({ page }) => {
    for (const del of ["oversigt", "statistik", "moms", "skat", "fradrag"]) {
      await page.goto(`/admin/regnskab?del=${del}`);
      const overloeb = await page.evaluate(() => {
        const daarlige: string[] = [];
        for (const el of document.querySelectorAll(
          ".hud-readout, .hud-readout-xl, .regnskab-rubrik-tal, .regnskab-fradrag-tal, .stribe .bel, .hud-bar-tal",
        )) {
          // 2 px slør for afrunding i layoutmotoren.
          if (el.scrollWidth > el.clientWidth + 2) {
            daarlige.push(`${el.className}: "${el.textContent?.trim()}"`);
          }
        }
        return daarlige;
      });
      expect(overloeb, `${del}: tal flyder ud af boksen`).toEqual([]);
    }
  });

  test("siden ruller ikke vandret på nogen fane", async ({ page }) => {
    for (const del of ["oversigt", "statistik", "moms", "aarsopgoerelse", "fakturaer"]) {
      await page.goto(`/admin/regnskab?del=${del}`);
      const overloeb = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      );
      expect(overloeb, `${del} ruller vandret`).toBe(false);
    }
  });

  test("intet indhold ligger uden for skærmen", async ({ page }) => {
    // overflow-x: clip skjuler overløb i stedet for at give vandret scroll,
    // så "ruller ikke vandret" kan være grøn, mens en knap i praksis er
    // uden for skærmen og umulig at ramme. Det skete på mobil.
    for (const del of ["oversigt", "aarsopgoerelse", "fradrag", "moms", "fakturaer"]) {
      await page.goto(`/admin/regnskab?del=${del}`);
      const udenfor = await page.evaluate(() => {
        const bredde = document.documentElement.clientWidth;
        const daarlige: string[] = [];
        for (const el of document.querySelectorAll(
          "button, a, input, .regnskab-rubrik-tal, .regnskab-fradrag-tal, .hud-readout",
        )) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 && r.height === 0) continue;
          if (r.right > bredde + 1 || r.left < -1) {
            daarlige.push(
              `${el.tagName}.${el.className}: x ${Math.round(r.left)}–${Math.round(r.right)} (skærm ${bredde})`,
            );
          }
        }
        return daarlige;
      });
      expect(udenfor, `${del}: indhold uden for skærmen`).toEqual([]);
    }
  });

  test("hvert ?-ikon kan foldes ud", async ({ page }) => {
    // Kører som en bruger, der har bedt om mindre bevægelse. Det stopper
    // indlæsnings-animationen og den bløde scroll — uden dem kan en knap
    // langt nede på en lang side aldrig nå at stå stille længe nok til at
    // blive ramt. Testen bekræfter samtidig, at prefers-reduced-motion
    // faktisk virker.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/admin/regnskab?del=aarsopgoerelse");
    const knapper = page.locator("button.regnskab-hjaelp");
    const antal = await knapper.count();
    expect(antal, "der er ingen ?-knapper").toBeGreaterThan(3);
    for (let i = 0; i < Math.min(antal, 5); i++) {
      const k = knapper.nth(i);
      await k.scrollIntoViewIfNeeded();
      await k.click();
      await expect(k).toHaveAttribute("aria-expanded", "true");
      await k.click();
      await expect(k).toHaveAttribute("aria-expanded", "false");
    }
  });

  test("bevægelse kan slås fra", async ({ page }) => {
    // Uendelige animationer — aurora-drift, roterende ringe, pulserende
    // auraer — skal stoppe for brugere med vestibulære lidelser.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/admin/regnskab?del=oversigt");
    const kørende = await page.evaluate(() =>
      [...document.querySelectorAll("*")].filter((el) => {
        const cs = getComputedStyle(el);
        return (
          cs.animationName !== "none" &&
          cs.animationIterationCount === "infinite" &&
          parseFloat(cs.animationDuration) > 0.01
        );
      }).length,
    );
    expect(kørende, "der kører stadig uendelige animationer").toBe(0);
  });

  test("navigationen er grupperet i to niveauer", async ({ page }) => {
    await page.goto("/admin/regnskab?del=moms");
    await expect(page.locator("nav.regnskab-undernav")).toBeVisible();
    await expect(
      page.locator("nav.regnskab-undernav a", { hasText: "Redegørelse" }),
    ).toBeVisible();
  });
});
