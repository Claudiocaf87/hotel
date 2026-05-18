/* global React */
const { useState: useStateA, useEffect: useEffectA, useRef: useRefA } = React;
const Ta = window.TRANSLATIONS;
const useScrollRevealA = window.useScrollReveal;
const revealStyleA = window.revealStyle;
const EyebrowA = window.Eyebrow;
const GoldLineA = window.GoldLine;

// ─────────────────────────────────────────────
// AMENITIES — image grid with reveal
// ─────────────────────────────────────────────
function Amenities({ lang }) {
  const t = Ta[lang].amenities;
  const [headerRef, headerRevealed] = useScrollRevealA();

  const images = [
    "assets/amenity-masaje-corporal.webp",
    "assets/amenity-masaje-cuello.webp",
    "assets/amenity-buffet.webp",
    "assets/amenity-jacuzzi.webp",
    "assets/amenity-spa-romantico.webp",
    "assets/amenity-transfer.webp",
  ];

  return (
    <section
      id="experiencias"
      style={{
        background: "var(--surface)",
        padding: "clamp(5rem, 12vw, 10rem) clamp(1.25rem, 6vw, 5rem)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div ref={headerRef} style={{ ...revealStyleA(headerRevealed), textAlign: "center", marginBottom: "clamp(3rem, 6vw, 5rem)" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <EyebrowA align="center">{t.eyebrow}</EyebrowA>
          </div>
          <h2
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 400,
              fontSize: "clamp(2.25rem, 4.5vw, 4rem)",
              lineHeight: 1.1,
              color: "var(--text-primary)",
              margin: "0 auto 1.25rem",
              maxWidth: "900px",
              letterSpacing: "-0.01em",
            }}
          >
            {t.sectionTitle}
          </h2>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 300,
              fontSize: "clamp(0.95rem, 1.1vw, 1.05rem)",
              lineHeight: 1.6,
              color: "var(--text-muted)",
              maxWidth: "560px",
              margin: "0 auto",
            }}
          >
            {t.sectionLead}
          </p>
        </div>

        {/* Grid */}
        <div
          className="amenities-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "clamp(1.25rem, 2vw, 2rem)",
          }}
        >
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
        background: "var(--bg)",
        border: "1px solid var(--border)",
        overflow: "hidden",
        cursor: "pointer",
        transition: `opacity 800ms ease ${delay}ms, transform 800ms cubic-bezier(0.2,0.7,0.2,1) ${delay}ms, border-color 500ms ease`,
        borderColor: hover ? "rgba(197,168,128,0.5)" : "var(--border)",
      }}
    >
      <div style={{ position: "relative", aspectRatio: "4/5", overflow: "hidden" }}>
        <img
          src={img}
          alt={item.title}
          loading="lazy"
          decoding="async"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "saturate(0.85) brightness(0.9)",
            transition: "transform 1200ms cubic-bezier(0.2,0.7,0.2,1)",
            transform: hover ? "scale(1.06)" : "scale(1.0)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "1.25rem",
            left: "1.25rem",
            fontFamily: "Inter, sans-serif",
            fontSize: "0.62rem",
            letterSpacing: "0.3em",
            color: "var(--gold)",
            textTransform: "uppercase",
            background: "rgba(15,15,15,0.55)",
            padding: "0.4rem 0.7rem",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid rgba(197,168,128,0.3)",
          }}
        >
          {item.tag}
        </div>
      </div>
      <div style={{ padding: "1.85rem 1.85rem 2.1rem" }}>
        <h3
          style={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 400,
            fontSize: "clamp(1.35rem, 1.7vw, 1.65rem)",
            lineHeight: 1.2,
            color: "var(--text-primary)",
            margin: "0 0 0.85rem 0",
          }}
        >
          {item.title}
        </h3>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 300,
            fontSize: "0.92rem",
            lineHeight: 1.65,
            color: "var(--text-muted)",
            margin: 0,
          }}
        >
          {item.body}
        </p>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────
