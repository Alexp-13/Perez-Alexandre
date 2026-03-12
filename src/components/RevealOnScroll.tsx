import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * RevealOnScroll — Wraps children in a GSAP-powered reveal animation
 * triggered by scrolling. Supports various directions and effects.
 */
interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  distance?: number;
  blur?: boolean;
  scale?: boolean;
  stagger?: number;
}

function RevealOnScroll({
  children,
  className = "",
  direction = "up",
  delay = 0,
  duration = 1,
  distance = 80,
  blur = true,
  scale = false,
  stagger = 0,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const dirProps = {
      up: { y: distance },
      down: { y: -distance },
      left: { x: distance },
      right: { x: -distance },
    };

    const targets = stagger ? el.children : el;

    gsap.set(targets, {
      opacity: 0,
      ...dirProps[direction],
      ...(blur ? { filter: "blur(8px)" } : {}),
      ...(scale ? { scale: 0.9 } : {}),
    });

    gsap.to(targets, {
      opacity: 1,
      x: 0,
      y: 0,
      filter: "blur(0px)",
      scale: 1,
      duration,
      delay,
      stagger: stagger || 0,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [direction, delay, duration, distance, blur, scale, stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export default RevealOnScroll;
