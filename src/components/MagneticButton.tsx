import { useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

/**
 * MagneticButton — Button/link wrapper that magnetically attracts toward the cursor.
 * Creates an interactive, playful feel.
 */
function MagneticButton({
  children,
  className = "",
  strength = 0.35,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(0);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      posRef.current = { x: dx * strength, y: dy * strength };
    },
    [strength]
  );

  const handleMouseLeave = useCallback(() => {
    posRef.current = { x: 0, y: 0 };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    let currentX = 0;
    let currentY = 0;

    const animate = () => {
      currentX += (posRef.current.x - currentX) * 0.15;
      currentY += (posRef.current.y - currentY) * 0.15;
      el.style.transform = `translate(${currentX}px, ${currentY}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.div>
  );
}

export default MagneticButton;
