"use client";

import type { CSSProperties, FocusEvent, KeyboardEvent, PointerEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowsOutSimple } from "@phosphor-icons/react/dist/ssr";
import type { MarketplaceSequenceItem, ProjectCard as ProjectCardType } from "@/data/portfolio";

type ProjectCardProps = {
  index: number;
  project: ProjectCardType;
  revealEnabled: boolean;
  revealMotion?: "animated" | "static";
  onOpenProject: (projectId: string) => void;
};

const cardRevealViewport = { once: true, amount: 0.05 } as const;

export default function ProjectCard({
  index,
  project,
  revealEnabled,
  revealMotion = "animated",
  onOpenProject
}: ProjectCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const [isPointerActive, setIsPointerActive] = useState(false);
  const [isFocusActive, setIsFocusActive] = useState(false);
  const [isTouchActive, setIsTouchActive] = useState(false);
  const [activeMarketplaceIndex, setActiveMarketplaceIndex] = useState(0);
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false });
  const isCaseStudy = project.status === "case-study";
  const isComingSoon = project.status === "coming-soon";
  const isActive = !isMobile && (isPointerActive || isFocusActive || isTouchActive);
  const isCardClickable = isCaseStudy && !isMobile;
  const marketplaceSequence = useMemo(
    () => project.assets.marketplaceSequence ?? [],
    [project.assets.marketplaceSequence]
  );
  const cardRevealVariants = useMemo<Variants>(
    () => ({
      hidden: revealMotion === "static"
        ? { opacity: 1, scale: 1, x: 0 }
        : prefersReducedMotion
        ? { opacity: 0 }
        : { opacity: 0, scale: 1.34, x: 320 },
      visible: (cardIndex: number) =>
        revealMotion === "static"
          ? { opacity: 1, scale: 1, transition: { duration: 0 }, x: 0 }
          : prefersReducedMotion
          ? {
              opacity: 1,
              transition: { duration: 0.16 }
            }
          : {
              opacity: 1,
              scale: 1,
              transition: {
                delay: cardIndex * 0.09,
                duration: 1.08,
                ease: [0.16, 1, 0.3, 1]
              },
              x: 0
            }
    }),
    [prefersReducedMotion, revealMotion]
  );

  useEffect(() => {
    if (!isTouchActive || isMobile) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setIsTouchActive(false);
      setActiveMarketplaceIndex(0);
    }, 2400);
    return () => window.clearTimeout(timeout);
  }, [isMobile, isTouchActive]);

  useEffect(() => {
    if (
      project.variant !== "marketplace" ||
      !isActive ||
      prefersReducedMotion ||
      marketplaceSequence.length <= 1
    ) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveMarketplaceIndex((index) => (index + 1) % marketplaceSequence.length);
    }, 1500);

    return () => window.clearInterval(interval);
  }, [isActive, marketplaceSequence.length, prefersReducedMotion, project.variant]);

  const openCaseStudy = () => {
    if (isCaseStudy) {
      onOpenProject(project.caseStudyId ?? project.id);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (isMobile) {
      return;
    }

    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();

    if (isCaseStudy) {
      openCaseStudy();
      return;
    }

    setIsTouchActive(true);
  };

  const handleFocus = () => {
    if (!isMobile) {
      setIsFocusActive(true);
    }
  };

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    if (isMobile) {
      return;
    }

    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsFocusActive(false);
      setActiveMarketplaceIndex(0);
    }
  };

  const handlePointerEnter = (event: PointerEvent<HTMLElement>) => {
    if (isMobile) {
      return;
    }

    if (event.pointerType === "mouse") {
      if (project.variant === "marketplace") {
        setIsPointerActive(true);
      }
      event.currentTarget.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "nearest",
      });
    }

    updateComingSoonCursor(event);
  };

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (isMobile) {
      return;
    }

    if (event.pointerType === "mouse" && project.variant === "marketplace") {
      setIsPointerActive(true);
    }

    updateComingSoonCursor(event);
  };

  const handlePointerLeave = () => {
    if (isMobile) {
      return;
    }

    setIsPointerActive(false);
    setActiveMarketplaceIndex(0);
    setCursor((current) => ({ ...current, visible: false }));
  };

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    if (!isMobile && event.pointerType === "touch") {
      setIsTouchActive(true);
    }
  };

  const updateComingSoonCursor = (event: PointerEvent<HTMLElement>) => {
    if (!isComingSoon || event.pointerType !== "mouse") {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    setCursor({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
      visible: true
    });
  };

  const cardStyle = {
    "--coming-soon-x": `${cursor.x}px`,
    "--coming-soon-y": `${cursor.y}px`
  } as CSSProperties;

  return (
    <motion.article
      className={[
        "project-card",
        `project-card--${project.variant}`,
        `project-card--${project.status}`,
        isActive ? "is-active" : "",
        cursor.visible ? "has-coming-soon-cursor" : ""
      ]
        .filter(Boolean)
        .join(" ")}
      data-project-id={project.id}
      data-touch-active={isTouchActive ? "true" : undefined}
      custom={index}
      initial={revealMotion === "static" ? "visible" : "hidden"}
      animate={revealEnabled || revealMotion === "static" ? "visible" : "hidden"}
      variants={cardRevealVariants}
      viewport={revealEnabled && revealMotion === "animated" ? cardRevealViewport : undefined}
      role={isCardClickable ? "button" : "group"}
      tabIndex={isMobile ? undefined : 0}
      aria-label={isCaseStudy ? `Open ${project.title} case study` : `${project.title} - coming soon`}
      onBlur={handleBlur}
      onClick={isCardClickable ? openCaseStudy : undefined}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      style={cardStyle}
      whileHover={prefersReducedMotion || isMobile ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
    >
      <div className="project-copy">
        <div className="project-heading">
          <h2>{project.title}</h2>
        </div>
        {project.company || project.role || project.summary ? (
          <div className="project-details">
            {project.company && project.role ? (
              <p className="project-meta">
                {project.company}
                <span aria-hidden="true"> · </span>
                {project.role}
              </p>
            ) : null}
            {project.summary ? <p className="project-summary">{project.summary}</p> : null}
          </div>
        ) : null}
      </div>

      {isCaseStudy || project.variant === "marketplace" ? (
        <button
          className="expand-button"
          type="button"
          aria-label={isCaseStudy ? `Open ${project.title} case study` : project.title}
          onClick={(event) => {
            event.stopPropagation();
            if (isCaseStudy) openCaseStudy();
          }}
        >
          <ArrowsOutSimple aria-hidden="true" size={24} />
        </button>
      ) : null}

      <img className="wave-bg" src="/assets/waves.svg" alt="" aria-hidden="true" />

      {project.variant === "hero" ? (
        <div className="hero-media" aria-hidden="true">
          <img className="hero-phone" src={project.assets.phone} alt="" />
          <img className="hero-desktop" src={project.assets.desktop} alt="" />
        </div>
      ) : null}

      {project.variant === "phone" ? (
        <img className="phone-mock" src={project.assets.phone} alt="" />
      ) : null}

      {project.variant === "gallery" ? (
        <div className="gallery-cluster" aria-label="Selected brand work">
          {project.assets.gallery?.map((src, index) => (
            <img key={src} className={`gallery-image gallery-image--${index + 1}`} src={src} alt="" />
          ))}
        </div>
      ) : null}

      {project.variant === "marketplace" ? (
        <MarketplaceVisual
          activeIndex={activeMarketplaceIndex}
          sequence={marketplaceSequence}
        />
      ) : null}

      {isComingSoon ? (
        <span className="coming-soon-cursor" aria-hidden="true">
          coming soon
        </span>
      ) : null}
    </motion.article>
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  return isMobile;
}

function MarketplaceVisual({
  activeIndex,
  sequence
}: {
  activeIndex: number;
  sequence: MarketplaceSequenceItem[];
}) {
  return (
    <div className="marketplace-card" aria-hidden="true">
      <div className="marketplace-chips">
        {sequence.map((item, index) => (
          <span
            key={item.label}
            className={`marketplace-chip${index === activeIndex ? " marketplace-chip--active" : ""}`}
          >
            {item.label}
          </span>
        ))}
      </div>
      <div className="marketplace-preview">
        {sequence.map((item, index) => (
          <img
            key={item.image}
            className={index === activeIndex ? "is-active" : ""}
            src={item.image}
            alt=""
          />
        ))}
      </div>
    </div>
  );
}
