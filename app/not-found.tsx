"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DinoGame from "@/components/DinoGame";

export default function NotFound() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 5000;
    const start = performance.now();
    let frameId: number;

    function tick(now: number) {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = t * t * t; // cubic ease-in
      setCount(Math.round(eased * 404));
      if (t < 1) {
        frameId = requestAnimationFrame(tick);
      }
    }

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div className="not-found-page">
      <div className="not-found-game">
        <DinoGame />
      </div>
      <h1 className="not-found-code">{count}</h1>
      <p className="not-found-message">Page not found</p>
      <Link href="/" className="not-found-link">
        Back to Homepage
      </Link>
    </div>
  );
}
