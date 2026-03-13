import { motion } from "framer-motion";
import TextScramble from "./TextScramble";
import { useState } from "react";

function Footer() {
  const [hovered, setHovered] = useState(false);

  return (
    <footer className="relative border-t border-border/30 py-10 px-6 overflow-hidden">
      {/* Subtle animated gradient bar at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="max-w-6xl mx-auto">
        {/* Large decorative text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 overflow-hidden"
        >
          <div
            className="text-[4rem] md:text-[6rem] lg:text-[8rem] font-black leading-none select-none opacity-40 hover:opacity-70 transition-opacity duration-700"
            style={{
              color: "#A3B0FB",
              WebkitTextStroke: "2px #A3B0FB",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            data-cursor-hover
          >
            {hovered ? (
              <TextScramble text="MERCI" className="font-black !font-sans" speed={20} />
            ) : (
              "MERCI"
            )}
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[11px] text-[#A3B0FB]">
            © {new Date().getFullYear()} Alexandre Perez — Crafted with React · Tailwind · Framer Motion · GSAP
          </p>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/Alexp-13"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-hover
              className="group text-text-muted/60 hover:text-accent text-xs transition-colors duration-300 relative"
            >
              GitHub
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-300" />
            </a>
            <a
              href="mailto:perezalexandre.it@gmail.com"
              data-cursor-hover
              className="group text-text-muted/60 hover:text-accent text-xs transition-colors duration-300 relative"
            >
              Email
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-300" />
            </a>
          </div>
        </div>

        {/* Back to top */}
        <motion.div
          className="mt-6 flex justify-center"
          whileHover={{ y: -2 }}
        >
          <a
            href="#hero"
            data-cursor-hover
            className="group flex items-center gap-2 text-text-muted/40 hover:text-accent transition-colors duration-300 font-mono text-[10px] tracking-[0.2em] uppercase"
          >
            <svg className="w-3 h-3 rotate-180 group-hover:-translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            Retour en haut
          </a>
        </motion.div>
      </div>
    </footer>
  );
}

export default Footer;
