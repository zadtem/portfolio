import { experiences, tools } from "@/data/portfolio";

export default function AboutSection() {
  return (
    <section className="about-section" id="me" aria-labelledby="about-title">
      <div className="about-copy">
        <h2 id="about-title">A little bit about me</h2>
        <p>
          Hello reader! Let&apos;s get acquainted through a story.
          <br />
          My journey as a designer began with a screwdriver. As a kid, no toy was
          safe; I had to take it apart to see how it worked. By 14, I had explored
          every part of my first computer, from the physical RAM to the Windows
          registry. This innate curiosity - this need to understand the why behind
          the what - is the foundation of everything I do.
          <br />
          <br />
          This path led me to a formal education in Electrical and Computer
          Engineering, where I learned the logic behind how the world works. But my
          career is in design, where logic alone is not enough. I thrive at the
          intersection of these two worlds: where the rigor of engineering meets the
          boundless possibility of design.
        </p>
      </div>

      <aside className="experience-panel" aria-label="Experience and tools">
        <div className="experience-list">
          {experiences.map((item) => (
            <article key={`${item.company}-${item.dates}`} className="experience-item">
              <h3>{item.company}</h3>
              <p>
                {item.role}
                <span aria-hidden="true"> - </span>
                {item.dates}
              </p>
            </article>
          ))}
        </div>
        <div className="tool-grid" aria-label="Tools">
          {tools.map((tool) => (
            <img key={tool.name} src={tool.src} alt={tool.name} title={tool.name} />
          ))}
        </div>
      </aside>
    </section>
  );
}
