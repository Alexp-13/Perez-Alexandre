import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface MarqueeItem {
  name: string;
  logo?: string;
}

interface InfiniteMarqueeProps {
  items: MarqueeItem[];
  speed?: number;   // seconds for one cycle
  reverse?: boolean;
  className?: string;
}

/**
 * InfiniteMarquee — An endless horizontal scroll of items with a smooth CSS animation.
 * Duplicates items to create a seamless loop.
 */
function InfiniteMarquee({
  items,
  speed = 30,
  reverse = false,
  className = "",
}: InfiniteMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // We duplicate the list 4x for seamless looping
  const repeated = [...items, ...items, ...items, ...items];

  useEffect(() => {
    // Pause on hover
    const el = containerRef.current;
    if (!el) return;
    const inner = el.querySelector(".marquee-inner") as HTMLElement;
    if (!inner) return;

    const pause = () => (inner.style.animationPlayState = "paused");
    const play = () => (inner.style.animationPlayState = "running");

    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", play);
    return () => {
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", play);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden relative ${className}`}
    >
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-deep-900 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-deep-900 to-transparent z-10 pointer-events-none" />

      <div
        className="marquee-inner flex gap-6 w-max"
        style={{
          animation: `marquee ${speed}s linear infinite ${reverse ? "reverse" : ""}`,
        }}
      >
        {repeated.map((item, i) => (
          <motion.div
            key={`${item.name}-${i}`}
            whileHover={{ scale: 1.1, y: -4 }}
            className="group flex items-center gap-3 px-5 py-3 bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-xl hover:border-accent/40 hover:bg-white/[0.06] transition-all duration-300 shrink-0"
            data-cursor-hover
          >
            {item.logo && (
              <img
                src={item.logo}
                alt={item.name}
                className="w-6 h-6 object-contain filter grayscale group-hover:grayscale-0 transition-[filter] duration-500 group-hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
            <span className="text-sm font-medium text-text-muted group-hover:text-text-primary transition-colors whitespace-nowrap">
              {item.name}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default InfiniteMarquee;
