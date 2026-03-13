import { useEffect, useRef, useCallback } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  radius: number;
  pulsePhase: number;
  pulseSpeed: number;
  brightness: number;
}

function NeuralNetworkCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  const NODE_COUNT = 180;
  const CONNECTION_DIST = 160;
  const MOUSE_RADIUS = 300;
  const MOUSE_REPEL = 0.6;
  const BREATHE_RADIUS = 280;

  const initNodes = useCallback(
    (w: number, h: number) => {
      const nodes: Node[] = [];
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          baseRadius: Math.random() * 2.2 + 1.1,
          radius: 0,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.015 + 0.004,
          brightness: Math.random() * 0.3 + 0.65,
        });
      }
      nodesRef.current = nodes;
    },
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      if (nodesRef.current.length === 0) {
        initNodes(w, h);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    window.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    const draw = () => {
      timeRef.current += 0.016;
      const t = timeRef.current;
      ctx.clearRect(0, 0, w, h);

      const nodes = nodesRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // ── Update nodes ──
      for (const node of nodes) {
        const dx = node.x - mx;
        const dy = node.y - my;
        const distMouse = Math.sqrt(dx * dx + dy * dy);

        // Mouse repulsion with smooth falloff
        if (distMouse < MOUSE_RADIUS && distMouse > 1) {
          const t2 = 1 - distMouse / MOUSE_RADIUS;
          const force = t2 * t2 * MOUSE_REPEL; // quadratic falloff
          node.vx += (dx / distMouse) * force;
          node.vy += (dy / distMouse) * force;
        }

        // Gentle drift
        node.vx += (Math.random() - 0.5) * 0.015;
        node.vy += (Math.random() - 0.5) * 0.015;

        // Global subtle wave (organic feel)
        node.vx += Math.sin(t * 0.3 + node.y * 0.005) * 0.003;
        node.vy += Math.cos(t * 0.2 + node.x * 0.005) * 0.003;

        // Damping
        node.vx *= 0.985;
        node.vy *= 0.985;

        // Clamp
        const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
        if (speed > 1.2) {
          node.vx = (node.vx / speed) * 1.2;
          node.vy = (node.vy / speed) * 1.2;
        }

        node.x += node.vx;
        node.y += node.vy;

        // Wrap
        if (node.x < -30) node.x = w + 30;
        if (node.x > w + 30) node.x = -30;
        if (node.y < -30) node.y = h + 30;
        if (node.y > h + 30) node.y = -30;

        // Pulse radius
        node.pulsePhase += node.pulseSpeed;
        node.radius =
          node.baseRadius + Math.sin(node.pulsePhase) * node.baseRadius * 0.5;

        // Breathe near mouse
        if (distMouse < BREATHE_RADIUS) {
          const proximity = 1 - distMouse / BREATHE_RADIUS;
          node.radius *= 1 + proximity * proximity * 2.5;
          node.brightness = 0.6 + proximity * 0.4;
        } else {
          node.brightness += (0.5 - node.brightness) * 0.05;
        }
      }

      // ── Draw connections ──
      ctx.lineWidth = 0.9;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST);

            // Brighten near mouse
            const midX = (nodes[i].x + nodes[j].x) * 0.5;
            const midY = (nodes[i].y + nodes[j].y) * 0.5;
            const distToMouse = Math.sqrt(
              (midX - mx) ** 2 + (midY - my) ** 2
            );
            const mouseBoost =
              distToMouse < MOUSE_RADIUS
                ? 1 + ((1 - distToMouse / MOUSE_RADIUS) ** 2) * 3
                : 1;

            const finalAlpha = Math.min(alpha * 0.6 * mouseBoost, 0.9);

            // Gradient line for fancy effect
            if (finalAlpha > 0.04) {
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.strokeStyle = `rgba(199, 210, 254, ${finalAlpha})`;
              ctx.stroke();
            }
          }
        }
      }

      // ── Draw nodes ──
      for (const node of nodes) {
        const dx = node.x - mx;
        const dy = node.y - my;
        const distMouse = Math.sqrt(dx * dx + dy * dy);
        const mouseProximity =
          distMouse < MOUSE_RADIUS
            ? (1 - distMouse / MOUSE_RADIUS)
            : 0;

        // Glow halo near mouse
        if (mouseProximity > 0.2) {
          const glowRadius = node.radius * (5 + mouseProximity * 8);
          const gradient = ctx.createRadialGradient(
            node.x, node.y, 0,
            node.x, node.y, glowRadius
          );
          gradient.addColorStop(0, `rgba(129, 140, 248, ${mouseProximity * 0.45})`);
          gradient.addColorStop(0.5, `rgba(165, 180, 252, ${mouseProximity * 0.2})`);
          gradient.addColorStop(1, "rgba(99, 102, 241, 0)");
          ctx.beginPath();
          ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Node dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        const a = node.brightness + mouseProximity * 0.5;
        ctx.fillStyle = `rgba(224, 231, 255, ${Math.min(a, 1)})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [initNodes]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className ?? ""}`}
      style={{ pointerEvents: "auto" }}
    />
  );
}

export default NeuralNetworkCanvas;
