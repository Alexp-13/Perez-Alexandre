import { motion } from "framer-motion";
import MagneticButton from "./MagneticButton";

function HeroActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.5, ease: "easeOut" }}
      className="z-10 mt-10 flex items-center justify-center gap-4 flex-wrap"
    >
      <MagneticButton strength={0.3} enabled={false}>
        <a
          href="#projects"
          className="group relative flex items-center gap-3 px-8 py-3.5 rounded-2xl overflow-hidden text-sm font-semibold text-white transition-all duration-500 hover:shadow-2xl hover:shadow-accent/50 hover:scale-[1.03]"
          style={{ background: "linear-gradient(135deg, #6366f1 0%, #7c3aed 50%, #a855f7 100%)" }}
        >
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
  );
}

export default HeroActions;
