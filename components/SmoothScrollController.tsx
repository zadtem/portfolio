"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

type SmoothScrollControllerProps = {
  disabled?: boolean;
};

export default function SmoothScrollController({
  disabled = false
}: SmoothScrollControllerProps) {
  const disabledRef = useRef(disabled);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    disabledRef.current = disabled;

    if (!lenisRef.current) {
      return;
    }

    if (disabled) {
      lenisRef.current.stop();
      return;
    }

    lenisRef.current.start();
  }, [disabled]);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const destroyLenis = () => {
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };

    const createLenis = () => {
      if (reducedMotionQuery.matches || lenisRef.current) {
        return;
      }

      lenisRef.current = new Lenis({
        anchors: {
          lerp: 0.08,
          offset: 48
        },
        autoRaf: true,
        lerp: 0.08,
        smoothWheel: true,
        stopInertiaOnNavigate: true,
        syncTouch: false,
        wheelMultiplier: 0.85
      });

      if (disabledRef.current) {
        lenisRef.current.stop();
      }
    };

    const syncLenisToMotionPreference = () => {
      if (reducedMotionQuery.matches) {
        destroyLenis();
        return;
      }

      createLenis();
    };

    syncLenisToMotionPreference();
    reducedMotionQuery.addEventListener("change", syncLenisToMotionPreference);

    return () => {
      reducedMotionQuery.removeEventListener("change", syncLenisToMotionPreference);
      destroyLenis();
    };
  }, []);

  return null;
}
