import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "./SectionHeading";
import ProjectModal from "./ProjectModal";
import { projects, studyLevels, allTechs } from "../data/projects";
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

/* ── Alternating project row ── */
function ProjectRow({
  project,
  index,
  onClick,
}: {
  project: Project;
  index: number;
  onClick: () => void;
}) {
  const isReversed = index % 2 === 1;
  const thumbnail = project.imageUrl?.[0];
  const hasImages = (project.imageUrl?.length ?? 0) > 0;
  const xHidden = isReversed ? 120 : -120;

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, x: xHidden, y: 24 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -10% 0px" }}
      exit={{ opacity: 0, y: 16, transition: { duration: 0.18 } }}
      transition={{
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ willChange: "transform, opacity" }}
      className="group"
    >
      <div
        onClick={onClick}
        data-cursor-hover
        className={`relative grid md:grid-cols-12 gap-0 rounded-2xl overflow-hidden bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] cursor-pointer transition-all duration-500 hover:border-accent/30 hover:shadow-2xl hover:shadow-accent/10 ${
          isReversed ? "md:direction-rtl" : ""
        }`}
      >
        {/* ── Image side ── */}
        <div className={`relative md:col-span-5 h-64 md:h-auto min-h-[280px] overflow-hidden ${
          isReversed ? "md:order-2" : "md:order-1"
        }`}>
          {thumbnail ? (
            <>
              <img
                src={thumbnail}
                alt={project.title}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
              />
              {/* Overlay gradient toward text side */}
              <div className={`absolute inset-0 ${
                isReversed
                  ? "bg-gradient-to-l from-surface/90 via-surface/40 to-transparent"
                  : "bg-gradient-to-r from-surface/90 via-surface/40 to-transparent"
              } md:block hidden`} />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent md:hidden" />

              {/* Image count badge */}
              {hasImages && (project.imageUrl?.length ?? 0) > 1 && (
                <div className="absolute top-3 left-3 bg-deep-900/70 backdrop-blur-sm px-2.5 py-1 rounded-full font-mono text-[10px] text-text-secondary flex items-center gap-1.5 z-10">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {project.imageUrl?.length}
                </div>
              )}

              {/* Decorative corner accent */}
              <div className={`absolute bottom-0 ${
                isReversed ? "right-0" : "left-0"
              } w-16 h-16 pointer-events-none`}>
                <div className={`absolute bottom-0 ${
                  isReversed ? "right-0" : "left-0"
                } w-px h-8 bg-gradient-to-t from-accent/40 to-transparent`} />
                <div className={`absolute bottom-0 ${
                  isReversed ? "right-0" : "left-0"
                } h-px w-8 bg-gradient-to-r ${
                  isReversed ? "from-accent/40 to-transparent" : "from-transparent to-accent/40"
                }`} />
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-accent/10 via-deep-700 to-deep-800 flex items-center justify-center">
              <span className="font-mono text-accent/20 text-5xl">{"{ }"}</span>
            </div>
          )}
        </div>

        {/* ── Text side ── */}
        <div className={`md:col-span-7 p-6 md:p-8 lg:p-10 flex flex-col justify-center space-y-4 ${
          isReversed ? "md:order-1 md:text-right direction-ltr" : "md:order-2 direction-ltr"
        }`}>
          {/* Index number + study level */}
          <div className={`flex items-center gap-3 ${
            isReversed ? "md:justify-end" : ""
          }`}>
            <span className="font-mono text-accent/30 text-sm">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="w-6 h-px bg-accent/30" />
            <span className="font-mono text-[11px] text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full">
              {project.studyLevel}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl md:text-2xl font-bold text-text-primary group-hover:text-accent-light transition-colors duration-300 leading-snug">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-text-secondary text-sm md:text-base leading-relaxed line-clamp-4">
            {renderBold(project.description)}
          </p>

          {/* Tech stack */}
          <div className={`flex flex-wrap gap-2 pt-1 ${
            isReversed ? "md:justify-end" : ""
          }`}>
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="text-[11px] font-mono text-text-muted bg-deep-700/80 border border-white/[0.04] px-2.5 py-1 rounded-md group-hover:border-accent/20 transition-colors duration-300"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action row */}
          <div className={`flex items-center gap-4 pt-4 border-t border-border/20 ${
            isReversed ? "md:justify-end" : ""
          }`}>
            <span className="text-xs text-text-muted group-hover:text-accent transition-colors duration-300 flex items-center gap-2">
              Voir le détail
              <svg
                className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-text-muted hover:text-accent transition-colors duration-300"
                data-cursor-hover
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Hover glow overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      </div>
    </motion.div>
  );
}

/* ── Animated filter button ── */
function FilterButton({
  active,
  onClick,
  children,
  mono = false,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      data-cursor-hover
      layout
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`px-4 py-1.5 text-xs rounded-full border transition-colors duration-300 ${
        mono ? "font-mono" : ""
      } ${
        active
          ? "bg-accent/20 text-accent border-accent/40 shadow-sm shadow-accent/10"
          : "bg-transparent text-text-secondary border-border/50 hover:text-text-primary hover:border-border"
      }`}
    >
      {children}
    </motion.button>
  );
}

function Projects() {
  const [activeLevel, setActiveLevel] = useState<string | null>(null);
  const [activeTech, setActiveTech] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filtered = projects.filter((p) => {
    if (activeLevel && p.studyLevel !== activeLevel) return false;
    if (activeTech && !p.techStack.includes(activeTech)) return false;
    return true;
  });

  return (
    <>
      <section id="projects" className="py-24 md:py-32 px-6 relative">
        {/* Subtle bg pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,var(--color-accent)/3%,transparent_50%)] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative">
          <SectionHeading
            tag="// Projets"
            title="Réalisations"
            subtitle="Une sélection de projets académiques et personnels reflétant mon parcours d'apprentissage."
          />

          {/* Filters */}
          <div className="mb-14 space-y-4">
            {/* Level filter */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-text-muted text-xs font-mono mr-2 shrink-0 tracking-wider">
                Année :
              </span>
              <FilterButton active={!activeLevel} onClick={() => setActiveLevel(null)}>
                Tous
              </FilterButton>
              {studyLevels.map((level) => (
                <FilterButton
                  key={level}
                  active={activeLevel === level}
                  onClick={() => setActiveLevel(activeLevel === level ? null : level)}
                >
                  {level}
                </FilterButton>
              ))}
            </div>

            {/* Tech filter */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-text-muted text-xs font-mono mr-2 shrink-0 tracking-wider">
                Tech :
              </span>
              <FilterButton active={!activeTech} onClick={() => setActiveTech(null)}>
                Tous
              </FilterButton>
              {allTechs.map((tech) => (
                <FilterButton
                  key={tech}
                  active={activeTech === tech}
                  onClick={() => setActiveTech(activeTech === tech ? null : tech)}
                  mono
                >
                  {tech}
                </FilterButton>
              ))}
            </div>
          </div>

          {/* Projects — alternating rows */}
          <div className="space-y-8">
            <AnimatePresence mode="sync">
              {filtered.map((project, i) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  index={i}
                  onClick={() => setSelectedProject(project)}
                />
              ))}
            </AnimatePresence>
          </div>

          {filtered.length === 0 && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-text-muted text-center py-20 font-mono text-sm"
            >
              Aucun projet ne correspond à ces filtres.
            </motion.p>
          )}
        </div>
      </section>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default Projects;
