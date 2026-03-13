import { useState, useEffect, useCallback, useRef } from "react";

interface TypeWriterString {
  prefix: string;
  highlight: string;
  highlightClass?: string;
}

interface TypeWriterProps {
  strings: TypeWriterString[];
  typeSpeed?: number;
  backSpeed?: number;
  pauseDuration?: number;
  className?: string;
  cursorClassName?: string;
}

function getCommonPrefixLength(a: string, b: string): number {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i;
}

function TypeWriter({
  strings,
  typeSpeed = 30,
  backSpeed = 30,
  pauseDuration = 1500,
  className = "",
  cursorClassName = "",
}: TypeWriterProps) {
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [stringIndex, setStringIndex] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const currentString = strings[stringIndex];
  const fullText = currentString.prefix + currentString.highlight;

  // Smart backspace: only delete back to where current and next strings differ
  const nextIndex = (stringIndex + 1) % strings.length;
  const nextFullText = strings[nextIndex].prefix + strings[nextIndex].highlight;
  const stopAt = getCommonPrefixLength(fullText, nextFullText);

  const tick = useCallback(() => {
    if (!isDeleting) {
      // Typing forward
      if (displayed.length < fullText.length) {
        setDisplayed(fullText.slice(0, displayed.length + 1));
        timeoutRef.current = setTimeout(tick, typeSpeed);
      } else {
        // Pause before deleting
        timeoutRef.current = setTimeout(() => {
          setIsDeleting(true);
          tick();
        }, pauseDuration);
      }
    } else {
      // Deleting — stop at common prefix with next string
      if (displayed.length > stopAt) {
        setDisplayed(fullText.slice(0, displayed.length - 1));
        timeoutRef.current = setTimeout(tick, backSpeed);
      } else {
        // Move to next string
        setIsDeleting(false);
        setStringIndex((prev) => (prev + 1) % strings.length);
      }
    }
  }, [displayed, isDeleting, fullText, stopAt, typeSpeed, backSpeed, pauseDuration, strings.length]);

  useEffect(() => {
    timeoutRef.current = setTimeout(tick, isDeleting ? backSpeed : typeSpeed);
    return () => clearTimeout(timeoutRef.current);
  }, [displayed, isDeleting, stringIndex]);

  // Split displayed text into prefix and highlight portions
  const prefixLen = currentString.prefix.length;
  const displayedPrefix = displayed.slice(0, Math.min(displayed.length, prefixLen));
  const displayedHighlight = displayed.length > prefixLen ? displayed.slice(prefixLen) : "";

  return (
    <span className={className}>
      {displayedPrefix}
      {displayedHighlight && (
        <span className={currentString.highlightClass}>{displayedHighlight}</span>
      )}
      <span
        className={`inline-block w-[2px] h-[1em] align-middle ml-0.5 animate-blink ${cursorClassName}`}
        style={{ backgroundColor: "currentColor" }}
      />
    </span>
  );
}

export default TypeWriter;
