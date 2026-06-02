"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import ContactCTA from "@/components/ContactCTA";
import { homeTestimonials } from "@/data/portfolio";

type HomeContactCTAProps = {
  onOpenProject: (projectId: string) => void;
};

export default function HomeContactCTA({ onOpenProject }: HomeContactCTAProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const activeTestimonial = homeTestimonials[activeIndex];

  useEffect(() => {
    if (isPaused || homeTestimonials.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % homeTestimonials.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [isPaused]);

  return (
    <section
      className="case-footer home-case-footer"
      id="contact"
      aria-label="Contact and testimonials"
      data-section
    >
      <ContactCTA compact titleId="home-contact-title" />
      <div className="home-testimonial-panel">
        <AnimatePresence mode="wait" initial={false}>
          <motion.blockquote
            key={activeTestimonial.id}
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
          >
            <p>&quot;{activeTestimonial.quote}&quot;</p>
            <footer>
              <strong>{activeTestimonial.author}</strong>
              <span>{activeTestimonial.role}</span>
            </footer>
          </motion.blockquote>
        </AnimatePresence>
        <div className="home-testimonial-actions">
          <button type="button" onClick={() => setIsPaused((paused) => !paused)}>
            {isPaused ? "resume" : "pause"}
          </button>
          <button
            type="button"
            disabled={!activeTestimonial.caseStudyId}
            onClick={() => {
              if (activeTestimonial.caseStudyId) {
                onOpenProject(activeTestimonial.caseStudyId);
              }
            }}
          >
            {activeTestimonial.caseStudyId ? "read the case study" : "coming soon"}
          </button>
        </div>
      </div>
    </section>
  );
}
