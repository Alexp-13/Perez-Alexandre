import { useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import SectionHeading from "./SectionHeading";

const infoItems = [
  {
    label: "Statut",
    value: "Recherche d'alternance",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.193 23.193 0 0112 15c-3.183 0-6.22-.64-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: "Formation",
    value: "BUT Informatique — 3e année",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
  },
  {
    label: "Email",
    value: "perezalexandre.it@gmail.com",
    href: "mailto:perezalexandre.it@gmail.com",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    value: "@Alexp-13",
    href: "https://github.com/Alexp-13",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
];

/* Magnetic tilt on the photo */
function MagneticPhoto() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const x = ((e.clientY - cy) / (rect.height / 2)) * -8;
    const y = ((e.clientX - cx) / (rect.width / 2)) * 8;
    setTilt({ x, y });
  }, []);

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      ref={imgRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative group"
      style={{ perspective: "600px" }}
    >
      <motion.div
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: "spring", stiffness: 150, damping: 15 }}
        className="w-64 h-72 md:w-80 md:h-[22rem] rounded-2xl overflow-hidden border border-border/40 shadow-2xl shadow-black/40 relative"
      >
        <img
          src="src/assets/img/moi.jpg"
          alt="Alexandre Perez"
          className="w-full h-full object-cover grayscale-[50%] group-hover:grayscale-0 transition-all duration-1000 scale-[1.08] group-hover:scale-100"
        />
        {/* Shine overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </motion.div>
      {/* Decorative elements */}
      <div className="absolute -inset-3 border border-accent/15 rounded-2xl -z-10 transition-all duration-500 group-hover:border-accent/30 group-hover:-inset-4" />
      <div className="absolute -inset-7 border border-accent/5 rounded-3xl -z-10" />
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/10 rounded-full blur-2xl -z-10 group-hover:bg-accent/20 transition-colors duration-700" />
      <div className="absolute -top-4 -left-4 w-16 h-16 bg-accent/5 rounded-full blur-xl -z-10" />
    </div>
  );
}

function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" className="py-28 md:py-36 px-6 relative">
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,var(--color-accent)/4%,transparent_60%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        <SectionHeading tag="// À propos" title="Qui suis-je ?" />

        <div
          ref={ref}
          className="grid md:grid-cols-12 gap-12 lg:gap-20 items-center"
        >
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, x: -60, rotate: -2 }}
            animate={isInView ? { opacity: 1, x: 0, rotate: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-5 flex justify-center"
          >
            <MagneticPhoto />
          </motion.div>

          {/* Bio text */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 1,
              delay: 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="md:col-span-7 space-y-6"
          >
            <p className="text-text-secondary text-lg leading-[1.8]">
              Je suis étudiant en troisième année de{" "}
              <span className="text-text-primary font-medium">
                BUT Informatique
              </span>{" "}
              et développeur full-stack. Je m'intéresse particulièrement à{" "}
              <span className="text-accent font-medium">
                l'architecture logicielle
              </span>{" "}
              ainsi qu'aux systèmes d'
              <span className="text-accent font-medium">
                intelligence artificielle
              </span>
              , notamment autour des LLM et des agents autonomes.
            </p>

            <p className="text-text-muted leading-relaxed">
              À travers mes projets académiques et personnels, j'explore la
              conception de systèmes robustes, la structuration du code et
              l'expérimentation autour de nouvelles approches en IA.
            </p>

            {/* Glassmorphism info cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6">
              {infoItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 25, filter: "blur(4px)" }}
                  animate={
                    isInView
                      ? { opacity: 1, y: 0, filter: "blur(0px)" }
                      : {}
                  }
                  transition={{
                    duration: 0.5,
                    delay: 0.4 + i * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="group/card relative flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] hover:border-accent/30 hover:bg-white/[0.05] transition-all duration-500"
                  data-cursor-hover
                >
                  {/* Glow top-left */}
                  <div className="absolute -top-px -left-px w-12 h-12 bg-accent/10 rounded-full blur-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="mt-0.5 text-text-muted group-hover/card:text-accent transition-colors duration-300 shrink-0">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] text-text-muted/70 uppercase tracking-[0.2em] mb-1">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor-hover
                        className="text-sm text-accent hover:text-accent-light transition-colors truncate block"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm text-text-primary">{item.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default About;