// TESTIMONIALS — simple grid, staggered reveal
// ─────────────────────────────────────────────
function Testimonials({ lang }) {
  const t = Ta[lang].testimonios;
  const [headerRef, headerRevealed] = useScrollRevealA();
  const items = [t.t1, t.t2, t.t3];

  return (
    <section
      style={{
        background: "var(--bg)",
        padding: "clamp(5rem, 11vw, 9rem) clamp(1.25rem, 6vw, 5rem)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div ref={headerRef} style={{ ...revealStyleA(headerRevealed), marginBottom: "clamp(3rem, 5vw, 4.5rem)", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <EyebrowA align="center">{t.eyebrow}</EyebrowA>
          </div>
          <h2 style={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 400,
            fontSize: "clamp(2.25rem, 4.5vw, 4rem)",
            color: "var(--text-primary)",
            margin: 0,
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
          }}>
            {t.sectionTitle}
          </h2>
        </div>

        <div
          className="testimonials-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "clamp(1.25rem, 2vw, 2rem)",
            alignItems: "stretch",
          }}
        >
          {items.map((it, i) => (
            <TestimonialCard key={i} it={it} delay={i * 150} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ it, delay }) {
  const [ref, revealed] = useScrollRevealA({ threshold: 0.15 });
  return (
    <article
      ref={ref}
      style={{
        ...revealStyleA(revealed, delay),
        background: "var(--surface)",
        border: "1px solid rgba(197,168,128,0.3)",
        padding: "clamp(1.75rem, 2.5vw, 2.5rem)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        minHeight: "360px",
        transition: `opacity 800ms ease ${delay}ms, transform 800ms cubic-bezier(0.2,0.7,0.2,1) ${delay}ms, border-color 500ms ease`,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          display: "block",
          fontFamily: '"Playfair Display", serif',
          fontWeight: 400,
          fontStyle: "italic",
          fontSize: "3.5rem",
          color: "var(--gold)",
          opacity: 0.5,
          lineHeight: 0.9,
          marginBottom: "1rem",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        “
      </span>

      <p
        style={{
          fontFamily: '"Playfair Display", serif',
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "clamp(1.05rem, 1.3vw, 1.25rem)",
          lineHeight: 1.55,
          color: "var(--text-primary)",
          margin: 0,
          flexGrow: 1,
        }}
      >
        {it.quote}
      </p>

      <div style={{ marginTop: "auto", paddingTop: "1.75rem", borderTop: "1px solid var(--border)" }}>
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: "0.95rem",
            color: "var(--text-primary)",
            letterSpacing: "0.05em",
          }}
        >
          {it.author}
        </div>
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 300,
            fontSize: "0.72rem",
            color: "var(--text-muted)",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            marginTop: "0.4rem",
          }}
        >
          {it.origin}
        </div>
      </div>
    </article>
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
    <section
      id="reservar"
      style={{
        background: "var(--bg)",
        padding: "clamp(6rem, 14vw, 12rem) clamp(1.25rem, 6vw, 5rem)",
        textAlign: "center",
        borderTop: "1px solid var(--border)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative diamond accent */}
      <span
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) rotate(45deg)",
          width: "min(720px, 90vw)",
          height: "min(720px, 90vw)",
          border: "1px solid rgba(197,168,128,0.08)",
          pointerEvents: "none",
        }}
      />

      <div ref={ref} style={{ ...revealStyleA(revealed), maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <EyebrowA align="center">{t.eyebrow}</EyebrowA>
        </div>
        <h2
          style={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 400,
            fontSize: "clamp(2.25rem, 4.5vw, 4rem)",
            lineHeight: 1.15,
            color: "var(--text-primary)",
            whiteSpace: "pre-line",
            margin: "0 0 3rem 0",
            letterSpacing: "-0.01em",
          }}
        >
          {t.title.split("\n").map((line, i, arr) => (
            <span key={i}>
              {i === arr.length - 1 ? <em style={{ fontStyle: "italic", color: "var(--gold)", fontWeight: 400 }}>{line}</em> : line}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
        </h2>

        <a
          href="https://www.booking.com/"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            background: hover ? "var(--gold)" : "transparent",
            border: "1px solid var(--gold)",
            color: hover ? "var(--bg)" : "var(--gold)",
            padding: "1.25rem 3.75rem",
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: "0.78rem",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "background 450ms ease, color 450ms ease",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          {t.button}
        </a>

        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 300,
            fontSize: "0.82rem",
            color: "var(--text-muted)",
            letterSpacing: "0.05em",
            marginTop: "2rem",
          }}
        >
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
    <footer
      style={{
        background: "var(--bg)",
        borderTop: "1px solid var(--gold)",
        padding: "clamp(3rem, 5vw, 4rem) clamp(1.25rem, 6vw, 5rem) 2rem",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div
          className="footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr 1fr",
            gap: "3rem",
            marginBottom: "3rem",
          }}
        >
          {/* Left */}
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.85rem", marginBottom: "0.85rem" }}>
              <span style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: "1.55rem", color: "var(--text-primary)", letterSpacing: "0.05em" }}>
                ACLLA
              </span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", letterSpacing: "0.4em", color: "var(--text-muted)", textTransform: "uppercase" }}>
                Sanctuary Lodge
              </span>
            </div>
            <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 300, fontSize: "0.85rem", color: "var(--text-muted)", margin: 0, letterSpacing: "0.05em" }}>
              {t.tagline}
            </p>
          </div>

          {/* Center */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {[t.privacy, t.terms, t.contact].map((label) => (
              <a
                key={label}
                href="#"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 300,
                  fontSize: "0.82rem",
                  color: "var(--text-muted)",
                  textDecoration: "none",
                  transition: "color 300ms ease",
                  letterSpacing: "0.04em",
                  width: "fit-content",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Right */}
          <div>
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.7rem",
                letterSpacing: "0.28em",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                marginBottom: "1rem",
              }}
            >
              {t.social}
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              {/* Instagram */}
              <a href="#" aria-label="Instagram" style={{ color: "var(--text-muted)", transition: "color 300ms" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
                </svg>
              </a>
              {/* WhatsApp */}
              <a href="#" aria-label="WhatsApp" style={{ color: "var(--text-muted)", transition: "color 300ms" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21l1.65-4.95A8 8 0 113 21z" />
                  <path d="M9 9c0 4 3 7 7 7" />
                  <path d="M9 9c0.5-0.6 1.2-1 1.8-0.5l1 1.3c0.3 0.4 0.3 0.9 0 1.3l-0.4 0.4" />
                  <path d="M14 14l0.4-0.4c0.4-0.3 0.9-0.3 1.3 0l1.3 1c0.5 0.6 0.1 1.3-0.5 1.8" />
                </svg>
              </a>
              {/* Mail */}
              <a href="#" aria-label="Email" style={{ color: "var(--text-muted)", transition: "color 300ms" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="1" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.85rem",
          }}
        >
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 300, fontSize: "0.72rem", color: "var(--text-muted)", letterSpacing: "0.05em" }}>
            {t.copyright}
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 300, fontSize: "0.65rem", color: "var(--text-muted)", letterSpacing: "0.3em", textTransform: "uppercase" }}>
            {t.muestra}
          </span>
        </div>
      </div>
    </footer>
  );
}

window.Amenities = Amenities;
window.Testimonials = Testimonials;
window.FinalCTA = FinalCTA;
window.Footer = Footer;
