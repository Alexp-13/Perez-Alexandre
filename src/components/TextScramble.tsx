import { useEffect, useRef, useState, useCallback } from "react";

/**
 * TextScramble — A cyberpunk text reveal effect.
 * Characters cycle through random glyphs before settling on the final text.
 */
const CHARS = "!<>-_\\/[]{}—=+*^?#________ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

interface TextScrambleProps {
  text: string;
  className?: string;
  delay?: number;        // ms before starting
  speed?: number;        // ms per frame
  revealSpeed?: number;  // characters revealed per frame
  trigger?: boolean;     // start when true
}

function TextScramble({
  text,
  className = "",
  delay = 0,
  speed = 30,
  revealSpeed = 1,
  trigger = true,
}: TextScrambleProps) {
  const [display, setDisplay] = useState("");
  const frameRef = useRef(0);
  const revealedRef = useRef(0);
  const started = useRef(false);

  const scramble = useCallback(() => {
    if (!trigger) return;
    started.current = true;

    const step = () => {
      revealedRef.current = Math.min(revealedRef.current + revealSpeed, text.length);
      const revealed = revealedRef.current;

      let out = "";
      for (let i = 0; i < text.length; i++) {
        if (i < revealed) {
          out += text[i];
        } else {
          out += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      setDisplay(out);

      if (revealed < text.length) {
        frameRef.current = window.setTimeout(step, speed);
      }
    };

    // Initialize with scrambled text
    setDisplay(
      Array.from({ length: text.length })
        .map(() => CHARS[Math.floor(Math.random() * CHARS.length)])
        .join("")
    );

    frameRef.current = window.setTimeout(step, speed);
  }, [text, trigger, speed, revealSpeed]);

  useEffect(() => {
    if (!trigger || started.current) return;
    const timer = setTimeout(scramble, delay);
    return () => {
      clearTimeout(timer);
      clearTimeout(frameRef.current);
    };
  }, [trigger, delay, scramble]);

  // Reset if text changes
  useEffect(() => {
    started.current = false;
    revealedRef.current = 0;
    setDisplay("");
  }, [text]);

  return (
    <span className={`font-mono ${className}`}>
      {display || (trigger ? "" : text)}
    </span>
  );
}

export default TextScramble;
