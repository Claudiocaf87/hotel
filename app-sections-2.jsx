/* global React */
const { useState: useStateA, useEffect: useEffectA, useRef: useRefA } = React;
const Ta               = window.TRANSLATIONS;
const useScrollRevealA = window.useScrollReveal;
const revealStyleA     = window.revealStyle;
const EyebrowA         = window.Eyebrow;
const GoldLineA        = window.GoldLine;

// ─────────────────────────────────────────────
// AMENITIES
// ─────────────────────────────────────────────
function Amenities({ lang }) {
  const t = Ta[lang].amenities;
  const [headerRef, headerRevealed] = useScrollRevealA();

  const images = [
    "assets/amenity-masaje-corporal.webp",
    "assets/amenity-masaje-facial.webp",
    "assets/amenity-almuerzo.webp",
    "assets/amenity-cena.webp",
    "assets/amenity-spa-romantico.webp",
    "assets/amenity-transfer.webp",
  ];

  return (
    <section id="experiencias" style={{
      background: "var(--surface)",
      padding: "clamp(5rem, 12vw, 10rem) clamp(1.25rem, 6vw, 5rem)",
      borderTop: "1px solid var(--border)",
    }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div ref={headerRef} style={{ ...revealStyleA(headerRevealed), textAlign: "center", marginBottom: "clamp(3rem, 6vw, 5rem)" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <EyebrowA align="center">{t.eyebrow}</EyebrowA>
          </div>
          <h2 style={{ fontFamily: '"Playfair Display",serif', fontWeight: 400, fontSize: "clamp(2.25rem, 4.5vw, 4rem)", lineHeight: 1.1, color: "var(--text-primary)", margin: "0 auto 1.25rem", maxWidth: "900px", letterSpacing: "-0.01em" }}>
            {t.sectionTitle}
          </h2>
          <p style={{ fontFamily: "Inter,sans-serif", fontWeight: 300, fontSize: "clamp(0.95rem, 1.1vw, 1.05rem)", lineHeight: 1.6, color: "var(--text-muted)", maxWidth: "560px", margin: "0 auto" }}>
            {t.sectionLead}
          </p>
        </div>
        <div className="amenities-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "clamp(1.25rem, 2vw, 2rem)" }}>
          {t.items.map((item, i) => (
            <AmenityCard key={i} item={item} img={images[i]} delay={(i % 3) * 120} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AmenityCard({ item, img, delay }) {
  const [ref, revealed] = useScrollRevealA({ threshold: 0.12 });
  const [hover, setHover] = useStateA(false);
  return (
    <article
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...revealStyleA(revealed, delay),
        background: "var(--bg)", border: "1px solid var(--border)",
        overflow: "hidden", cursor: "pointer",
        transition: `opacity 800ms ease ${delay}ms, transform 800ms cubic-bezier(0.2,0.7,0.2,1) ${delay}ms, border-color 500ms ease`,
        borderColor: hover ? "rgba(197,168,128,0.5)" : "var(--border)",
      }}
    >
      <div style={{ position: "relative", aspectRatio: "4/5", overflow: "hidden" }}>
        <img src={img} alt={item.title} style={{
          width: "100%", height: "100%", objectFit: "cover",
          filter: "saturate(0.8) brightness(0.85)",
          transition: "transform 1200ms cubic-bezier(0.2,0.7,0.2,1)",
          transform: hover ? "scale(1.06)" : "scale(1.0)",
        }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%)" }} />
        <div style={{ position: "absolute", top: "1.25rem", left: "1.25rem", fontFamily: "Inter,sans-serif", fontSize: "0.62rem", letterSpacing: "0.3em", color: "var(--gold)", textTransform: "uppercase", background: "rgba(15,15,15,0.55)", padding: "0.4rem 0.7rem", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: "1px solid rgba(197,168,128,0.3)" }}>
          {item.tag}
        </div>
      </div>
      <div style={{ padding: "1.85rem 1.85rem 2.1rem" }}>
        <h3 style={{ fontFamily: '"Playfair Display",serif', fontWeight: 400, fontSize: "clamp(1.35rem, 1.7vw, 1.65rem)", lineHeight: 1.2, color: "var(--text-primary)", margin: "0 0 0.85rem 0" }}>
          {item.title}
        </h3>
        <p style={{ fontFamily: "Inter,sans-serif", fontWeight: 300, fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-muted)", margin: 0 }}>
          {item.body}
        </p>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────
// TESTIMONIALS — horizontal scroll (FIXED)
// ─────────────────────────────────────────────
/*
  FIX: mismo problema de cálculo de travel que en Suites.
  Las cards tienen flex: 0 0 min(720px, 70vw) y hay un gap de 2rem.
  Calculamos el travel sumando los anchos reales de las cards + gaps,
  restamos un viewport, y usamos ese valor para el targetX.
*/
function Testimonials({ lang }) {
  const t = Ta[lang].testimonios;
  const sectionRef = useRefA(null);
  const trackRef   = useRefA(null);
  const [isMobile, setIsMobile] = useStateA(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffectA(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const items = [t.t1, t.t2, t.t3];
  const COUNT = items.length;

  useEffectA(() => {
    if (isMobile) return;

    let rafId;
    let currentX = 0;
    let targetX  = 0;

    const compute = () => {
      const section = sectionRef.current;
      const track   = trackRef.current;
      if (!section || !track) return;

      const winH      = window.innerHeight;
      const winW      = window.innerWidth;
      const sectionH  = section.offsetHeight;
      const rect      = section.getBoundingClientRect();
      const scrolled  = -rect.top;
      const maxScroll = sectionH - winH;
      const progress  = Math.max(0, Math.min(1, scrolled / maxScroll));

      // FIX: medir el track real después de que el DOM lo renderizó
      // getBoundingClientRect().width del track da el ancho actual real
      const trackW    = track.getBoundingClientRect().width;
      const travel    = Math.max(0, trackW - winW);
      targetX = -(progress * travel);
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.09;
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${currentX}px, 0, 0)`;
      }
      rafId = requestAnimationFrame(animate);
    };

    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
      cancelAnimationFrame(rafId);
    };
  }, [isMobile]);

  // ── MOBILE ──
  if (isMobile) {
    return (
      <section style={{ background: "var(--bg)", padding: "4rem 0", borderTop: "1px solid var(--border)" }}>
        <div style={{ padding: "0 1.25rem", marginBottom: "2rem" }}>
          <EyebrowA>{t.eyebrow}</EyebrowA>
          <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: "2rem", color: "var(--text-primary)", margin: 0, fontWeight: 400 }}>{t.sectionTitle}</h2>
        </div>
        <div style={{ display: "flex", overflowX: "auto", scrollSnapType: "x mandatory", scrollbarWidth: "none", gap: "1rem", padding: "0 1.25rem" }}>
          {items.map((it, i) => <TestimonialCard key={i} it={it} mobile />)}
        </div>
      </section>
    );
  }

  // ── DESKTOP ──
  return (
    <section
      ref={sectionRef}
      style={{
        height: "280vh",
        position: "relative",
        background: "var(--bg)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div style={{
        position: "sticky", top: 0, height: "100vh",
        overflow: "hidden",
        display: "flex", flexDirection: "column", justifyContent: "center",
      }}>
        <div style={{ padding: "0 clamp(1.25rem, 6vw, 5rem)", marginBottom: "2.5rem", maxWidth: "1400px", margin: "0 auto 2.5rem", width: "100%" }}>
          <EyebrowA>{t.eyebrow}</EyebrowA>
          <h2 style={{ fontFamily: '"Playfair Display",serif', fontWeight: 400, fontSize: "clamp(2rem, 3.5vw, 3.2rem)", color: "var(--text-primary)", margin: 0, lineHeight: 1.1 }}>
            {t.sectionTitle}
          </h2>
        </div>

        <div
          ref={trackRef}
          style={{
            display: "flex",
            gap: "2rem",
            paddingLeft: "clamp(1.25rem, 6vw, 5rem)",
            paddingRight: "clamp(1.25rem, 6vw, 5rem)",
            willChange: "transform",
            alignItems: "stretch",
          }}
        >
          {items.map((it, i) => <TestimonialCard key={i} it={it} />)}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ it, mobile }) {
  return (
    <div style={{
      flex: mobile ? "0 0 85vw" : "0 0 min(720px, 70vw)",
      scrollSnapAlign: mobile ? "start" : "none",
      background: "var(--surface)",
      border: "1px solid rgba(197,168,128,0.3)",
      padding: "clamp(2rem, 4vw, 3.5rem) clamp(1.75rem, 3.5vw, 3.5rem)",
      position: "relative",
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      minHeight: mobile ? "360px" : "480px",
    }}>
      <span aria-hidden style={{
        position: "absolute", top: "0.5rem", left: "1.25rem",
        fontFamily: '"Playfair Display",serif', fontWeight: 400,
        fontSize: "9rem", color: "var(--gold)", opacity: 0.18,
        lineHeight: 1, fontStyle: "italic", userSelect: "none", pointerEvents: "none",
      }}>
        "
      </span>

      <p style={{
        fontFamily: '"Playfair Display",serif', fontStyle: "italic", fontWeight: 400,
        fontSize: "clamp(1.1rem, 1.6vw, 1.55rem)", lineHeight: 1.55,
        color: "var(--text-primary)", margin: 0, position: "relative", zIndex: 1,
      }}>
        {it.quote}
      </p>

      <div style={{ marginTop: "2.5rem", borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}>
        <div style={{ fontFamily: "Inter,sans-serif", fontWeight: 500, fontSize: "0.95rem", color: "var(--text-primary)", letterSpacing: "0.05em" }}>
          {it.author}
        </div>
        <div style={{ fontFamily: "Inter,sans-serif", fontWeight: 300, fontSize: "0.72rem", color: "var(--text-muted)", letterSpacing: "0.25em", textTransform: "uppercase", marginTop: "0.4rem" }}>
          {it.origin}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CTA FINAL
// ─────────────────────────────────────────────
function FinalCTA({ lang }) {
  const t = Ta[lang].cta;
  const [ref, revealed] = useScrollRevealA({ threshold: 0.2 });
  const [hover, setHover] = useStateA(false);
  return (
    <section id="reservar" style={{
      background: "var(--bg)",
      padding: "clamp(6rem, 14vw, 12rem) clamp(1.25rem, 6vw, 5rem)",
      textAlign: "center", borderTop: "1px solid var(--border)",
      position: "relative", overflow: "hidden",
    }}>
      <span style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%) rotate(45deg)",
        width: "min(720px, 90vw)", height: "min(720px, 90vw)",
        border: "1px solid rgba(197,168,128,0.08)", pointerEvents: "none",
      }} />
      <div ref={ref} style={{ ...revealStyleA(revealed), maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <EyebrowA align="center">{t.eyebrow}</EyebrowA>
        </div>
        <h2 style={{ fontFamily: '"Playfair Display",serif', fontWeight: 400, fontSize: "clamp(2.25rem, 4.5vw, 4rem)", lineHeight: 1.15, color: "var(--text-primary)", whiteSpace: "pre-line", margin: "0 0 3rem 0", letterSpacing: "-0.01em" }}>
          {t.title.split("\n").map((line, i, arr) => (
            <span key={i}>
              {i === arr.length - 1 ? <em style={{ fontStyle: "italic", color: "var(--gold)", fontWeight: 400 }}>{line}</em> : line}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
        </h2>
        <button
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            background: hover ? "var(--gold)" : "transparent",
            border: "1px solid var(--gold)",
            color: hover ? "var(--bg)" : "var(--gold)",
            padding: "1.25rem 3.75rem", fontFamily: "Inter,sans-serif",
            fontWeight: 500, fontSize: "0.78rem", letterSpacing: "0.32em",
            textTransform: "uppercase", cursor: "pointer",
            transition: "background 450ms ease, color 450ms ease",
          }}
        >
          {t.button}
        </button>
        <p style={{ fontFamily: "Inter,sans-serif", fontWeight: 300, fontSize: "0.82rem", color: "var(--text-muted)", letterSpacing: "0.05em", marginTop: "2rem" }}>
          {t.subtext}
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────
function Footer({ lang }) {
  const t = Ta[lang].footer;
  return (
    <footer style={{ background: "var(--bg)", borderTop: "1px solid var(--gold)", padding: "clamp(3rem, 5vw, 4rem) clamp(1.25rem, 6vw, 5rem) 2rem" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: "3rem", marginBottom: "3rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.85rem", marginBottom: "0.85rem" }}>
              <span style={{ fontFamily: '"Playfair Display",serif', fontWeight: 700, fontSize: "1.55rem", color: "var(--text-primary)", letterSpacing: "0.05em" }}>ACLLA</span>
              <span style={{ fontFamily: "Inter,sans-serif", fontSize: "0.6rem", letterSpacing: "0.4em", color: "var(--text-muted)", textTransform: "uppercase" }}>Sanctuary Lodge</span>
            </div>
            <p style={{ fontFamily: "Inter,sans-serif", fontWeight: 300, fontSize: "0.85rem", color: "var(--text-muted)", margin: 0, letterSpacing: "0.05em" }}>
              {t.tagline}
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {[t.privacy, t.terms, t.contact].map((label) => (
              <a key={label} href="#" style={{ fontFamily: "Inter,sans-serif", fontWeight: 300, fontSize: "0.82rem", color: "var(--text-muted)", textDecoration: "none", transition: "color 300ms ease", letterSpacing: "0.04em", width: "fit-content" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                {label}
              </a>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: "0.7rem", letterSpacing: "0.28em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "1rem" }}>
              {t.social}
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <a href="#" aria-label="Instagram" style={{ color: "var(--text-muted)", transition: "color 300ms" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              <a href="#" aria-label="WhatsApp" style={{ color: "var(--text-muted)", transition: "color 300ms" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21l1.65-4.95A8 8 0 113 21z"/><path d="M9 9c0 4 3 7 7 7"/><path d="M9 9c0.5-0.6 1.2-1 1.8-0.5l1 1.3c0.3 0.4 0.3 0.9 0 1.3l-0.4 0.4"/><path d="M14 14l0.4-0.4c0.4-0.3 0.9-0.3 1.3 0l1.3 1c0.5 0.6 0.1 1.3-0.5 1.8"/>
                </svg>
              </a>
              <a href="#" aria-label="Email" style={{ color: "var(--text-muted)", transition: "color 300ms" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 7l9 6 9-6"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.85rem" }}>
          <span style={{ fontFamily: "Inter,sans-serif", fontWeight: 300, fontSize: "0.72rem", color: "var(--text-muted)", letterSpacing: "0.05em" }}>{t.copyright}</span>
          <span style={{ fontFamily: "Inter,sans-serif", fontWeight: 300, fontSize: "0.65rem", color: "var(--text-muted)", letterSpacing: "0.3em", textTransform: "uppercase" }}>{t.muestra}</span>
        </div>
      </div>
    </footer>
  );
}

window.Amenities    = Amenities;
window.Testimonials = Testimonials;
window.FinalCTA     = FinalCTA;
window.Footer       = Footer;
