"use client";

import { useEffect, useState } from "react";
import { dict, STORAGE_KEY, type Lang } from "@/lib/i18n";
import { LogoLockup, LogoMark } from "./Logo";

export function Site() {
  const [lang, setLang] = useState<Lang>("da");
  const [menuOpen, setMenuOpen] = useState(false);
  const t = dict[lang];

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "da") {
      setLang(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  function switchLang(next: Lang) {
    setLang(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next;
  }

  // Scroll-reveal: .reveal-elementer får .in når de rammer viewporten
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(".reveal"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const navLinks = [
    { href: "#produkter", label: t.navProducts },
    { href: "#ydelser", label: t.navServices },
    { href: "#om", label: t.navAbout },
    { href: "#kontakt", label: t.navContact },
  ];

  return (
    <>
      <a href="#indhold" className="skip-link">
        {t.skipToContent}
      </a>

      {/* Atmosfære: aurora-glød + korn */}
      <div className="aurora" aria-hidden="true">
        <div className="aurora-band aurora-a" />
        <div className="aurora-band aurora-b" />
      </div>
      <div className="grain" aria-hidden="true" />

      <header className="nav">
        <a href="#top" className="nav-logo" aria-label="Camsilo">
          <LogoLockup size={26} />
        </a>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`} aria-label="Hovedmenu">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="nav-right">
          <div className="lang-switch" role="group" aria-label="Sprog / Language">
            <button
              type="button"
              className={lang === "da" ? "active" : ""}
              onClick={() => switchLang("da")}
              aria-pressed={lang === "da"}
            >
              DA
            </button>
            <span aria-hidden="true">⁄</span>
            <button
              type="button"
              className={lang === "en" ? "active" : ""}
              onClick={() => switchLang("en")}
              aria-pressed={lang === "en"}
            >
              EN
            </button>
          </div>
          <button
            type="button"
            className="nav-burger"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <main id="indhold">
        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="hero" id="top">
          <div className="hero-watermark" aria-hidden="true">
            <LogoMark size={560} />
          </div>

          <p className="hero-kicker rise" style={{ animationDelay: "0.05s" }}>
            <span className="rune-accent" aria-hidden="true">
              ᚲ
            </span>{" "}
            {t.heroKicker}
          </p>

          <h1 className="hero-title">
            <span className="rise" style={{ animationDelay: "0.15s" }}>
              {t.heroTitleA}
            </span>
            <span className="rise hero-title-accent" style={{ animationDelay: "0.28s" }}>
              {t.heroTitleB}
            </span>
          </h1>

          <p className="hero-sub rise" style={{ animationDelay: "0.42s" }}>
            {t.heroSub}
          </p>

          <div className="hero-ctas rise" style={{ animationDelay: "0.55s" }}>
            <a className="btn-solid" href="#produkter">
              {t.heroCtaPrimary}
            </a>
            <a className="btn-ghost" href="#kontakt">
              {t.heroCtaSecondary}
            </a>
          </div>

          <p className="hero-note rise" style={{ animationDelay: "0.7s" }}>
            {t.heroRuneNote}
          </p>
        </section>

        {/* ── Runebånd ─────────────────────────────────────────── */}
        <div className="rune-band" aria-hidden="true">
          <div className="rune-band-track">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i}>ᚲᚨᛗᛋᛁᛚᛟ · CAMSILO · </span>
            ))}
          </div>
        </div>

        {/* ── PRODUKTER ────────────────────────────────────────── */}
        <section className="section" id="produkter">
          <p className="section-label reveal">{t.productsLabel}</p>
          <h2 className="section-title reveal">{t.productsTitle}</h2>

          <div className="product-grid">
            <a
              className="card product-card reveal"
              href="https://termocalc.dk"
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className="card-tag tag-live">
                <span className="dot" aria-hidden="true" />
                {t.termoTag}
              </p>
              <h3>{t.termoTitle}</h3>
              <p className="card-desc">{t.termoDesc}</p>
              <p className="card-link">
                {t.termoLink} <span aria-hidden="true">↗</span>
              </p>
            </a>

            <div className="card product-card card-muted reveal" style={{ transitionDelay: "0.1s" }}>
              <p className="card-tag">{t.nextTag}</p>
              <h3>{t.nextTitle}</h3>
              <p className="card-desc">{t.nextDesc}</p>
              <p className="card-runes" aria-hidden="true">
                ᛒᛁᛞᚨ
              </p>
            </div>
          </div>
        </section>

        {/* ── YDELSER ──────────────────────────────────────────── */}
        <section className="section" id="ydelser">
          <p className="section-label reveal">{t.servicesLabel}</p>
          <h2 className="section-title reveal">{t.servicesTitle}</h2>

          <div className="service-grid">
            {[
              { n: "01", title: t.s1Title, desc: t.s1Desc },
              { n: "02", title: t.s2Title, desc: t.s2Desc },
              { n: "03", title: t.s3Title, desc: t.s3Desc },
              { n: "04", title: t.s4Title, desc: t.s4Desc },
            ].map((s, i) => (
              <div
                key={s.n}
                className="card service-card reveal"
                style={{ transitionDelay: `${i * 0.07}s` }}
              >
                <p className="service-num">{s.n}</p>
                <h3>{s.title}</h3>
                <p className="card-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── OM ───────────────────────────────────────────────── */}
        <section className="section" id="om">
          <p className="section-label reveal">{t.aboutLabel}</p>
          <h2 className="section-title reveal">{t.aboutTitle}</h2>
          <p className="about-body reveal">{t.aboutBody}</p>

          <div className="value-grid">
            {[
              { title: t.v1Title, desc: t.v1Desc },
              { title: t.v2Title, desc: t.v2Desc },
              { title: t.v3Title, desc: t.v3Desc },
            ].map((v, i) => (
              <div key={v.title} className="value reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
                <span className="value-rune" aria-hidden="true">
                  ᚲ
                </span>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── KONTAKT ──────────────────────────────────────────── */}
        <section className="section section-contact" id="kontakt">
          <p className="section-label reveal">{t.contactLabel}</p>
          <h2 className="section-title contact-title reveal">{t.contactTitle}</h2>
          <p className="card-desc reveal">{t.contactBody}</p>
          <a className="contact-mail reveal" href="mailto:kontakt@camsilo.dk">
            {t.contactCta} <span aria-hidden="true">→</span>
          </a>
        </section>
      </main>

      <footer className="footer">
        <LogoMark size={22} />
        <p>{t.footerLine}</p>
        <p className="footer-runes" title={t.footerRunes}>
          ᚲᚨᛗᛋᛁᛚᛟ
        </p>
      </footer>
    </>
  );
}
