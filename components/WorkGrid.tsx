import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/portfolio";

type WorkGridProps = {
  onOpenProject: (projectId: string) => void;
};

export default function WorkGrid({ onOpenProject }: WorkGridProps) {
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
            onOpenProject={onOpenProject}
          />
        ))}
      </div>
    </section>
  );
}
