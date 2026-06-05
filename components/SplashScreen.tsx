"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type SplashScreenProps = {
  onExitStart: () => void;
  onComplete: () => void;
};

const LOGO_PATH =
  "M0 113.913L65.5253 89.7193L0 65.5253L23.1859 24.194L77.1183 69.0536L65.5253 0H112.905L101.312 68.5496L154.741 24.194L178.431 65.0213L112.905 89.2153L178.431 113.409L155.245 154.741L101.312 109.881L112.905 178.935H65.5253L77.1183 110.385L23.6899 154.741L0 113.913Z";

const powEase = [0.18, 0.9, 0.22, 1] as const;
const wipeEase = [0.16, 1, 0.3, 1] as const;
const scaleInDuration = 0.28;
const loadingDuration = 3;
const introDuration = scaleInDuration + loadingDuration;
const logoRotationDuration = 2.4;
const wipeDuration = 1.25;
const yellowWipeDelay = 0.18;
const reducedDuration = 0.7;

export default function SplashScreen({ onExitStart, onComplete }: SplashScreenProps) {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const [isWiping, setIsWiping] = useState(false);
  const activeWipeDuration = prefersReducedMotion ? reducedDuration : wipeDuration;
  const activeYellowDelay = prefersReducedMotion ? 0 : yellowWipeDelay;
  const wipeTarget = isMobile ? { y: "-100%" } : { x: "-100%" };
  const wipeRest = isMobile ? { y: 0 } : { x: 0 };

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      onExitStart();
      const reducedTimer = window.setTimeout(onComplete, reducedDuration * 1000 + 120);

      return () => window.clearTimeout(reducedTimer);
    }

    const wipeTimer = window.setTimeout(() => {
      setIsWiping(true);
      onExitStart();
    }, introDuration * 1000);

    const completeTimer = window.setTimeout(
      onComplete,
      (introDuration + wipeDuration + yellowWipeDelay) * 1000 + 120
    );

    return () => {
      window.clearTimeout(wipeTimer);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete, onExitStart, prefersReducedMotion]);

  return (
    <div className="splash-screen splash-screen--wipe" aria-label="Portfolio introduction">
      <motion.div
        className="splash-wipe-panel splash-wipe-panel--yellow"
        aria-hidden="true"
        initial={wipeRest}
        animate={isWiping || prefersReducedMotion ? wipeTarget : wipeRest}
        transition={{
          delay: activeYellowDelay,
          duration: activeWipeDuration,
          ease: wipeEase
        }}
      />
      <motion.div
        className="splash-wipe-panel splash-wipe-panel--white"
        aria-hidden="true"
        initial={wipeRest}
        animate={isWiping || prefersReducedMotion ? wipeTarget : wipeRest}
        transition={{
          duration: activeWipeDuration,
          ease: wipeEase
        }}
      />

      <motion.svg
        className="splash-loader-logo"
        viewBox="0 0 178.431 178.935"
        aria-hidden="true"
        focusable="false"
        initial={prefersReducedMotion ? { opacity: 0, scale: 1 } : { opacity: 1, scale: 0.1 }}
        animate={
          isWiping || prefersReducedMotion
            ? {
                opacity: 0,
                scale: 1,
                transition: { duration: 0.08 }
              }
            : {
                opacity: 1,
                scale: [0.1, 1, 1.38, 1, 1.3, 1, 1.22, 1],
                transition: {
                  rotate: {
                    duration: logoRotationDuration,
                    ease: "easeInOut",
                    repeat: Infinity
                  },
                  scale: {
                    duration: introDuration,
                    ease: [wipeEase, powEase, powEase, powEase, powEase, powEase, powEase],
                    times: [0, scaleInDuration / introDuration, 0.25, 0.4, 0.55, 0.7, 0.85, 1]
                  }
                },
                rotate: [-5, 5, -5]
              }
        }
      >
        <path d={LOGO_PATH} fill="#fdcc00" />
      </motion.svg>
    </div>
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
