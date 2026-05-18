/* global React */
const { useState: useStateS, useEffect: useEffectS, useRef: useRefS } = React;
const Ts = window.TRANSLATIONS;
const useScrollRevealS = window.useScrollReveal;
const revealStyleS = window.revealStyle;
const EyebrowS = window.Eyebrow;
const GoldLineS = window.GoldLine;

// ─────────────────────────────────────────────
// MANIFESTO
// ─────────────────────────────────────────────
function Manifesto({ lang }) {
  const t = Ts[lang].manifesto;
  const [textRef, textRevealed] = useScrollRevealS();
  const [imgRef, imgRevealed] = useScrollRevealS({ threshold: 0.1 });

  return (
    <section
      style={{
        background: "var(--bg)",
        padding: "clamp(5rem, 12vw, 10rem) clamp(1.25rem, 6vw, 5rem)",
        position: "relative",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div
        className="manifesto-grid"
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1.2fr",
          gap: "clamp(2rem, 6vw, 6rem)",
          alignItems: "center",
        }}
      >
        {/* Text */}
        <div ref={textRef} style={revealStyleS(textRevealed)}>
          <EyebrowS>{t.eyebrow}</EyebrowS>
          <h2
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 400,
              fontSize: "clamp(2rem, 4.2vw, 3.8rem)",
              lineHeight: 1.1,
              color: "var(--text-primary)",
              margin: "0 0 2rem 0",
              whiteSpace: "pre-line",
              letterSpacing: "-0.01em",
            }}
          >
            {t.title}
          </h2>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 300,
              fontSize: "clamp(0.95rem, 1.05vw, 1.05rem)",
              lineHeight: 1.75,
              color: "var(--text-muted)",
              maxWidth: "520px",
              margin: 0,
            }}
          >
            {t.body}
          </p>
          <p
            style={{
              fontFamily: '"Playfair Display", serif',
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(1.05rem, 1.4vw, 1.3rem)",
              lineHeight: 1.5,
              color: "var(--text-primary)",
              maxWidth: "520px",
              marginTop: "2rem",
            }}
          >
            {t.body2}
          </p>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              gap: "clamp(2rem, 4vw, 3.5rem)",
              marginTop: "3.5rem",
              paddingTop: "2rem",
              borderTop: "1px solid var(--border)",
              flexWrap: "wrap",
            }}
          >
            {t.stats.map((s, i) => (
              <div key={i}>
                <div
                  style={{
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 400,
                    fontSize: "clamp(1.6rem, 2.6vw, 2.4rem)",
                    color: "var(--gold)",
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 300,
                    fontSize: "0.7rem",
                    letterSpacing: "0.28em",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    marginTop: "0.6rem",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Image */}
        <div
          ref={imgRef}
          style={{
            ...revealStyleS(imgRevealed, 200),
            position: "relative",
            aspectRatio: "4/5",
            overflow: "hidden",
          }}
        >
          <img
            src="assets/manifesto-lodge.webp"
            alt=""
            loading="lazy"
            decoding="async"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "saturate(0.9) contrast(1.05) brightness(0.95)",
            }}
          />
          {/* Decorative frame */}
          <div
            style={{
              position: "absolute",
              top: "-12px",
              right: "-12px",
              width: "120px",
              height: "120px",
              borderTop: "1px solid var(--gold)",
              borderRight: "1px solid var(--gold)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-12px",
              left: "-12px",
              width: "120px",
              height: "120px",
              borderBottom: "1px solid var(--gold)",
              borderLeft: "1px solid var(--gold)",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// SUITES — vertical alternating layout + parallax + decorative numerals
// ─────────────────────────────────────────────
function Suites({ lang }) {
  const t = Ts[lang].suites;
  const parallaxRefs = useRefS([]);

  const suiteList = [
    { key: "qoya", img: "assets/suite-qoya.webp", data: t.qoya },
    { key: "chaska", img: "assets/suite-chaska.webp", data: t.chaska },
    { key: "inca", img: "assets/suite-inca.webp", data: t.inca },
  ];

  // Single rAF-driven parallax loop for all suite images
  useEffectS(() => {
    let rafId;
    let ticking = false;

    const update = () => {
      const winH = window.innerHeight;
      parallaxRefs.current.forEach((el) => {
        if (!el) return;
        const rect = el.parentElement.getBoundingClientRect();
        // Only update while visible-ish
        if (rect.bottom < -200 || rect.top > winH + 200) return;
        const center = rect.top + rect.height / 2 - winH / 2;
        const offset = center * -0.08;
        el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
      });
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      id="suites"
      style={{
        background: "var(--bg)",
        padding: "clamp(5rem, 11vw, 9rem) clamp(1.25rem, 6vw, 5rem) clamp(3rem, 6vw, 5rem)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Section heading */}
        <SuitesHeader t={t} />

        {/* Cards */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {suiteList.map((s, i) => (
            <SuiteRow
              key={s.key}
              suite={s}
              index={i}
              total={suiteList.length}
              parallaxRefs={parallaxRefs}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function SuitesHeader({ t }) {
  const [ref, revealed] = useScrollRevealS();
  return (
    <div ref={ref} style={{ ...revealStyleS(revealed), marginBottom: "clamp(3rem, 6vw, 5rem)", maxWidth: "780px" }}>
      <EyebrowS>{t.eyebrow}</EyebrowS>
      <h2
        style={{
          fontFamily: '"Playfair Display", serif',
          fontWeight: 400,
          fontSize: "clamp(2.25rem, 4.5vw, 4rem)",
          lineHeight: 1.1,
          color: "var(--text-primary)",
          margin: 0,
          letterSpacing: "-0.01em",
        }}
      >
        {t.sectionLabel}
      </h2>
    </div>
  );
}

function SuiteRow({ suite, index, total, parallaxRefs }) {
  const [ref, revealed] = useScrollRevealS({ threshold: 0.12 });
  const [hover, setHover] = useStateS(false);
  const delay = index * 120;
  const isReversed = index % 2 === 1;

  const setImgRef = (el) => {
    parallaxRefs.current[index] = el;
  };

  return (
    <article
      ref={ref}
      className={isReversed ? "suite-row suite-row--reversed" : "suite-row"}
      style={{
        ...revealStyleS(revealed, delay),
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "clamp(2rem, 5vw, 5rem)",
        alignItems: "center",
        padding: "clamp(3rem, 6vw, 5rem) 0",
        borderBottom: index < total - 1 ? "1px solid var(--border)" : "none",
      }}
    >
      {/* Image */}
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          gridColumn: isReversed ? 2 : 1,
          gridRow: 1,
          position: "relative",
          aspectRatio: "3 / 2",
          overflow: "hidden",
          background: "var(--surface)",
        }}
      >
        <div
          ref={setImgRef}
          style={{
            position: "absolute",
            top: "-5%",
            left: 0,
            width: "100%",
            height: "110%",
            willChange: "transform",
            transition: "transform 80ms linear",
          }}
        >
          <img
            src={suite.img}
            alt={suite.data.name}
            loading="lazy"
            decoding="async"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "saturate(0.85) brightness(0.88)",
              transform: hover ? "scale(1.04)" : "scale(1.0)",
              transition: "transform 1200ms cubic-bezier(0.2,0.7,0.2,1)",
            }}
          />
        </div>
        {/* Corner accents */}
        <span
          style={{
            position: "absolute",
            top: 0, left: 0,
            width: "40px", height: "40px",
            borderTop: "1px solid var(--gold)",
            borderLeft: "1px solid var(--gold)",
            pointerEvents: "none",
            opacity: 0.6,
          }}
        />
        <span
          style={{
            position: "absolute",
            bottom: 0, right: 0,
            width: "40px", height: "40px",
            borderBottom: "1px solid var(--gold)",
            borderRight: "1px solid var(--gold)",
            pointerEvents: "none",
            opacity: 0.6,
          }}
        />
      </div>

      {/* Text */}
      <div
        style={{
          gridColumn: isReversed ? 1 : 2,
          gridRow: 1,
          position: "relative",
          padding: "clamp(0.5rem, 1.5vw, 1rem) 0",
        }}
      >
        {/* Big watermark numeral */}
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-1.5rem",
            right: "-0.5rem",
            fontFamily: '"Playfair Display", serif',
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(6rem, 15vw, 14rem)",
            color: "rgba(197,168,128,0.06)",
            lineHeight: 1,
            userSelect: "none",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "1.25rem" }}>
            <GoldLineS width={36} />
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
              {suite.data.tag}
            </span>
          </div>

          <h3
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 400,
              fontSize: "clamp(2rem, 3.5vw, 3.25rem)",
              lineHeight: 1.05,
              color: "var(--text-primary)",
              margin: "0 0 1.25rem 0",
              letterSpacing: "-0.01em",
            }}
          >
            {suite.data.name}
          </h3>

          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 300,
              fontSize: "clamp(0.92rem, 1.05vw, 1.05rem)",
              lineHeight: 1.7,
              color: "var(--text-muted)",
              maxWidth: "480px",
              margin: 0,
            }}
          >
            {suite.data.features}
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2rem",
              marginTop: "2rem",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                fontSize: "0.95rem",
                letterSpacing: "0.06em",
                color: "var(--gold)",
              }}
            >
              {suite.data.price}
            </span>
            <button
              style={{
                background: "transparent",
                border: "1px solid var(--gold)",
                color: "var(--gold)",
                padding: "0.9rem 2.25rem",
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontSize: "0.7rem",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "background 400ms ease, color 400ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--gold)";
                e.currentTarget.style.color = "var(--bg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--gold)";
              }}
            >
              {suite.data.cta} →
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

window.Manifesto = Manifesto;
window.Suites = Suites;
