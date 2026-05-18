"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AboutSection from "@/components/AboutSection";
import CaseStudyOverlay from "@/components/CaseStudyOverlay";
import ContactCTA from "@/components/ContactCTA";
import Header from "@/components/Header";
import TidbitsSection from "@/components/TidbitsSection";
import WorkGrid from "@/components/WorkGrid";
import { caseStudies } from "@/data/portfolio";

export default function PortfolioExperience() {
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

  const closeProject = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete("project");
    const nextUrl = `${url.pathname}${url.search}${url.hash}`;
    window.history.pushState({}, "", nextUrl);
    setActiveProjectId(null);
  }, []);

  return (
    <>
      <Header />
      <main className="page-shell" id="top">
        <WorkGrid onOpenProject={openProject} />
        <AboutSection />
        <TidbitsSection />
        <ContactCTA />
      </main>
      <CaseStudyOverlay caseStudy={activeCaseStudy} onClose={closeProject} />
    </>
  );
}
