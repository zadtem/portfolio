import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/portfolio";

type WorkGridProps = {
  onOpenProject: (projectId: string) => void;
  revealEnabled: boolean;
  revealMotion?: "animated" | "static";
};

export default function WorkGrid({
  onOpenProject,
  revealEnabled,
  revealMotion = "animated"
}: WorkGridProps) {
  return (
    <section
      className="work-section"
      id="work"
      aria-label="Selected work"
      data-card-reveal-section
      data-section
    >
      <div className="work-grid">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            index={index}
            project={project}
            revealEnabled={revealEnabled}
            revealMotion={revealMotion}
            onOpenProject={onOpenProject}
          />
        ))}
      </div>
    </section>
  );
}
