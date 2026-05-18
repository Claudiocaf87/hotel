/* global React, ReactDOM */
const { useState, useEffect, useRef, useCallback, useMemo } = React;
const T = window.TRANSLATIONS;

// ─────────────────────────────────────────────
// Hook: reveal on scroll
// ─────────────────────────────────────────────
function useScrollReveal(options = {}) {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            obs.disconnect();
          }
        });
      },
      { threshold: options.threshold ?? 0.15, rootMargin: options.rootMargin ?? "0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, revealed];
}

const revealStyle = (revealed, delay = 0) => ({
  opacity: revealed ? 1 : 0,
  transform: revealed ? "translateY(0)" : "translateY(30px)",
  transition: `opacity 800ms ease-out ${delay}ms, transform 800ms cubic-bezier(0.2,0.7,0.2,1) ${delay}ms`,
});

// ─────────────────────────────────────────────
// Decorative gold line
// ─────────────────────────────────────────────
function GoldLine({ width = 60, style }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: `${width}px`,
        height: "1px",
        background: "var(--gold)",
        verticalAlign: "middle",
        ...style,
      }}
    />
  );
}

function Eyebrow({ children, align = "left", spacing = 14 }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: `${spacing}px`,
        justifyContent: align === "center" ? "center" : "flex-start",
        marginBottom: "1.25rem",
      }}
    >
      <GoldLine width={36} />
      <span
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 400,
          fontSize: "0.7rem",
          letterSpacing: "0.35em",
          color: "var(--gold)",
          textTransform: "uppercase",
        }}
      >
        {children}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────
