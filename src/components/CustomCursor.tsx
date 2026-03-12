import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [hidden, setHidden] = useState(false);
  const trailRef = useRef({ x: -100, y: -100 });
  const [trailPos, setTrailPos] = useState({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Hide on touch devices
    const isTouchDevice = "ontouchstart" in window;
    if (isTouchDevice) {
      setHidden(true);
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    const onMouseDown = () => setClicking(true);
    const onMouseUp = () => setClicking(false);
    const onMouseLeave = () => setHidden(true);
    const onMouseEnter = () => setHidden(false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    document.documentElement.addEventListener("mouseenter", onMouseEnter);

    // Detect hoverable elements
    const checkHover = () => {
      const el = document.elementFromPoint(pos.x, pos.y);
      if (el) {
        const isHoverable =
          el.closest("a, button, [data-cursor-hover], input, textarea, [role='button']") !== null;
        setHovering(isHoverable);
      }
    };

    const hoverInterval = setInterval(checkHover, 50);

    // Smooth trail
    const animateTrail = () => {
      trailRef.current.x += (pos.x - trailRef.current.x) * 0.15;
      trailRef.current.y += (pos.y - trailRef.current.y) * 0.15;
      setTrailPos({ x: trailRef.current.x, y: trailRef.current.y });
      rafRef.current = requestAnimationFrame(animateTrail);
    };
    rafRef.current = requestAnimationFrame(animateTrail);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      document.documentElement.removeEventListener("mouseenter", onMouseEnter);
      clearInterval(hoverInterval);
      cancelAnimationFrame(rafRef.current);
    };
  }, [pos.x, pos.y]);

  if (hidden) return null;

  return (
    <>
      {/* Main dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: pos.x - (hovering ? 10 : 4),
          y: pos.y - (hovering ? 10 : 4),
          width: clicking ? 6 : hovering ? 20 : 8,
          height: clicking ? 6 : hovering ? 20 : 8,
          opacity: 1,
        }}
        transition={{ type: "spring", stiffness: 800, damping: 35, mass: 0.3 }}
        style={{
          borderRadius: "50%",
          backgroundColor: hovering ? "rgba(129, 140, 248, 0.9)" : "#e2e8f0",
        }}
      />

      {/* Trail ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        animate={{
          x: trailPos.x - (hovering ? 24 : 18),
          y: trailPos.y - (hovering ? 24 : 18),
          width: clicking ? 28 : hovering ? 48 : 36,
          height: clicking ? 28 : hovering ? 48 : 36,
          opacity: hovering ? 0.6 : 0.3,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20, mass: 0.5 }}
        style={{
          borderRadius: "50%",
          border: `1.5px solid ${hovering ? "rgba(99, 102, 241, 0.8)" : "rgba(226, 232, 240, 0.3)"}`,
          backgroundColor: hovering
            ? "rgba(99, 102, 241, 0.05)"
            : "transparent",
        }}
      />
    </>
  );
}

export default CustomCursor;
