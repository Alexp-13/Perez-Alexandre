import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import CustomCursor from "./components/CustomCursor";
import Preloader from "./components/Preloader";
import SmoothScroll from "./components/SmoothScroll";
import SectionDivider from "./components/SectionDivider";

function App() {
  const [loading, setLoading] = useState(true);

  const handleLoadComplete = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Preloader onComplete={handleLoadComplete} />}
      </AnimatePresence>

      {!loading && (
        <SmoothScroll>
          <div className="min-h-screen bg-deep-900 grain">
            <CustomCursor />
            <Navbar />
            <main>
              <Hero />
              <SectionDivider variant="line" />
              <About />
              <SectionDivider variant="diamond" />
              <Projects />
              <SectionDivider variant="dots" />
              <Skills />
              <SectionDivider variant="line" />
              <Contact />
            </main>
            <Footer />
          </div>
        </SmoothScroll>
      )}
    </>
  );
}

export default App;
