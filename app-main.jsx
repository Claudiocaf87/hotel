/* global React, ReactDOM */
const { useState: useStateMain, useEffect: useEffectMain } = React;

function App() {
  const [lang, setLang] = useStateMain("es");

  // Smooth-scroll anchors
  useEffectMain(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  return (
    <React.Fragment>
      <window.Navbar lang={lang} setLang={setLang} />
      <window.Hero lang={lang} />
      <window.Manifesto lang={lang} />
      <window.Suites lang={lang} />
      <window.Amenities lang={lang} />
      <window.Testimonials lang={lang} />
      <window.FinalCTA lang={lang} />
      <window.Footer lang={lang} />
    </React.Fragment>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
