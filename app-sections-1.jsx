/* global React */
const { useState: useStateS, useEffect: useEffectS, useRef: useRefS } = React;
const Ts               = window.TRANSLATIONS;
const useScrollRevealS = window.useScrollReveal;
const revealStyleS     = window.revealStyle;
const EyebrowS         = window.Eyebrow;
const GoldLineS        = window.GoldLine;

// ─────────────────────────────────────────────
// MANIFESTO
// ─────────────────────────────────────────────
function Manifesto({ lang }) {
  const t = Ts[lang].manifesto;
  const [textRef, textRevealed] = useScrollRevealS();
  const [imgRef,  imgRevealed]  = useScrollRevealS({ threshold: 0.1 });

  return (
    <section style={{
      background: "var(--bg)",
      padding: "clamp(5rem, 12vw, 10rem) clamp(1.25rem, 6vw, 5rem)",
      position: "relative",
      borderTop: "1px solid var(--border)",
    }}>
      <div className="manifesto-grid" style={{
        maxWidth: "1400px", margin: "0 auto",
        display: "grid", gridTemplateColumns: "1fr 1.2fr",
        gap: "clamp(2rem, 6vw, 6rem)", alignItems: "center",
      }}>
        <div ref={textRef} style={revealStyleS(textRevealed)}>
          <EyebrowS>{t.eyebrow}</EyebrowS>
          <h2 style={{
            fontFamily: '"Playfair Display",serif', fontWeight: 400,
            fontSize: "clamp(2rem, 4.2vw, 3.8rem)", lineHeight: 1.1,
            color: "var(--text-primary)", margin: "0 0 2rem 0",
            whiteSpace: "pre-line", letterSpacing: "-0.01em",
          }}>
            {t.title}
          </h2>
          <p style={{
            fontFamily: "Inter,sans-serif", fontWeight: 300,
            fontSize: "clamp(0.95rem, 1.05vw, 1.05rem)", lineHeight: 1.75,
            color: "var(--text-muted)", maxWidth: "520px", margin: 0,
          }}>
            {t.body}
          </p>
          <p style={{
            fontFamily: '"Playfair Display",serif', fontStyle: "italic",
            fontWeight: 400, fontSize: "clamp(1.05rem, 1.4vw, 1.3rem)",
            lineHeight: 1.5, color: "var(--text-primary)",
            maxWidth: "520px", marginTop: "2rem",
          }}>
            {t.body2}
          </p>
          <div style={{
            display: "flex", gap: "clamp(2rem, 4vw, 3.5rem)",
            marginTop: "3.5rem", paddingTop: "2rem",
            borderTop: "1px solid var(--border)", flexWrap: "wrap",
          }}>
            {t.stats.map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: '"Playfair Display",serif', fontWeight: 400, fontSize: "clamp(1.6rem, 2.6vw, 2.4rem)", color: "var(--gold)", lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontFamily: "Inter,sans-serif", fontWeight: 300, fontSize: "0.7rem", letterSpacing: "0.28em", color: "var(--text-muted)", textTransform: "uppercase", marginTop: "0.6rem" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div ref={imgRef} style={{ ...revealStyleS(imgRevealed, 200), position: "relative", aspectRatio: "4/5", overflow: "hidden" }}>
          <img src="assets/manifesto-lodge.webp" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.85) contrast(1.05) brightness(0.9)" }} />
          <div style={{ position: "absolute", top: "-12px", right: "-12px", width: "120px", height: "120px", borderTop: "1px solid var(--gold)", borderRight: "1px solid var(--gold)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-12px", left: "-12px", width: "120px", height: "120px", borderBottom: "1px solid var(--gold)", borderLeft: "1px solid var(--gold)", pointerEvents: "none" }} />
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// SUITES — horizontal scroll sticky + lerp (FIXED)
// ─────────────────────────────────────────────
/*
  FIX: el cálculo del travel horizontal.

  ANTES: track.scrollWidth - window.innerWidth
  Cuando el track tiene `width: 300vw` por CSS, scrollWidth devuelve
  valores inconsistentes entre browsers. Algunos dan el CSS width,
  otros el tamaño del contenido — resultado: el track termina antes
  o después de lo esperado.

  AHORA: (COUNT - 1) * window.innerWidth
  Matemática directa: para 3 suites de 100vw cada una, el travel
  necesario es exactamente 2 pantallas = 2 × window.innerWidth.
  Confiable en todos los browsers.

  ALTURA DE LA SECCIÓN:
  (COUNT + 1) × 100vh = 400vh para 3 suites.
  Desglose: 100vh visible + COUNT × 100vh de scroll = 400vh total.
  Esto garantiza que haya suficiente recorrido para llegar al final
  del track antes de liberar el scroll vertical.
*/
function Suites({ lang }) {
  const t = Ts[lang].suites;
  const sectionRef = useRefS(null);
  const trackRef   = useRefS(null);
  const [activeIdx, setActiveIdx] = useStateS(0);
  const [isMobile,  setIsMobile]  = useStateS(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffectS(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const suiteList = [
    { key: "qoya",   img: "assets/suite-qoya.webp",   data: t.qoya   },
    { key: "chaska", img: "assets/suite-chaska.webp", data: t.chaska },
    { key: "inca",   img: "assets/suite-inca.webp",   data: t.inca   },
  ];
  const COUNT = suiteList.length;

  useEffectS(() => {
    if (isMobile) return;

    let rafId;
    let currentX = 0;
    let targetX  = 0;

    const compute = () => {
      const section = sectionRef.current;
      if (!section) return;

      const winH         = window.innerHeight;
      const winW         = window.innerWidth;
      const sectionH     = section.offsetHeight;
      const rect         = section.getBoundingClientRect();
      const scrolled     = -rect.top;
      const maxScroll    = sectionH - winH;
      const progress     = Math.max(0, Math.min(1, scrolled / maxScroll));

      // FIX: travel = (nro slides - 1) × ancho de pantalla
      const trackTravel  = (COUNT - 1) * winW;
      targetX = -(progress * trackTravel);

      const idx = Math.min(COUNT - 1, Math.floor(progress * COUNT * 0.9999));
      setActiveIdx((prev) => (prev !== idx ? idx : prev));
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.1;
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
      <section id="suites" style={{ background: "var(--bg)", padding: "5rem 0 3rem", borderTop: "1px solid var(--border)" }}>
        <div style={{ padding: "0 1.25rem", marginBottom: "2rem" }}>
          <EyebrowS>{t.eyebrow}</EyebrowS>
          <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: "2rem", lineHeight: 1.1, color: "var(--text-primary)", margin: 0, fontWeight: 400 }}>
            {t.sectionLabel}
          </h2>
        </div>
        <div style={{ display: "flex", overflowX: "auto", scrollSnapType: "x mandatory", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
          {suiteList.map((s) => <SuiteCardMobile key={s.key} suite={s} />)}
        </div>
      </section>
    );
  }

  // ── DESKTOP: sticky + JS horizontal scroll ──
  return (
    <section
      id="suites"
      ref={sectionRef}
      style={{
        height: `${(COUNT + 1) * 100}vh`,  // 400vh para 3 suites
        position: "relative",
        background: "var(--bg)",
        borderTop: "1px solid var(--border)",
      }}
    >
      {/*
        El sticky inner div se queda fijo mientras el usuario scrollea
        el espacio del section externo. overflow:hidden recorta el track.
        SIN position:fixed explícito — sticky se encarga de eso.
      */}
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>

        {/* Label flotante */}
        <div style={{
          position: "absolute",
          top: "clamp(5rem, 9vh, 7rem)",
          left: "clamp(1.25rem, 6vw, 5rem)",
          zIndex: 5, pointerEvents: "none",
        }}>
          <EyebrowS>{t.eyebrow}</EyebrowS>
          <div style={{ fontFamily: '"Playfair Display",serif', fontStyle: "italic", fontWeight: 400, fontSize: "1.1rem", color: "var(--text-primary)", opacity: 0.9 }}>
            {t.sectionLabel}
          </div>
        </div>

        {/* Track horizontal — 300vw para 3 suites */}
        <div
          ref={trackRef}
          style={{
            display: "flex",
            width: `${100 * COUNT}vw`,
            height: "100%",
            willChange: "transform",
          }}
        >
          {suiteList.map((s, i) => <SuiteCard key={s.key} suite={s} index={i} total={COUNT} />)}
        </div>

        {/* Indicador de progreso */}
        <div style={{
          position: "absolute", bottom: "2.5rem",
          right: "clamp(1.25rem, 6vw, 5rem)",
          zIndex: 5, display: "flex", gap: "0.5rem", alignItems: "center",
        }}>
          <span style={{ fontFamily: "Inter,sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "var(--text-muted)", marginRight: "1rem" }}>
            {String(activeIdx + 1).padStart(2, "0")} / {String(COUNT).padStart(2, "0")}
          </span>
          {suiteList.map((_, i) => (
            <span key={i} style={{
              width: i === activeIdx ? "44px" : "20px", height: "1px",
              background: i === activeIdx ? "var(--gold)" : "var(--border)",
              transition: "width 500ms ease, background 500ms ease",
            }} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SuiteCard({ suite, index, total }) {
  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden", flexShrink: 0 }}>
      <img src={suite.img} alt={suite.data.name} style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        objectFit: "cover", filter: "saturate(0.85) contrast(1.05) brightness(0.85)",
      }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.1) 70%, rgba(0,0,0,0.5) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.55) 0%, transparent 50%)" }} />

      <div style={{
        position: "absolute", top: "50%", right: "clamp(2rem, 8vw, 7rem)",
        transform: "translateY(-50%)",
        fontFamily: '"Playfair Display",serif', fontStyle: "italic", fontWeight: 400,
        fontSize: "clamp(8rem, 20vw, 22rem)",
        color: "rgba(197,168,128,0.10)", lineHeight: 1,
        pointerEvents: "none", userSelect: "none",
      }}>
        {String(index + 1).padStart(2, "0")}
      </div>

      <div style={{
        position: "absolute",
        bottom: "clamp(3rem, 7vh, 5rem)",
        left: "clamp(1.25rem, 6vw, 5rem)",
        right: "clamp(1.25rem, 6vw, 5rem)",
        zIndex: 2, maxWidth: "640px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "1.25rem" }}>
          <GoldLineS width={36} />
          <span style={{ fontFamily: "Inter,sans-serif", fontWeight: 400, fontSize: "0.7rem", letterSpacing: "0.35em", color: "var(--gold)", textTransform: "uppercase" }}>
            {suite.data.tag}
          </span>
        </div>
        <h3 style={{ fontFamily: '"Playfair Display",serif', fontWeight: 400, fontSize: "clamp(2.5rem, 5vw, 4.5rem)", lineHeight: 1, color: "var(--text-primary)", margin: "0 0 1.25rem 0", letterSpacing: "-0.01em" }}>
          {suite.data.name}
        </h3>
        <p style={{ fontFamily: "Inter,sans-serif", fontWeight: 300, fontSize: "clamp(0.9rem, 1vw, 1rem)", lineHeight: 1.7, color: "var(--text-primary)", opacity: 0.85, maxWidth: "520px", margin: 0 }}>
          {suite.data.features}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "2rem", marginTop: "2rem", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "Inter,sans-serif", fontWeight: 500, fontSize: "0.95rem", letterSpacing: "0.06em", color: "var(--gold)" }}>
            {suite.data.price}
          </span>
          <button
            style={{ background: "transparent", border: "1px solid var(--gold)", color: "var(--gold)", padding: "0.95rem 2.25rem", fontFamily: "Inter,sans-serif", fontWeight: 400, fontSize: "0.7rem", letterSpacing: "0.28em", textTransform: "uppercase", cursor: "pointer", transition: "background 400ms ease, color 400ms ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--gold)"; e.currentTarget.style.color = "var(--bg)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--gold)"; }}
          >
            {suite.data.cta} →
          </button>
        </div>
      </div>
    </div>
  );
}

function SuiteCardMobile({ suite }) {
  return (
    <div style={{ flex: "0 0 88vw", scrollSnapAlign: "start", marginLeft: "1.25rem", marginRight: "1.25rem", position: "relative", aspectRatio: "3/4", overflow: "hidden" }}>
      <img src={suite.img} alt={suite.data.name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.85) brightness(0.85)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 55%)" }} />
      <div style={{ position: "absolute", bottom: "1.5rem", left: "1.5rem", right: "1.5rem" }}>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "var(--gold)", textTransform: "uppercase", marginBottom: "0.5rem" }}>{suite.data.tag}</div>
        <div style={{ fontFamily: '"Playfair Display",serif', fontSize: "2rem", color: "var(--text-primary)", lineHeight: 1, marginBottom: "0.75rem" }}>{suite.data.name}</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontWeight: 300, fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>{suite.data.features}</div>
        <div style={{ marginTop: "1rem", fontFamily: "Inter,sans-serif", fontSize: "0.85rem", color: "var(--gold)", fontWeight: 500 }}>{suite.data.price}</div>
      </div>
    </div>
  );
}

window.Manifesto = Manifesto;
window.Suites    = Suites;
