import NeuralNetworkCanvas from "./NeuralNetworkCanvas";
import AuroraBackground from "./AuroraBackground";
import MagneticButton from "./MagneticButton";
import TextScramble from "./TextScramble";
import TypeWriter from "./TypeWriter";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

/* ── letter-by-letter reveal with 3D flip ── */
const letterVariants = {
  hidden: { opacity: 0, y: 80, rotateX: -90, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: "blur(0px)",
    transition: {
      delay: 0.5 + i * 0.035,
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

function AnimatedText({
  text,
  className,
  startDelay = 0,
}: {
  text: string;
  className?: string;
  startDelay?: number;
}) {
  return (
    <span
      className={`inline-flex overflow-hidden ${className ?? ""}`}
      style={{ perspective: "800px" }}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          custom={i + startDelay}
          variants={letterVariants}
          initial="hidden"
          animate="visible"
          className="inline-block"
          style={{ transformOrigin: "bottom center" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

/* ── floating badge with glitch ── */
function FloatingBadge() {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, filter: "blur(12px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.span
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="inline-flex items-center gap-2.5 font-mono text-[11px] md:text-xs tracking-[0.35em] uppercase px-5 py-2.5 border border-accent/20 rounded-full bg-accent/[0.06] backdrop-blur-md shadow-lg shadow-accent/5 hover:border-accent/50 hover:shadow-accent/20 transition-all duration-500"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
        </span>
        {hovered ? (
          <TextScramble text="Dev Fullstack" speed={25} revealSpeed={1.5} />
        ) : (
          "Dev Fullstack"
        )}
      </motion.span>
    </motion.div>
  );
}

/* ── Parallax floating shapes ── */
function FloatingShapes() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Geometric shapes that float and rotate */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          rotate: [0, 180, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[15%] left-[10%] w-20 h-20 border border-accent/10 rounded-lg"
        style={{ transform: "rotate(45deg)" }}
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -90, -180],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-[25%] right-[15%] w-3 h-3 bg-accent/20 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.3)]"
      />
      <motion.div
        animate={{
          y: [0, -15, 0],
          x: [0, 10, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[30%] left-[20%] w-1 h-16 bg-gradient-to-b from-accent/20 to-transparent rounded-full"
      />
      <motion.div
        animate={{
          y: [0, 25, 0],
          rotate: [0, 360],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute top-[40%] right-[25%] w-12 h-12 border border-purple-500/10 rounded-full"
      />
      <motion.div
        animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[20%] right-[10%] w-2 h-2 bg-accent rounded-full"
      />
      {/* Code-like floating text */}
      <motion.div
        animate={{ y: [0, -20, 0], opacity: [0.05, 0.12, 0.05] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[60%] left-[5%] font-mono text-[10px] text-accent/20 rotate-[-10deg]"
      >
        {"<code/>"}
      </motion.div>
      <motion.div
        animate={{ y: [0, 15, 0], opacity: [0.05, 0.1, 0.05] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-[20%] right-[5%] font-mono text-[10px] text-purple-400/20 rotate-[5deg]"
      >
        {"{ }"}
      </motion.div>
    </div>
  );
}

/* ── typing animation strings ── */
const typedStrings = [
  { prefix: "Un développeur ", highlight: "Fullstack", highlightClass: "text-accent" },
  { prefix: "Un développeur ", highlight: "IA", highlightClass: "text-accent-light" },
  { prefix: "Un développeur ", highlight: "Backend", highlightClass: "text-purple-400" },
  { prefix: "Votre prochain ", highlight: "collègue", highlightClass: "text-accent-glow" },
];

/* ── main hero ── */
function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
    >
      {/* Aurora gradient background layer */}
      <div className="absolute inset-0 z-0">
        <AuroraBackground />
      </div>

      {/* Neural Network Background — with parallax */}
      <motion.div className="absolute inset-0 z-[1]">
        <NeuralNetworkCanvas />
      </motion.div>

      {/* Overlays */}
      <div className="absolute inset-0 z-[2]">
        {/* Radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,transparent_0%,var(--color-deep-900)_100%)]" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-deep-900 to-transparent" />
        {/* Top subtle fade */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-deep-900/60 to-transparent" />
      </div>

      {/* Floating geometric shapes */}
      <FloatingShapes />

      {/* Content with parallax */}
      <motion.div className="relative z-10 text-center px-6 max-w-5xl">
        {/* Floating badge */}
        <FloatingBadge />

        {/* Name — massive typography with enhanced styling */}
        <h1 className="mt-8 mb-2 text-[3.5rem] md:text-[5.5rem] lg:text-[7rem] font-black tracking-[-0.04em] leading-[0.95]">
          <AnimatedText text="Alexandre" className="text-text-primary" />
          <br />
          <AnimatedText
            text="Perez"
            className="text-gradient"
            startDelay={10}
          />
        </h1>

        {/* Horizontal line accent under name */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-4 mb-6 h-[1px] w-32 origin-center"
          style={{
            background: "linear-gradient(90deg, transparent, var(--color-accent), var(--color-accent-light), var(--color-accent), transparent)",
          }}
        />

        {/* Typing animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 h-10 flex items-center justify-center"
        >
          <TypeWriter
            strings={typedStrings}
            typeSpeed={30}
            backSpeed={30}
            pauseDuration={1500}
            className="text-xl md:text-2xl font-medium text-text-secondary"
          />
        </motion.div>

        {/* Bio text */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 max-w-2xl mx-auto space-y-3"
        >
          <p className="text-text-secondary text-lg md:text-xl leading-relaxed">
            Étudiant en 3<sup>e</sup> année de{" "}
            <span className="text-text-primary font-medium">BUT Informatique</span> —
            passionné par l'
            <span className="text-accent font-medium">architecture logicielle</span> et
            les systèmes d'
            <span className="text-accent font-medium">intelligence artificielle</span>.
          </p>
          <p className="text-text-muted text-base leading-relaxed font-mono text-sm tracking-wider">
            {">"} Conception de systèmes robustes · LLM · Agents autonomes
          </p>
        </motion.div>


      </motion.div>

      {/* CTA buttons — fixed (outside parallax) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5, ease: "easeOut" }}
        className="absolute bottom-28 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center gap-4 flex-wrap"
      >
        <MagneticButton strength={0.3} enabled={false}>
          <a
            href="#projects"
            className="group relative flex items-center gap-3 px-8 py-3.5 rounded-2xl overflow-hidden text-sm font-semibold text-white transition-all duration-500 hover:shadow-2xl hover:shadow-accent/50 hover:scale-[1.03]"
            style={{ background: "linear-gradient(135deg, #6366f1 0%, #7c3aed 50%, #a855f7 100%)" }}
          >
            {/* Animated shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <svg className="relative z-10 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="relative z-10">Mes projets</span>
          </a>
        </MagneticButton>

        <MagneticButton strength={0.3} enabled={false}>
          <a
            href="#skills"
            className="group relative px-8 py-3.5 border border-border/50 hover:border-accent/50 text-text-secondary hover:text-text-primary rounded-2xl transition-all duration-300 backdrop-blur-sm bg-white/[0.02] text-sm font-medium hover:bg-white/[0.06] overflow-hidden"
          >
            <span className="relative z-10">Compétences</span>
            <span className="absolute bottom-3 left-8 right-8 h-px bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </a>
        </MagneticButton>

        <MagneticButton strength={0.3} enabled={false}>
          <a
            href="#about"
            className="group relative px-8 py-3.5 border border-border/50 hover:border-accent/50 text-text-secondary hover:text-text-primary rounded-2xl transition-all duration-300 backdrop-blur-sm bg-white/[0.02] text-sm font-medium hover:bg-white/[0.06] overflow-hidden"
          >
            <span className="relative z-10">À propos</span>
            <span className="absolute bottom-3 left-8 right-8 h-px bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </a>
        </MagneticButton>
      </motion.div>

      {/* Scroll indicator — enhanced */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="flex flex-col items-center gap-3"
        >
          <span className="font-mono text-[9px] text-text-muted/60 tracking-[0.4em] uppercase">
            Scroll
          </span>
          <div className="relative w-[18px] h-7 border border-text-muted/30 rounded-full flex items-start justify-center p-1.5">
            <motion.div
              animate={{ y: [0, 8, 0], opacity: [1, 0.2, 1] }}
              transition={{
                repeat: Infinity,
                duration: 2.5,
                ease: "easeInOut",
              }}
              className="w-[3px] h-[3px] bg-accent rounded-full shadow-[0_0_6px_rgba(99,102,241,0.6)]"
            />
          </div>
          {/* Animated line below scroll */}
          <motion.div
            animate={{ scaleY: [0, 1, 0], opacity: [0, 0.5, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="w-px h-8 bg-gradient-to-b from-accent/50 to-transparent origin-top"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

export default Hero;
