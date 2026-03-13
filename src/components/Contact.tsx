import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import MagneticButton from "./MagneticButton";

/* ── Animated grid background for contact ── */
function AnimatedGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      time += 0.005;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const gridSize = 40;
      const cols = Math.ceil(w / gridSize) + 1;
      const rows = Math.ceil(h / gridSize) + 1;

      // Draw grid dots with pulsing
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * gridSize;
          const y = j * gridSize;

          // Distance-based wave
          const cx = w / 2;
          const cy = h / 2;
          const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
          const wave = Math.sin(dist * 0.01 - time * 3) * 0.5 + 0.5;

          const alpha = 0.03 + wave * 0.08;
          const radius = 1 + wave * 1;

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(99, 102, 241, ${alpha})`;
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="contact" className="py-32 md:py-40 px-6 relative overflow-hidden">
      {/* BG gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-deep-900 via-deep-800/40 to-deep-900" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--color-accent)/6%,transparent_55%)]" />

      {/* Animated grid background */}
      <AnimatedGrid />

      {/* Floating orbs */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/5 rounded-full blur-[100px] pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none"
      />

      <div className="max-w-3xl mx-auto text-center relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center gap-4 mb-6"
        >
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-accent/50" />
          <p className="font-mono text-accent text-xs tracking-[0.25em] uppercase">// Contact</p>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-accent/50" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-6xl font-bold text-text-primary mb-6"
        >
          Travaillons{" "}
          <span className="text-gradient">ensemble</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-text-secondary text-lg mb-12 leading-relaxed max-w-xl mx-auto"
        >
          Actuellement à la recherche d'une alternance. N'hésitez pas à me contacter.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {/* Primary CTA with animated gradient border */}
          <MagneticButton strength={0.25}>
            <a
              href="mailto:perezalexandre.it@gmail.com"
              data-cursor-hover
              className="group relative px-10 py-4 rounded-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-accent/25 block"
            >
              {/* Animated gradient border */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent via-purple-500 to-accent bg-[length:200%_100%] animate-[shimmer_3s_linear_infinite]" />
              <div className="absolute inset-[1px] rounded-[10px] bg-deep-900" />
              <div className="absolute inset-[1px] rounded-[10px] bg-gradient-to-r from-accent/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10 flex items-center gap-2.5 text-text-primary font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Me contacter
              </span>
            </a>
          </MagneticButton>
          <MagneticButton strength={0.2}>
            <a
              href="https://github.com/Alexp-13"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-hover
              className="group px-8 py-3.5 border border-white/[0.08] hover:border-accent/40 text-text-secondary hover:text-text-primary rounded-xl transition-all duration-400 backdrop-blur-sm bg-white/[0.02] hover:bg-white/[0.04] flex items-center gap-2.5"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
          </MagneticButton>
          <MagneticButton strength={0.2}>
            <a
              href="src/assets/other/Cv-perez-alexandre.pdf"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-hover
              className="group px-8 py-3.5 border border-white/[0.08] hover:border-accent/40 text-text-secondary hover:text-text-primary rounded-xl transition-all duration-400 backdrop-blur-sm bg-white/[0.02] hover:bg-white/[0.04] flex items-center gap-2.5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              CV
            </a>
          </MagneticButton>
        </motion.div>

        {/* Decorative bottom element */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 1 }}
          className="mt-16 flex items-center justify-center gap-3"
        >
          <div className="h-px w-8 bg-accent/20" />
          <span className="font-mono text-[10px] text-[#A3B0FB] tracking-[0.3em]">
            OPEN TO OPPORTUNITIES
          </span>
          <div className="h-px w-8 bg-accent/20" />
        </motion.div>
      </div>
    </section>
  );
}

export default Contact;