function Navbar({ lang, setLang }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const t = T[lang];
  const langs = [
    { code: "es", flag: "🇪🇸", label: "ES" },
    { code: "en", flag: "🇺🇸", label: "EN" },
    { code: "pt", flag: "🇧🇷", label: "PT" },
  ];

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled ? "rgba(15,15,15,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
        borderBottom: scrolled ? "1px solid rgba(197,168,128,0.25)" : "1px solid transparent",
        transition: "background 500ms ease, border-color 500ms ease, backdrop-filter 500ms ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.25rem clamp(1.25rem, 4vw, 3rem)",
          maxWidth: "1600px",
          margin: "0 auto",
        }}
      >
        {/* Brand */}
        <a href="#top" style={{ textDecoration: "none", display: "flex", alignItems: "baseline", gap: "0.85rem" }}>
          <span
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
              fontSize: "1.55rem",
              letterSpacing: "0.05em",
              color: "var(--text-primary)",
            }}
          >
            ACLLA
          </span>
          <span
            className="hide-mobile"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontSize: "0.6rem",
              letterSpacing: "0.4em",
              color: "var(--text-muted)",
              textTransform: "uppercase",
            }}
          >
            Sanctuary Lodge
          </span>
        </a>

        {/* Desktop nav */}
        <nav
          className="hide-mobile"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2.5rem",
          }}
        >
          {[
            { href: "#suites", label: t.nav.suites },
            { href: "#experiencias", label: t.nav.experiencias },
            { href: "#reservar", label: t.nav.reservar },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontSize: "0.72rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "var(--text-primary)",
                textDecoration: "none",
                position: "relative",
                paddingBottom: "4px",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Right side: language */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            className="hide-mobile"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.85rem",
              padding: "0.4rem 0.85rem",
              border: "1px solid rgba(197,168,128,0.25)",
            }}
          >
            {langs.map((l, i) => (
              <React.Fragment key={l.code}>
                {i > 0 && <span style={{ color: "rgba(197,168,128,0.35)", fontSize: "0.7rem" }}>·</span>}
                <button
                  onClick={() => setLang(l.code)}
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: "2px 0",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.7rem",
                    letterSpacing: "0.18em",
                    color: lang === l.code ? "var(--gold)" : "var(--text-muted)",
                    borderBottom: lang === l.code ? "1px solid var(--gold)" : "1px solid transparent",
                    transition: "color 300ms ease, border-color 300ms ease",
                  }}
                >
                  <span style={{ fontSize: "0.85rem" }}>{l.flag}</span>
                  {l.label}
                </button>
              </React.Fragment>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="show-mobile"
            onClick={() => setMenuOpen((v) => !v)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "0.5rem",
              display: "none",
            }}
            aria-label="Menu"
          >
            <div style={{ width: "24px", display: "flex", flexDirection: "column", gap: "5px" }}>
              <span style={{ height: "1px", background: "var(--gold)", transition: "transform 300ms", transform: menuOpen ? "translateY(6px) rotate(45deg)" : "none" }} />
              <span style={{ height: "1px", background: "var(--gold)", opacity: menuOpen ? 0 : 1, transition: "opacity 200ms" }} />
              <span style={{ height: "1px", background: "var(--gold)", transition: "transform 300ms", transform: menuOpen ? "translateY(-6px) rotate(-45deg)" : "none" }} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        style={{
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition: "opacity 350ms ease",
          background: "rgba(15,15,15,0.98)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(197,168,128,0.2)",
        }}
      >
        <div style={{ padding: "1.5rem clamp(1.25rem, 4vw, 3rem)", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[
            { href: "#suites", label: t.nav.suites },
            { href: "#experiencias", label: t.nav.experiencias },
            { href: "#reservar", label: t.nav.reservar },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.85rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "var(--text-primary)",
                textDecoration: "none",
                padding: "0.5rem 0",
                borderBottom: "1px solid rgba(197,168,128,0.15)",
              }}
            >
              {l.label}
            </a>
          ))}
          <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
            {langs.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                style={{
                  background: "transparent",
                  border: "1px solid " + (lang === l.code ? "var(--gold)" : "rgba(197,168,128,0.25)"),
                  color: lang === l.code ? "var(--gold)" : "var(--text-muted)",
                  padding: "0.5rem 0.85rem",
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.18em",
                }}
              >
                {l.flag} {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────
// HERO — simple looping background video
// ─────────────────────────────────────────────
function Hero({ lang }) {
  const t = T[lang].hero;

  return (
    <section
      id="top"
      style={{
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #0f0f0f 0%, #1a1510 50%, #0f0f0f 100%)",
      }}
    >
      {/* Video */}
      <video
        src="assets/video largo loopeado.webm"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Gradient overlays for legibility */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.25) 65%, rgba(0,0,0,0.75) 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 110%, rgba(0,0,0,0.55) 0%, transparent 50%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Text content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "0 clamp(1.25rem, 6vw, 5rem)",
          paddingTop: "6rem",
          maxWidth: "1600px",
          margin: "0 auto",
        }}
      >
          <Eyebrow>{t.supertitle}</Eyebrow>

          <h1
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 400,
              fontSize: "clamp(2.75rem, 7vw, 6.5rem)",
              lineHeight: 1.05,
              color: "var(--text-primary)",
              margin: 0,
              maxWidth: "900px",
              letterSpacing: "-0.01em",
            }}
          >
            {t.titleLine1}
            <br />
            <em style={{ fontStyle: "italic", fontWeight: 400, color: "var(--gold)" }}>{t.titleLine2}</em>
          </h1>

          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 300,
              fontSize: "clamp(0.95rem, 1.2vw, 1.1rem)",
              letterSpacing: "0.04em",
              color: "var(--text-primary)",
              opacity: 0.85,
              marginTop: "1.75rem",
              maxWidth: "520px",
              lineHeight: 1.5,
            }}
          >
            {t.subtitle}
          </p>

          {/* Reservation strip */}
          <BookingStrip lang={lang} />
        </div>

        {/* Scroll hint */}
        <div
          style={{
            position: "absolute",
            bottom: "2.5rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
            fontFamily: "Inter, sans-serif",
            fontSize: "0.65rem",
            letterSpacing: "0.4em",
            color: "var(--text-muted)",
            textTransform: "uppercase",
          }}
        >
          <span>{t.scroll}</span>
          <div
            style={{
              width: "1px",
              height: "44px",
              background: "linear-gradient(to bottom, var(--gold), transparent)",
              animation: "scrollDot 2.4s ease-in-out infinite",
            }}
          />
        </div>
    </section>
  );
}

