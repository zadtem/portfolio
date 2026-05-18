import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/portfolio";

type WorkGridProps = {
  onOpenProject: (projectId: string) => void;
};

export default function WorkGrid({ onOpenProject }: WorkGridProps) {
  return (
    <section className="work-section" id="work" aria-label="Selected work">
      <div className="work-grid">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} onOpenProject={onOpenProject} />
        ))}
      </div>
    </section>
  );
}
