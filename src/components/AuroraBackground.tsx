import { useEffect, useRef } from "react";

/**
 * AuroraBackground — Beautiful animated aurora borealis gradient effect.
 * Uses CSS blur + gradient animation for a mesmerizing background.
 */
function AuroraBackground({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 0.5; // Lower res for performance
      canvas.height = canvas.offsetHeight * 0.5;
    };

    resize();
    window.addEventListener("resize", resize);

    const blobs = [
      { x: 0.3, y: 0.4, r: 0.35, color: [99, 102, 241], speed: 0.0008, phase: 0 },
      { x: 0.7, y: 0.3, r: 0.3, color: [139, 92, 246], speed: 0.0012, phase: 2 },
      { x: 0.5, y: 0.6, r: 0.4, color: [59, 130, 246], speed: 0.0006, phase: 4 },
      { x: 0.2, y: 0.7, r: 0.25, color: [168, 85, 247], speed: 0.001, phase: 1 },
    ];

    const draw = () => {
      time += 1;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      for (const blob of blobs) {
        const x = w * (blob.x + Math.sin(time * blob.speed + blob.phase) * 0.15);
        const y = h * (blob.y + Math.cos(time * blob.speed * 0.7 + blob.phase) * 0.1);
        const r = Math.min(w, h) * blob.r;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
        gradient.addColorStop(0, `rgba(${blob.color.join(",")}, 0.15)`);
        gradient.addColorStop(0.5, `rgba(${blob.color.join(",")}, 0.05)`);
        gradient.addColorStop(1, `rgba(${blob.color.join(",")}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ filter: "blur(60px)", opacity: 0.7 }}
    />
  );
}

export default AuroraBackground;