function BookingStrip({ lang }) {
  const t = T[lang].hero;
  const today = new Date();
  const fmt = (d) => d.toISOString().slice(0, 10);
  const tomorrow = new Date(today.getTime() + 86400000);
  const inThree = new Date(today.getTime() + 86400000 * 3);

  const fieldStyle = {
    background: "transparent",
    border: "none",
    color: "var(--text-primary)",
    padding: "1.1rem 1.5rem",
    fontFamily: "Inter, sans-serif",
    fontSize: "0.72rem",
    fontWeight: 400,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    outline: "none",
    flex: 1,
    minWidth: 0,
    appearance: "none",
    WebkitAppearance: "none",
  };

  return (
    <div
      className="booking-strip"
      style={{
        display: "flex",
        marginTop: "2.75rem",
        border: "1px solid var(--gold)",
        background: "rgba(15,15,15,0.45)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        width: "min(720px, 100%)",
        flexWrap: "wrap",
      }}
    >
      <label style={{ ...fieldStyle, display: "flex", flexDirection: "column", gap: "4px", borderRight: "1px solid rgba(197,168,128,0.35)" }}>
        <span style={{ fontSize: "0.6rem", color: "var(--gold)", letterSpacing: "0.28em" }}>{t.checkin}</span>
        <input type="date" defaultValue={fmt(tomorrow)} style={{ background: "transparent", border: "none", color: "var(--text-primary)", fontFamily: "Inter, sans-serif", fontSize: "0.78rem", outline: "none", padding: 0, colorScheme: "dark" }} />
      </label>
      <label style={{ ...fieldStyle, display: "flex", flexDirection: "column", gap: "4px", borderRight: "1px solid rgba(197,168,128,0.35)" }}>
        <span style={{ fontSize: "0.6rem", color: "var(--gold)", letterSpacing: "0.28em" }}>{t.checkout}</span>
        <input type="date" defaultValue={fmt(inThree)} style={{ background: "transparent", border: "none", color: "var(--text-primary)", fontFamily: "Inter, sans-serif", fontSize: "0.78rem", outline: "none", padding: 0, colorScheme: "dark" }} />
      </label>
      <label style={{ ...fieldStyle, display: "flex", flexDirection: "column", gap: "4px", borderRight: "1px solid rgba(197,168,128,0.35)" }}>
        <span style={{ fontSize: "0.6rem", color: "var(--gold)", letterSpacing: "0.28em" }}>{t.guests}</span>
        <select defaultValue="2" style={{ background: "transparent", border: "none", color: "var(--text-primary)", fontFamily: "Inter, sans-serif", fontSize: "0.78rem", outline: "none", padding: 0, appearance: "none", WebkitAppearance: "none" }}>
          <option style={{ background: "#1a1a1a" }}>1</option>
          <option style={{ background: "#1a1a1a" }}>2</option>
          <option style={{ background: "#1a1a1a" }}>3</option>
          <option style={{ background: "#1a1a1a" }}>4+</option>
        </select>
      </label>
      <button
        className="reserve-btn"
        style={{
          background: "var(--gold)",
          border: "none",
          color: "var(--bg)",
          padding: "1rem 2.25rem",
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
          fontSize: "0.72rem",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          cursor: "pointer",
          transition: "background 350ms ease, color 350ms ease",
          flex: "0 0 auto",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--gold-hover)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "var(--gold)")}
      >
        {t.cta} →
      </button>
    </div>
  );
}

window.Navbar = Navbar;
window.Hero = Hero;
window.useScrollReveal = useScrollReveal;
window.revealStyle = revealStyle;
window.GoldLine = GoldLine;
window.Eyebrow = Eyebrow;
