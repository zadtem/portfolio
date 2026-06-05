"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

type SplashScreenProps = {
  onExitStart: () => void;
  onComplete: () => void;
};

const splashLines = [
  "Brand Design",
  "User Experiences",
  "UI Animation",
  "Product Management",
  "Web Design"
];

const introEase = [0.7, 0, 0.84, 0] as const;
const exitEase = [0.16, 1, 0.3, 1] as const;
const logoRotationDuration = 2.4;
const textRevealGap = logoRotationDuration / 2;
const textRevealDuration = 0.9;
const exitDelayAfterTexts = 1;
const exitDuration = 1.1;
const textExitStagger = 0.2;

type SplashLineMotion = {
  direction: number;
  index: number;
};

const lineVariants: Variants = {
  hidden: ({ direction }: SplashLineMotion) => ({
    filter: "blur(14px)",
    opacity: 0,
    x: direction * 28,
    y: 0
  }),
  visible: ({ index }: SplashLineMotion) => ({
    filter: "blur(0px)",
    opacity: 1,
    transition: {
      delay: index * textRevealGap,
      duration: textRevealDuration,
      ease: introEase
    },
    x: 0,
    y: 0
  }),
  exiting: ({ index }: SplashLineMotion) => ({
    filter: "blur(4px)",
    opacity: 0,
    transition: {
      delay: 0.2 + index * textExitStagger,
      duration: exitDuration,
      ease: exitEase
    },
    x: "-120vw",
    y: 0
  })
};

export default function SplashScreenTextSequenceBackup({
  onExitStart,
  onComplete
}: SplashScreenProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const exitStartMs = prefersReducedMotion
      ? 700
      : ((splashLines.length - 1) * textRevealGap + textRevealDuration + exitDelayAfterTexts) *
        1000;
    const exitCompleteMs = prefersReducedMotion
      ? 350
      : (0.2 + (splashLines.length - 1) * textExitStagger + exitDuration) * 1000 + 120;

    const startTimer = window.setTimeout(() => {
      setIsExiting(true);
    }, exitStartMs);

    const completeTimer = window.setTimeout(() => {
      onExitStart();
      onComplete();
    }, exitStartMs + exitCompleteMs);

    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete, onExitStart, prefersReducedMotion]);

  return (
    <motion.div
      className="splash-screen"
      aria-label="Portfolio introduction"
      initial={{ opacity: 1 }}
      animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
      transition={{ delay: prefersReducedMotion ? 0 : 1.7, duration: 0.2 }}
    >
      <motion.div
        className="splash-backdrop"
        aria-hidden="true"
        animate={
          isExiting
            ? {
                transition: {
                  duration: prefersReducedMotion ? 0.18 : exitDuration,
                  ease: exitEase
                },
                x: "-100vw"
              }
            : { x: 0 }
        }
      />
      <div className="splash-content">
        <motion.img
          className="splash-logo"
          src="/assets/splash-logo.svg"
          alt=""
          aria-hidden="true"
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96 }}
          animate={
            isExiting
              ? {
                  opacity: 0,
                  rotate: -540,
                  transition: {
                    duration: prefersReducedMotion ? 0.18 : 1.2,
                    ease: exitEase
                  },
                  x: "-120vw"
                }
              : prefersReducedMotion
                ? { opacity: 1, rotate: 0, scale: 1 }
                : {
                    opacity: 1,
                    rotate: [-5, 5, -5],
                    scale: 1,
                    transition: {
                      opacity: { duration: 0.25 },
                      rotate: {
                        duration: logoRotationDuration,
                        ease: "easeInOut",
                        repeat: Infinity
                      },
                      scale: { duration: 0.25 }
                    }
                  }
          }
        />

        <div className="splash-lines" aria-hidden="true">
          {splashLines.map((line, index) => (
            <motion.p
              key={line}
              custom={{ direction: index % 2 === 0 ? 1 : -1, index }}
              variants={lineVariants}
              initial={prefersReducedMotion ? "visible" : "hidden"}
              animate={isExiting ? "exiting" : "visible"}
            >
              {line}
            </motion.p>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
