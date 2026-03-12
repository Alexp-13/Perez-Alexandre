import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "../data/projects";

function renderBold(text: string): React.ReactNode {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="text-text-primary font-semibold">
        {part}
      </strong>
    ) : (
      part
    )
  );
}

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [activeImg, setActiveImg] = useState(0);
  const images = project.imageUrl ?? [];
  const scrollRef = useRef<HTMLDivElement>(null);

  // Lock background scroll + pause Lenis while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.dispatchEvent(new CustomEvent("modal:open"));
    return () => {
      document.body.style.overflow = prev;
      window.dispatchEvent(new CustomEvent("modal:close"));
    };
  }, []);

  // Prevent wheel events from bubbling up to Lenis
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => e.stopPropagation();
    el.addEventListener("wheel", handler, { passive: true });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-deep-900/90 backdrop-blur-xl" />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        ref={scrollRef}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-5xl max-h-[90vh] overflow-y-auto overscroll-contain bg-surface border border-border/60 rounded-2xl shadow-2xl shadow-black/50"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-deep-700/80 backdrop-blur-sm border border-border hover:border-accent/50 text-text-muted hover:text-text-primary transition-all duration-200"
          data-cursor-hover
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Hero image */}
        {images.length > 0 && (
          <div className="relative w-full aspect-video overflow-hidden rounded-t-2xl bg-deep-800">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImg}
                src={images[activeImg]}
                alt={`${project.title} — Image ${activeImg + 1}`}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Image counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-deep-900/70 backdrop-blur-sm px-3 py-1 rounded-full font-mono text-xs text-text-secondary">
                {activeImg + 1} / {images.length}
              </div>
            )}

            {/* Nav arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveImg(
                      (activeImg - 1 + images.length) % images.length
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-deep-900/60 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white hover:bg-deep-900/80 transition-all"
                  data-cursor-hover
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() =>
                    setActiveImg((activeImg + 1) % images.length)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-deep-900/60 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white hover:bg-deep-900/80 transition-all"
                  data-cursor-hover
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>
        )}

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="flex gap-2 px-6 pt-4 overflow-x-auto pb-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  i === activeImg
                    ? "border-accent shadow-lg shadow-accent/20"
                    : "border-border/50 opacity-50 hover:opacity-80"
                }`}
                data-cursor-hover
              >
                <img
                  src={img}
                  alt={`Thumb ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Header */}
          <div>
            <span className="inline-block font-mono text-xs text-accent bg-accent/10 px-3 py-1.5 rounded-full mb-4">
              {project.studyLevel}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
              {project.title}
            </h2>
          </div>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="text-xs font-mono text-accent border border-accent/30 bg-accent/5 px-3 py-1.5 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Description */}
          <div className="prose prose-invert max-w-none">
            <p className="text-text-secondary leading-relaxed text-[15px] whitespace-pre-line">
              {renderBold(project.description)}
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border/50">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-deep-700 hover:bg-accent/20 border border-border hover:border-accent/50 rounded-lg text-sm text-text-secondary hover:text-accent transition-all duration-300"
                data-cursor-hover
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                Voir sur GitHub
              </a>
            )}
            {project.otherUrl?.map((url, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-deep-700 hover:bg-accent/20 border border-border hover:border-accent/50 rounded-lg text-sm text-text-secondary hover:text-accent transition-all duration-300"
                data-cursor-hover
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Rapport / Document
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ProjectModal;
