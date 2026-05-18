"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowsOutSimple } from "@phosphor-icons/react/dist/ssr";
import type { ProjectCard as ProjectCardType } from "@/data/portfolio";

type ProjectCardProps = {
  project: ProjectCardType;
  onOpenProject: (projectId: string) => void;
};

export default function ProjectCard({ project, onOpenProject }: ProjectCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const showDetails = project.variant === "phone" || project.variant === "gallery";

  return (
    <motion.article
      className={`project-card project-card--${project.variant}`}
      data-project-id={project.id}
      whileHover={prefersReducedMotion ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
    >
      <div className="project-copy">
        <h2>{project.title}</h2>
        {showDetails && project.company && project.role ? (
          <p className="project-meta">
            {project.company}
            <span aria-hidden="true"> - </span>
            {project.role}
          </p>
        ) : null}
        {showDetails && project.summary ? <p className="project-summary">{project.summary}</p> : null}
      </div>

      {project.previewable ? (
        <button
          className="expand-button"
          type="button"
          aria-label={`Open ${project.title} case study`}
          onClick={() => onOpenProject(project.id)}
        >
          <ArrowsOutSimple aria-hidden="true" size={24} />
        </button>
      ) : null}

      {project.variant === "hero" ? (
        <div className="hero-media" aria-hidden="true">
          <img className="hero-phone" src={project.assets.phone} alt="" />
          <img className="hero-desktop" src={project.assets.desktop} alt="" />
        </div>
      ) : null}

      {project.variant === "phone" ? (
        <>
          <img className="wave-bg" src={project.assets.background} alt="" aria-hidden="true" />
          <img className="phone-mock" src={project.assets.phone} alt="" />
        </>
      ) : null}

      {project.variant === "gallery" ? (
        <div className="gallery-cluster" aria-label="Selected brand work">
          {project.assets.gallery?.map((src, index) => (
            <img key={src} className={`gallery-image gallery-image--${index + 1}`} src={src} alt="" />
          ))}
        </div>
      ) : null}

      {project.variant === "marketplace" ? (
        <div className="marketplace-card" aria-hidden="true">
          <div className="marketplace-map">
            <span>Prospective customers</span>
            <span>Hardware selling partners</span>
            <strong>The marketplace</strong>
            <span>Installed systems</span>
            <span>Installers with existing leads</span>
          </div>
          <img src={project.assets.dashboard} alt="" />
        </div>
      ) : null}
    </motion.article>
  );
}
