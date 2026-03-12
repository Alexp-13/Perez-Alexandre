import { useRef, useState, useCallback, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import SectionHeading from "./SectionHeading";
import InfiniteMarquee from "./InfiniteMarquee";
import { techCategories } from "../data/projects";

function TechCard({
  name,
  logo,
  index,
}: {
  name: string;
  logo: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const x = ((e.clientY - cy) / (rect.height / 2)) * -6;
    const y = ((e.clientX - cx) / (rect.width / 2)) * 6;
    setTilt({ x, y });
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.45, delay: index * 0.03, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{ perspective: "400px" }}
      className="group relative flex flex-col items-center gap-3 p-4 bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-xl hover:border-accent/40 hover:shadow-xl hover:shadow-accent/10 transition-all duration-300 cursor-default"
      data-cursor-hover
    >
      {/* Glow */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="absolute -inset-px rounded-xl bg-gradient-to-b from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <motion.div
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative w-10 h-10 flex items-center justify-center"
      >
        <img
          src={logo}
          alt={name}
          className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:drop-shadow-[0_0_12px_rgba(99,102,241,0.4)]"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </motion.div>
      <span className="relative text-xs font-medium text-text-muted group-hover:text-text-primary transition-colors duration-300 text-center">
        {name}
      </span>
    </motion.div>
  );
}

/* ── Tech counter animation ── */
function AnimatedCounter({ target, delay = 0 }: { target: number; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  const started = useRef(false);

  if (isInView && !started.current) {
    started.current = true;
    const duration = 1500;
    const start = Date.now();
    const timeout = setTimeout(() => {
      const tick = () => {
        const elapsed = Date.now() - start - delay;
        if (elapsed < 0) { requestAnimationFrame(tick); return; }
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    // Cleanup not needed for RAF in this simple context
    void timeout;
  }

  return <span ref={ref} className="tabular-nums">{count}</span>;
}

function Skills() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Flatten all techs for the marquee
  const allTechsForMarquee = useMemo(
    () => techCategories.flatMap((c) => c.techs.map((t) => ({ name: t.name, logo: t.logo }))),
    []
  );

  const totalTechs = allTechsForMarquee.length;
  const totalCategories = techCategories.length;

  return (
    <section id="skills" className="py-28 md:py-36 relative overflow-hidden">
      {/* BG accents */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_70%,var(--color-accent)/3%,transparent_60%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      <div className="max-w-6xl mx-auto relative px-6" ref={sectionRef}>
        <SectionHeading
          tag="// Compétences"
          title="Stack Technique"
          subtitle="Les technologies et outils que j'utilise au quotidien."
        />

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center gap-12 mb-16"
        >
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-accent">
              <AnimatedCounter target={totalTechs} />
              <span className="text-accent-light">+</span>
            </div>
            <p className="font-mono text-[10px] text-text-muted tracking-[0.2em] uppercase mt-1">Technologies</p>
          </div>
          <div className="w-px h-10 bg-border/50" />
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-accent">
              <AnimatedCounter target={totalCategories} delay={200} />
            </div>
            <p className="font-mono text-[10px] text-text-muted tracking-[0.2em] uppercase mt-1">Domaines</p>
          </div>
          <div className="w-px h-10 bg-border/50" />
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-accent">
              <AnimatedCounter target={3} delay={400} />
              <span className="text-accent-light text-xl">ans</span>
            </div>
            <p className="font-mono text-[10px] text-text-muted tracking-[0.2em] uppercase mt-1">Expérience</p>
          </div>
        </motion.div>
      </div>

      {/* Infinite Marquee — full width, no padding constraint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mb-16 space-y-4"
      >
        <InfiniteMarquee
          items={allTechsForMarquee.slice(0, Math.ceil(allTechsForMarquee.length / 2))}
          speed={35}
        />
        <InfiniteMarquee
          items={allTechsForMarquee.slice(Math.ceil(allTechsForMarquee.length / 2))}
          speed={40}
          reverse
        />
      </motion.div>

      {/* Detailed grid per category */}
      <div className="max-w-6xl mx-auto relative px-6">
        <div className="space-y-14">
          {techCategories.map((category, catIdx) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 + catIdx * 0.1 }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent/60 shadow-[0_0_8px_rgba(99,102,241,0.4)]" />
                  <h3 className="font-mono text-xs text-accent tracking-[0.2em] uppercase">
                    {category.category}
                  </h3>
                  <span className="font-mono text-[10px] text-text-muted/50 bg-white/[0.03] px-2 py-0.5 rounded-full border border-white/[0.06]">
                    {category.techs.length}
                  </span>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-accent/20 to-transparent" />
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {category.techs.map((tech, i) => (
                  <TechCard
                    key={tech.name}
                    name={tech.name}
                    logo={tech.logo}
                    index={i}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
