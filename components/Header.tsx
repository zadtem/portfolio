"use client";

import { useEffect, useState } from "react";

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

export default function Header() {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const [toastKey, setToastKey] = useState(0);

  useEffect(() => {
    if (copyState === "idle") return;

    const timeout = window.setTimeout(() => setCopyState("idle"), 1900);
    return () => window.clearTimeout(timeout);
  }, [copyState, toastKey]);

  const showCopyState = (state: "copied" | "failed") => {
    setCopyState(state);
    setToastKey((currentKey) => currentKey + 1);
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
      <button
        className={`brand brand-copy${copyState === "copied" ? " is-copied" : ""}${
          copyState === "failed" ? " is-failed" : ""
        }`}
        type="button"
        aria-label="Copy website link: tem.works"
        onClick={handleCopy}
      >
        <span className="brand-copy__text">Temesgen Mamo</span>
        <span className="brand-copy__hint" aria-hidden="true">
          {copyState === "copied"
            ? "Copied tem.works"
            : copyState === "failed"
              ? "Copy failed"
              : "Copy tem.works"}
        </span>
      </button>
      {copyState !== "idle" ? (
        <span
          key={toastKey}
          className={`copy-toast${copyState === "failed" ? " is-failed" : ""}`}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {copyState === "copied" ? "Link copied" : "Copy failed"}
        </span>
      ) : null}
      <nav className="nav-links" aria-label="Portfolio sections">
        {navItems.map((item) => (
          <a
            key={item.href}
            className={item.accent ? "nav-link--accent" : undefined}
            href={item.href}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
