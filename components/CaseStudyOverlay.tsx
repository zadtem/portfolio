"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowsInSimple,
  MagnifyingGlass,
  Star,
  WarningCircle
} from "@phosphor-icons/react/dist/ssr";
import ContactCTA from "@/components/ContactCTA";
import type { CaseStudy } from "@/data/portfolio";

type CaseStudyOverlayProps = {
  caseStudy: CaseStudy | null;
  onClose: () => void;
};

const focusableSelector =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export default function CaseStudyOverlay({ caseStudy, onClose }: CaseStudyOverlayProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!caseStudy) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) {
        return;
      }

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(focusableSelector)
      ).filter((element) => !element.hasAttribute("disabled"));

      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [caseStudy, onClose]);

  return (
    <AnimatePresence>
      {caseStudy ? (
        <motion.div
          className="case-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-study-title"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            className="case-panel"
            ref={panelRef}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 28, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: 18, scale: 0.99 }}
            transition={{ type: "spring", stiffness: 180, damping: 24 }}
          >
            <button
              className="close-button"
              type="button"
              aria-label="Close case study"
              onClick={onClose}
              ref={closeButtonRef}
            >
              <ArrowsInSimple aria-hidden="true" size={48} />
            </button>

            <article className="case-study">
              <section className="case-intro" aria-labelledby="case-study-title">
                <div className="case-intro-copy">
                  <p className="project-meta">
                    {caseStudy.company}
                    <span aria-hidden="true"> - </span>
                    {caseStudy.role}
                  </p>
                  <h2 id="case-study-title">{caseStudy.title}</h2>
                  <p className="case-subtitle">{caseStudy.subtitle}</p>
                  <p className="case-intro-body">{caseStudy.intro}</p>
                </div>
                <img className="case-hero-phone" src={caseStudy.heroImage} alt="" />
              </section>

              <section className="case-steps" aria-label="Case study steps">
                {caseStudy.steps.map((step) => (
                  <article key={step.title} className="case-step">
                    <StepIcon title={step.title} />
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </article>
                ))}
              </section>

              {caseStudy.audienceSections.map((section) => (
                <section key={section.title} className="audience-section">
                  <div className="audience-copy">
                    <h3>{section.title}</h3>
                    <div className="audience-points">
                      {section.points.map((point) => (
                        <p key={point}>{point}</p>
                      ))}
                    </div>
                    <a href="#" onClick={(event) => event.preventDefault()}>
                      {section.linkLabel}
                    </a>
                  </div>
                  <div className="audience-media" aria-label={`${section.title} visuals`}>
                    {section.media.map((src) => (
                      <img key={src} src={src} alt="" />
                    ))}
                  </div>
                </section>
              ))}

              <section className="case-footer">
                <ContactCTA compact />
                <blockquote>
                  <p>&quot;{caseStudy.testimonial.quote}&quot;</p>
                  <footer>
                    <strong>{caseStudy.testimonial.author}</strong>
                    <span>{caseStudy.testimonial.role}</span>
                  </footer>
                </blockquote>
              </section>
            </article>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function StepIcon({ title }: { title: string }) {
  const props = { "aria-hidden": true, size: 24, weight: "regular" as const };

  if (title.includes("Research")) {
    return <MagnifyingGlass {...props} />;
  }

  if (title.includes("Solution")) {
    return <Star {...props} />;
  }

  return <WarningCircle {...props} />;
}
