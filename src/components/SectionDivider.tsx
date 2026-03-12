import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/**
 * SectionDivider — A fancy animated divider between sections.
 * Features a glowing line with an expanding diamond or pulsing dot.
 */
function SectionDivider({
  variant = "line",
  className = "",
}: {
  variant?: "line" | "diamond" | "dots";
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  if (variant === "diamond") {
    return (
      <div ref={ref} className={`flex items-center justify-center py-8 ${className}`}>
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={isInView ? { scaleX: 1, opacity: 0.3 } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 max-w-[200px] h-px bg-gradient-to-r from-transparent to-accent origin-right"
        />
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={isInView ? { scale: 1, rotate: 45 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mx-4 w-2 h-2 bg-accent/50 shadow-[0_0_12px_rgba(99,102,241,0.4)]"
        />
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={isInView ? { scaleX: 1, opacity: 0.3 } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 max-w-[200px] h-px bg-gradient-to-l from-transparent to-accent origin-left"
        />
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div ref={ref} className={`flex items-center justify-center gap-3 py-8 ${className}`}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 0.4 } : {}}
            transition={{ duration: 0.5, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="w-1.5 h-1.5 rounded-full bg-accent/50"
          />
        ))}
      </div>
    );
  }

  // Default: animated glow line
  return (
    <div ref={ref} className={`relative py-4 ${className}`}>
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="glow-line w-full opacity-30 origin-center"
      />
      {/* Glow pulse effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: [0, 0.5, 0] } : {}}
        transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent blur-xl pointer-events-none"
      />
    </div>
  );
}

export default SectionDivider;
