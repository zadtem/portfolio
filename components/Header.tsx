"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

const navItems = [
  { label: "Work", href: "#work" },
  { label: "Me", href: "#me" },
  { label: "Tidbits", href: "#tidbits" },
  { label: "Contact", href: "#contact", accent: true }
];

const siteUrl = "https://tem.works/?ref=navbutton";

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

type HeaderProps = {
  revealEnabled?: boolean;
};

export default function Header({ revealEnabled = true }: HeaderProps) {
  const prefersReducedMotion = useReducedMotion();
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const [copyKey, setCopyKey] = useState(0);
  const navRevealVariants = useMemo<Variants>(
    () => ({
      hidden: prefersReducedMotion
        ? { opacity: 0 }
        : { opacity: 0, scale: 1.34, x: 320 },
      visible: (itemIndex: number) =>
        prefersReducedMotion
          ? {
              opacity: 1,
              transition: { duration: 0.16 }
            }
          : {
              opacity: 1,
              scale: 1,
              transition: {
                delay: itemIndex * 0.09,
                duration: 1.08,
                ease: [0.16, 1, 0.3, 1]
              },
              x: 0
            }
    }),
    [prefersReducedMotion]
  );

  useEffect(() => {
    if (copyState === "idle") return;

    const timeout = window.setTimeout(() => setCopyState("idle"), 1900);
    return () => window.clearTimeout(timeout);
  }, [copyState, copyKey]);

  const showCopyState = (state: "copied" | "failed") => {
    setCopyState(state);
    setCopyKey((currentKey) => currentKey + 1);
  };

  const handleCopy = async () => {
    try {
      await copyText(siteUrl);
      showCopyState("copied");
    } catch {
      showCopyState("failed");
    }
  };

  return (
    <header className="site-header" aria-label="Primary">
      <motion.button
        className={`brand brand-copy${copyState === "copied" ? " is-copied" : ""}${
          copyState === "failed" ? " is-failed" : ""
        }`}
        custom={0}
        initial="hidden"
        animate={revealEnabled ? "visible" : "hidden"}
        variants={navRevealVariants}
        type="button"
        aria-label="Copy website link: tem.works"
        onClick={handleCopy}
      >
        <span key={copyKey} className="brand-copy__label" aria-hidden="true">
          <span className="brand-copy__text">Temesgen Mamo</span>
          <span className="brand-copy__message">
            {copyState === "failed" ? "copy failed" : "link copied"}
          </span>
        </span>
      </motion.button>
      {copyState !== "idle" ? (
        <span
          key={`status-${copyKey}`}
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {copyState === "copied" ? "Link copied" : "Copy failed"}
        </span>
      ) : null}
      <nav className="nav-links" aria-label="Portfolio sections">
        {navItems.map((item, index) => (
          <motion.a
            key={item.href}
            className={item.accent ? "nav-link--accent" : undefined}
            custom={index + 1}
            initial="hidden"
            animate={revealEnabled ? "visible" : "hidden"}
            variants={navRevealVariants}
            href={item.href}
          >
            {item.label}
          </motion.a>
        ))}
      </nav>
    </header>
  );
}
