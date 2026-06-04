"use client";

import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { type CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { testimonials } from "@/data/portfolio";

type TestimonialSectionProps = {
  onOpenProject: (projectId: string) => void;
};

export default function TestimonialSection({ onOpenProject }: TestimonialSectionProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = useCallback((index: number) => {
    const rail = railRef.current;
    if (!rail) return;

    const nextIndex = Math.min(Math.max(index, 0), testimonials.length - 1);
    const card = rail.children.item(nextIndex) as HTMLElement | null;

    if (card) {
      rail.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
    }

    setActiveIndex(nextIndex);
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    let frame = 0;

    const updateActiveIndex = () => {
      frame = 0;
      const cards = Array.from(rail.children) as HTMLElement[];
      const railLeft = rail.scrollLeft;
      const nextIndex = cards.reduce((closest, card, index) => {
        const closestDistance = Math.abs(cards[closest].offsetLeft - railLeft);
        const cardDistance = Math.abs(card.offsetLeft - railLeft);
        return cardDistance < closestDistance ? index : closest;
      }, 0);

      setActiveIndex(nextIndex);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(updateActiveIndex);
    };

    rail.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      rail.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section
      className="testimonials-section"
      aria-labelledby="testimonials-title"
      data-section
    >
      <div className="testimonials-header">
        <h2 id="testimonials-title">Trusted by a diverse set of clientelle</h2>
        <p>What clients I have worked with in the past have to say</p>
      </div>

      <div className="testimonials-rail" ref={railRef} tabIndex={0}>
        {testimonials.map((testimonial) => (
          <article className="testimonial-card" key={testimonial.id}>
            <div className="testimonial-card__content">
              <header className="testimonial-card__person">
                <h3>{testimonial.author}</h3>
                <p>{testimonial.role}</p>
              </header>
              <blockquote>
                <p>&quot;{testimonial.quote}&quot;</p>
              </blockquote>
            </div>
            {testimonial.caseStudyId ? (
              <button
                className="testimonial-story-button"
                type="button"
                onClick={() => onOpenProject(testimonial.caseStudyId!)}
              >
                Read the full story
              </button>
            ) : (
              <button
                className="testimonial-story-button testimonial-story-button--disabled"
                type="button"
                disabled
              >
                Full story coming soon
              </button>
            )}
          </article>
        ))}
      </div>

      <div className="testimonial-controls" aria-label="Testimonials carousel controls">
        <button
          type="button"
          aria-label="Previous testimonial"
          onClick={() => goTo(activeIndex - 1)}
          disabled={activeIndex === 0}
        >
          <CaretLeft aria-hidden="true" size={24} />
        </button>
        <div
          className="testimonial-progress"
          role="progressbar"
          aria-label="Testimonials progress"
          aria-valuemin={1}
          aria-valuemax={testimonials.length}
          aria-valuenow={activeIndex + 1}
          aria-valuetext={`${activeIndex + 1} of ${testimonials.length}`}
          style={
            {
              "--testimonial-progress": (activeIndex + 1) / testimonials.length
            } as CSSProperties
          }
        >
          <span />
        </div>
        <button
          type="button"
          aria-label="Next testimonial"
          onClick={() => goTo(activeIndex + 1)}
          disabled={activeIndex === testimonials.length - 1}
        >
          <CaretRight aria-hidden="true" size={24} />
        </button>
      </div>
    </section>
  );
}
