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
  transition: `opacity 800ms ease-out ${delay}ms, transform 800ms cubic-bezier(0.2,0.7,0.2,1) ${delay}ms`
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
        ...style
      }} />);


}

// Eyebrow with a darker pill so it stays legible over any video frame
function EyebrowPill({ children }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "14px",
        marginBottom: "1.25rem",
        padding: "0.55rem 1rem 0.55rem 0.85rem",
        background: "rgba(15,15,15,0.55)",
        backdropFilter: "blur(8px) saturate(140%)",
        WebkitBackdropFilter: "blur(8px) saturate(140%)",
        border: "1px solid rgba(197,168,128,0.35)",
        borderRadius: "2px",
        boxShadow: "0 6px 24px rgba(0,0,0,0.35)"
      }}>
      <GoldLine width={28} />
      <span
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
          fontSize: "0.7rem",
          letterSpacing: "0.35em",
          color: "var(--gold)",
          textTransform: "uppercase",
          textShadow: "0 1px 6px rgba(0,0,0,0.6)"
        }}>
        {children}
      </span>
    </div>);
}

// ─────────────────────────────────────────────
// Tocapu — Inca textile geometric pattern band (cultural, not religious)
// Tocapus are the small square geometric motifs woven into Inca royal
// textiles (cumbi cloth). Here we render an SVG band with subtle marquee.
// ─────────────────────────────────────────────
function TocapuBand() {
  // 8 distinct authentic-style tocapu glyphs (purely geometric — no deities)
  const glyphs = [
  // Stepped/chakana-style square (geometric staircase motif)
  <g><rect x="2" y="2" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2" /><path d="M10 26 L10 18 L18 18 L18 10 L26 10 L26 18 L18 18 L18 26 Z" fill="currentColor" opacity="0.85" /></g>,
  // Diamond grid
  <g><rect x="2" y="2" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2" /><path d="M18 6 L30 18 L18 30 L6 18 Z" fill="none" stroke="currentColor" strokeWidth="1.4" /><circle cx="18" cy="18" r="3" fill="currentColor" /></g>,
  // Zigzag bands
  <g><rect x="2" y="2" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2" /><path d="M4 12 L10 8 L16 12 L22 8 L28 12 L32 9" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M4 22 L10 18 L16 22 L22 18 L28 22 L32 19" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M4 30 L10 26 L16 30 L22 26 L28 30 L32 27" fill="none" stroke="currentColor" strokeWidth="1.4" /></g>,
  // Bars
  <g><rect x="2" y="2" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2" /><rect x="6" y="8" width="24" height="3" fill="currentColor" /><rect x="6" y="14" width="16" height="3" fill="currentColor" /><rect x="6" y="20" width="24" height="3" fill="currentColor" /><rect x="6" y="26" width="10" height="3" fill="currentColor" /></g>,
  // Concentric squares
  <g><rect x="2" y="2" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2" /><rect x="8" y="8" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.2" /><rect x="13" y="13" width="10" height="10" fill="currentColor" /></g>,
  // Stepped pyramid
  <g><rect x="2" y="2" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2" /><path d="M6 30 H30 V25 H25 V20 H21 V15 H15 V20 H11 V25 H6 Z" fill="currentColor" opacity="0.85" /></g>,
  // Crosshatch
  <g><rect x="2" y="2" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2" /><path d="M2 12 H34 M2 24 H34 M12 2 V34 M24 2 V34" stroke="currentColor" strokeWidth="1.2" /></g>,
  // Stepped cross (chakana geometric — purely structural)
  <g><rect x="2" y="2" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2" /><path d="M14 6 H22 V14 H30 V22 H22 V30 H14 V22 H6 V14 H14 Z" fill="currentColor" opacity="0.85" /></g>];


  // Render a long row that scrolls slowly
  const row = [];
  for (let i = 0; i < 28; i++) {
    row.push(glyphs[i % glyphs.length]);
  }

  return (
    <>
      <style>{`
        @keyframes tocapuScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
      <div
        aria-hidden="true"
        style={{
          marginTop: "2.5rem",
          width: "min(560px, 100%)",
          maxWidth: "100%",
          opacity: 0.55,
          overflow: "hidden",
          maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          color: "var(--gold)"
        }}>
        <div style={{
          display: "flex",
          gap: "10px",
          width: "max-content",
          animation: "tocapuScroll 70s linear infinite"
        }}>
          {[...row, ...row].map((g, i) =>
          <svg key={i} viewBox="0 0 36 36" width="32" height="32" style={{ flex: "0 0 auto" }}>
              {g}
            </svg>
          )}
        </div>
      </div>
    </>);
}

// ─────────────────────────────────────────────
// Quipu — Inca knotted-cord record system (administrative artifact, not religious)
// A few cords hanging from a horizontal master cord, with knots, gently swaying.
// ─────────────────────────────────────────────
function QuipuOrnament() {
  const cords = [
  { x: 60, knots: [120, 180, 240], delay: 0 },
  { x: 95, knots: [100, 160, 200, 260], delay: 0.4 },
  { x: 130, knots: [140, 220], delay: 0.8 },
  { x: 165, knots: [110, 170, 230, 280], delay: 1.2 },
  { x: 200, knots: [150, 210, 250], delay: 1.6 },
  { x: 235, knots: [130, 190], delay: 2.0 },
  { x: 270, knots: [120, 180, 240, 290], delay: 2.4 }];

  return (
    <>
      <style>{`
        @keyframes quipuSway {
          0%, 100% { transform: rotate(-1.2deg); }
          50% { transform: rotate(1.2deg); }
        }
        @keyframes quipuFadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 0.55; transform: translateY(0); }
        }
      `}</style>
      <div
        aria-hidden="true"
        className="hide-mobile"
        style={{
          position: "absolute",
          top: "85px",
          right: "clamp(2rem, 6vw, 5rem)",
          width: "330px",
          height: "320px",
          opacity: 0,
          animation: "quipuFadeIn 1800ms ease-out 800ms forwards",
          pointerEvents: "none",
          zIndex: 2
        }}>
        <svg viewBox="0 0 330 320" width="100%" height="100%" style={{ overflow: "visible" }}>
          {/* Master horizontal cord */}
          <path d="M 30 60 Q 165 72, 300 60" stroke="var(--gold)" strokeWidth="2.2" fill="none" opacity="0.7" strokeLinecap="round" />
          {/* Hanging cords */}
          {cords.map((c, i) =>
          <g key={i} style={{
            transformOrigin: `${c.x}px 62px`,
            animation: `quipuSway ${5 + i % 3}s ease-in-out ${c.delay}s infinite`
          }}>
              <line x1={c.x} y1="62" x2={c.x} y2={c.knots[c.knots.length - 1] + 22} stroke="var(--gold)" strokeWidth="1.1" opacity="0.55" />
              {c.knots.map((y, j) =>
            <g key={j}>
                  <ellipse cx={c.x} cy={y} rx="3.2" ry="4.4" fill="var(--gold)" opacity="0.75" />
                </g>
            )}
            </g>
          )}
        </svg>
      </div>
    </>);
}

function Eyebrow({ children, align = "left", spacing = 14 }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: `${spacing}px`,
        justifyContent: align === "center" ? "center" : "flex-start",
        marginBottom: "1.25rem"
      }}>
      
      <GoldLine width={36} />
      <span
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 400,
          fontSize: "0.7rem",
          letterSpacing: "0.35em",

          textTransform: "uppercase", color: "rgb(240, 236, 228)"
        }}>
        
        {children}
      </span>
    </div>);

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
  { code: "pt", flag: "🇧🇷", label: "PT" }];


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
        transition: "background 500ms ease, border-color 500ms ease, backdrop-filter 500ms ease", fontWeight: "100", height: "70px"
      }}>
      
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.25rem clamp(1.25rem, 4vw, 3rem)",
          maxWidth: "1600px",
          margin: "0 auto"
        }}>
        
        {/* Brand */}
        <a href="#top" style={{ textDecoration: "none", display: "flex", alignItems: "baseline", gap: "0.85rem" }}>
          <span
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
              fontSize: "1.55rem",
              letterSpacing: "0.05em",
              color: "var(--text-primary)"
            }}>
            
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
              textTransform: "uppercase"
            }}>
            
            Sanctuary Lodge
          </span>
        </a>

        {/* Desktop nav */}
        <nav
          className="hide-mobile"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2.5rem"
          }}>
          
          {[
          { href: "#suites", label: t.nav.suites },
          { href: "#experiencias", label: t.nav.experiencias },
          { href: "#reservar", label: t.nav.reservar }].
          map((l) =>
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
              paddingBottom: "4px"
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "var(--gold)"}
            onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-primary)"}>
            
              {l.label}
            </a>
          )}
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
              border: "1px solid rgba(197,168,128,0.25)"
            }}>
            
            {langs.map((l, i) =>
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
                  transition: "color 300ms ease, border-color 300ms ease"
                }}>
                
                  <span style={{ fontSize: "0.85rem" }}>{l.flag}</span>
                  {l.label}
                </button>
              </React.Fragment>
            )}
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
              display: "none"
            }}
            aria-label="Menu">
            
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
          borderTop: "1px solid rgba(197,168,128,0.2)"
        }}>
        
        <div style={{ padding: "1.5rem clamp(1.25rem, 4vw, 3rem)", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[
          { href: "#suites", label: t.nav.suites },
          { href: "#experiencias", label: t.nav.experiencias },
          { href: "#reservar", label: t.nav.reservar }].
          map((l) =>
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
              borderBottom: "1px solid rgba(197,168,128,0.15)"
            }}>
            
              {l.label}
            </a>
          )}
          <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
            {langs.map((l) =>
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
                letterSpacing: "0.18em"
              }}>
              
                {l.flag} {l.label}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>);

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
        background: "linear-gradient(135deg, #0f0f0f 0%, #1a1510 50%, #0f0f0f 100%)"
      }}>
      
      {/* Video — silenced, looped Cusco background */}
      <video
        src="assets/hero-cusco.webm"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        controls={false}
        ref={(el) => {
          if (!el) return;
          // Aggressively kill any audio — set props, attr, and disable audio tracks.
          el.muted = true;
          el.volume = 0;
          el.setAttribute("muted", "");
          const killAudio = () => {
            el.muted = true;
            el.volume = 0;
            if (el.audioTracks) {
              for (let i = 0; i < el.audioTracks.length; i++) {
                try {el.audioTracks[i].enabled = false;} catch (e) {}
              }
            }
          };
          killAudio();
          el.addEventListener("loadedmetadata", killAudio);
          el.addEventListener("loadeddata", killAudio);
          el.addEventListener("canplay", killAudio);
          el.addEventListener("play", killAudio);
          el.addEventListener("playing", killAudio);
          el.addEventListener("volumechange", killAudio);
        }}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover"
        }} />
      

      {/* Gradient overlays for legibility */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
          "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.25) 65%, rgba(0,0,0,0.75) 100%)",
          zIndex: 1,
          pointerEvents: "none"
        }} />
      
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
          "radial-gradient(ellipse at 50% 110%, rgba(0,0,0,0.55) 0%, transparent 50%)",
          zIndex: 1,
          pointerEvents: "none"
        }} />
      

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
          margin: "0 auto"
        }}>
        
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
            letterSpacing: "-0.01em"
          }}>
          
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
            lineHeight: 1.5
          }}>
          
            {t.subtitle}
          </p>

          {/* Reservation strip */}
          <BookingStrip lang={lang} />
        </div>

        {/* Scroll hint — hidden on mobile to avoid overlapping the stacked booking strip */}
        <div
        className="hide-mobile"
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
          textTransform: "uppercase"
        }}>
        
          <span>{t.scroll}</span>
          <div
          style={{
            width: "1px",
            height: "44px",
            background: "linear-gradient(to bottom, var(--gold), transparent)",
            animation: "scrollDot 2.4s ease-in-out infinite"
          }} />
        
        </div>
    </section>);

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
    WebkitAppearance: "none"
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
        flexWrap: "wrap"
      }}>
      
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
      <a
        className="reserve-btn"
        href="https://www.booking.com/"
        target="_blank"
        rel="noopener noreferrer"
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
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center"
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "var(--gold-hover)"}
        onMouseLeave={(e) => e.currentTarget.style.background = "var(--gold)"}>
        
        {t.cta} →
      </a>
    </div>);

}

window.Navbar = Navbar;
window.Hero = Hero;
window.useScrollReveal = useScrollReveal;
window.revealStyle = revealStyle;
window.GoldLine = GoldLine;
window.Eyebrow = Eyebrow;