"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AboutSection from "@/components/AboutSection";
import CaseStudyOverlay from "@/components/CaseStudyOverlay";
import ContactCTA from "@/components/ContactCTA";
import Header from "@/components/Header";
import SmoothScrollController from "@/components/SmoothScrollController";
import TestimonialSection from "@/components/TestimonialSection";
import TidbitsSection from "@/components/TidbitsSection";
import WorkGrid from "@/components/WorkGrid";
import { caseStudies } from "@/data/portfolio";

export default function PortfolioExperience() {
  const shellRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const project = params.get("project");
      setActiveProjectId(project);
    };

    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);

    return () => window.removeEventListener("popstate", syncFromUrl);
  }, []);

  const activeCaseStudy = useMemo(
    () => caseStudies.find((caseStudy) => caseStudy.id === activeProjectId) ?? null,
    [activeProjectId]
  );

  const openProject = useCallback((projectId: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("project", projectId);
    window.history.pushState({ project: projectId }, "", url);
    setActiveProjectId(projectId);
  }, []);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    const sections = shell.querySelectorAll<HTMLElement>("[data-section]");
    if (!sections.length) return;

    let lastScrollY = window.scrollY;

    const update = () => {
      const viewportH = window.innerHeight;
      const scrollY = window.scrollY;
      const scrollingDown = scrollY >= lastScrollY;
      lastScrollY = scrollY;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const threshold = scrollingDown
          ? viewportH * (2 / 3)
          : viewportH * (1 / 3);
        const visible = rect.top < threshold && rect.bottom > 0;
        section.classList.toggle("is-visible", visible);
      });
    };

    shell.classList.add("reveal-ready");
    update();

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const progress = progressRef.current;
    if (!progress) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const scrollableDistance = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress =
        scrollableDistance <= 0 ? 1 : Math.min(Math.max(window.scrollY / scrollableDistance, 0), 1);

      progress.style.setProperty("--scroll-progress", scrollProgress.toString());
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  const closeProject = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete("project");
    const nextUrl = `${url.pathname}${url.search}${url.hash}`;
    window.history.pushState({}, "", nextUrl);
    setActiveProjectId(null);
  }, []);

  return (
    <>
      <SmoothScrollController disabled={Boolean(activeCaseStudy)} />
      <div className="scroll-progress-rail" ref={progressRef} aria-hidden="true" />
      <Header />
      <main className="page-shell" id="top" ref={shellRef}>
        <WorkGrid onOpenProject={openProject} />
        <AboutSection />
        <TestimonialSection onOpenProject={openProject} />
        <TidbitsSection />
        <ContactCTA />
      </main>
      <CaseStudyOverlay caseStudy={activeCaseStudy} onClose={closeProject} />
    </>
  );
}
