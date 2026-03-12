import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface SectionHeadingProps {
  tag: string;
  title: string;
  subtitle?: string;
}

function SectionHeading({ tag, title, subtitle }: SectionHeadingProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="mb-16 md:mb-24">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-4 mb-5"
      >
        <div className="h-px w-10 bg-gradient-to-r from-accent/80 to-accent/20" />
        <p className="font-mono text-accent text-xs tracking-[0.25em] uppercase">
          {tag}
        </p>
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
        animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.22 }}
          className="text-text-secondary mt-6 max-w-2xl text-lg leading-[1.8]"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

export default SectionHeading;
