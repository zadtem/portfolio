"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { tidbits } from "@/data/portfolio";

export default function TidbitsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    let frame = 0;

    const updateActiveCard = () => {
      frame = 0;

      if (!window.matchMedia("(max-width: 767px)").matches || !sectionRef.current) {
        return;
      }

      const cards = Array.from(
        sectionRef.current.querySelectorAll<HTMLElement>("[data-tidbit-card]")
      );
      const viewportCenter = window.innerHeight / 2;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const distance = Math.abs(cardCenter - viewportCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    };

    const requestUpdate = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(updateActiveCard);
    };

    updateActiveCard();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  return (
    <section className="tidbits-section" id="tidbits" ref={sectionRef} aria-labelledby="tidbits-title">
      <div className="section-heading">
        <h2 id="tidbits-title">Tidbits</h2>
        <p>Some things I like, and some things I made!</p>
      </div>

      <div className="tidbits-grid">
        {tidbits.map((tidbit, index) => {
          const isActive = activeIndex === index;

          return (
            <motion.article
              layout={!prefersReducedMotion}
              key={tidbit.title}
              className={`tidbit-card tidbit-card--${tidbit.tone} ${isActive ? "is-active" : ""}`}
              data-tidbit-card
              data-active={isActive}
              transition={{ type: "spring", stiffness: 210, damping: 28 }}
              tabIndex={0}
            >
              <div className="tidbit-compact">
                <span>{tidbit.eyebrow}</span>
                <h3>{tidbit.title}</h3>
              </div>
              <AnimatePresence initial={false}>
                <motion.div
                  key="details"
                  className="tidbit-details"
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  {tidbit.image ? <img src={tidbit.image} alt="" /> : null}
                  <p>{tidbit.body}</p>
                </motion.div>
              </AnimatePresence>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
