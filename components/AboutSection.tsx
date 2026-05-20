"use client";

import { useEffect, useRef } from "react";
import { experiences, tools } from "@/data/portfolio";

const aboutText = `Hello reader! Let's get acquainted through a story.

My journey as a designer began with a screwdriver. As a kid, no toy was safe; I had to take it apart to see how it worked. By 14, I had explored every part of my first computer, from the physical RAM to the Windows registry. This innate curiosity—this need to understand the "why" behind the "what"—is the foundation of everything I do.

This path led me to a formal education in Electrical and Computer Engineering, where I learned the logic behind how the world works. But my career is in design, where logic alone isn't enough. I thrive at the intersection of these two worlds: where the rigor of engineering meets the boundless possibility of design.

This is why I'm drawn to design. It's a discipline you can't fully quantify or put into a box. It's a space that rewards you for seeing the bigger picture, for understanding that every element is connected. This philosophy is at the core of my work. I don't just see a user interface; I see a complex system of user needs, business goals, technical constraints, and market forces.

I call this Ecosystems Thinking.

It's an approach that involves wearing different hats—analyst, engineer, artist, and strategist—to map how every factor affects the outcome. This holistic view leads to solutions that aren't just aesthetically pleasing, but are also robust, intuitive, and deeply integrated. It's about designing not just a single component, but the entire experience.

If this approach resonates with you, I'd love to connect and discuss how we can build something great together.`;

function splitIntoParagraphs(text: string) {
  return text.split("\n\n").map((para) => para.replace(/\n/g, " "));
}

export default function AboutSection() {
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = copyRef.current;
    if (!el) return;

    const words = el.querySelectorAll<HTMLSpanElement>(".about-word");
    if (!words.length) return;

    const update = () => {
      const viewportH = window.innerHeight;

      words.forEach((word) => {
        const rect = word.getBoundingClientRect();
        const wordCenter = rect.top + rect.height / 2;
        // Words become active when they cross the 80% mark from the top
        const threshold = viewportH * 0.8;
        const active = wordCenter < threshold;
        word.classList.toggle("is-visible", active);
      });
    };

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const paragraphs = splitIntoParagraphs(aboutText);

  return (
    <section className="about-section" id="me" aria-labelledby="about-title" data-section>
      <div className="about-copy" ref={copyRef}>
        <h2 id="about-title">A little bit about me</h2>
        {paragraphs.map((para, i) => (
          <p key={i}>
            {para.split(/(\s+)/).map((chunk, j) =>
              /^\s+$/.test(chunk) ? (
                chunk
              ) : (
                <span key={j} className="about-word">
                  {chunk}
                </span>
              )
            )}
          </p>
        ))}
      </div>

      <aside className="experience-panel" aria-label="Experience and tools">
        <div className="experience-list">
          {experiences.map((item) => (
            <article key={`${item.company}-${item.dates}`} className="experience-item">
              <h3>{item.company}</h3>
              <p className="experience-role-date">
                <span>{item.role}</span>
                <span>{item.dates}</span>
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
