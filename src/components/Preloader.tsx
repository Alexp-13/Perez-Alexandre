import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "reveal">("loading");

  useEffect(() => {
    const duration = 2000;
    const start = Date.now();

    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / duration, 1);
      // Ease out cubic for smooth feel
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(Math.round(eased * 100));

      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(() => setPhase("reveal"), 300);
        setTimeout(() => onComplete(), 1200);
      }
    };

    requestAnimationFrame(tick);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "reveal" ? null : null}
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-deep-900"
      >
        {/* Animated background grid */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
              animation: "gridMove 20s linear infinite",
            }}
          />
        </div>

        {/* Center content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative flex flex-col items-center"
        >
          {/* Animated logo */}
          <motion.div className="relative mb-12">
            <motion.span
              className="text-6xl md:text-8xl font-black text-transparent preloader-logo"
              style={{
                WebkitTextStroke: "2px rgba(99, 102, 241, 0.6)",
              }}
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              AP
            </motion.span>

            {/* Orbiting dots */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-accent rounded-full"
                style={{
                  top: "50%",
                  left: "50%",
                }}
                animate={{
                  x: [
                    Math.cos((i * Math.PI * 2) / 3) * 60,
                    Math.cos((i * Math.PI * 2) / 3 + Math.PI * 2) * 60,
                  ],
                  y: [
                    Math.sin((i * Math.PI * 2) / 3) * 60,
                    Math.sin((i * Math.PI * 2) / 3 + Math.PI * 2) * 60,
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.15,
                }}
              />
            ))}
          </motion.div>

          {/* Progress bar */}
          <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-accent via-accent-light to-purple-400 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Percentage */}
          <motion.span className="mt-4 font-mono text-xs text-text-muted tracking-[0.3em]">
            {progress}%
          </motion.span>
        </motion.div>

        {/* Reveal curtains */}
        {phase === "reveal" && (
          <>
            <motion.div
              initial={{ scaleY: 1 }}
              animate={{ scaleY: 0 }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className="absolute top-0 left-0 right-0 h-1/2 bg-deep-900 origin-top z-10"
            />
            <motion.div
              initial={{ scaleY: 1 }}
              animate={{ scaleY: 0 }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className="absolute bottom-0 left-0 right-0 h-1/2 bg-deep-900 origin-bottom z-10"
            />
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default Preloader;
