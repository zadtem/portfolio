import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import type { AudienceCaseStudy, BrainbiteCaseStudy, CaseStudy } from "@/data/portfolio";
import {
  buildMetadata,
  caseStudySlugs,
  creativeWorkJsonLd,
  getCaseStudyBySlug,
  type CaseStudySlug
} from "@/lib/seo";

type WorkPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return caseStudySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: WorkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getCaseStudyBySlug(slug);
  if (!entry) return {};

  return buildMetadata({
    title: entry.seo.title,
    description: entry.seo.description,
    path: `/work/${entry.seo.slug}`,
    image: entry.seo.image
  });
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { slug } = await params;
  const entry = getCaseStudyBySlug(slug);
  if (!entry) notFound();

  const jsonLd = creativeWorkJsonLd(slug as CaseStudySlug);

  return (
    <main className="work-page">
      {jsonLd ? <JsonLd data={jsonLd} /> : null}
      <article className={`work-article work-article--${entry.caseStudy.layout}`}>
        <Link className="work-back-link" href="/">
          Back to portfolio
        </Link>
        <WorkHero caseStudy={entry.caseStudy} description={entry.seo.description} />
        {entry.caseStudy.layout === "brainbite" ? (
          <BrainbiteArticle caseStudy={entry.caseStudy} />
        ) : (
          <AudienceArticle caseStudy={entry.caseStudy} />
        )}
        <Testimonials caseStudy={entry.caseStudy} />
      </article>
    </main>
  );
}

function WorkHero({
  caseStudy,
  description
}: {
  caseStudy: CaseStudy;
  description: string;
}) {
  return (
    <header className="work-hero">
      <div className="work-hero__copy">
        <p className="work-eyebrow">Case study</p>
        <h1>{caseStudy.title}</h1>
        <p className="work-meta">
          {caseStudy.company}
          <span aria-hidden="true"> · </span>
          {caseStudy.role}
        </p>
        <p className="work-summary">{caseStudy.subtitle}</p>
        <p className="work-description">{description}</p>
      </div>
      <img
        className="work-hero__image"
        src={caseStudy.heroImage}
        alt={`${caseStudy.company} ${caseStudy.role} case study visuals`}
      />
    </header>
  );
}

function AudienceArticle({ caseStudy }: { caseStudy: AudienceCaseStudy }) {
  return (
    <>
      <section className="work-section-block" aria-labelledby="overview-title">
        <h2 id="overview-title">Overview</h2>
        <p>{caseStudy.intro}</p>
      </section>

      <section className="work-step-grid" aria-label="Project process">
        {caseStudy.steps.map((step) => (
          <article key={step.title} className="work-step">
            <h2>{step.title}</h2>
            <p>{step.body}</p>
          </article>
        ))}
      </section>

      {caseStudy.audienceSections.map((section) => (
        <section key={section.title} className="work-audience">
          <div className="work-audience__copy">
            <h2>{section.title}</h2>
            {section.points.map((point) => (
              <p key={point}>{point}</p>
            ))}
            <a href={section.href} target="_blank" rel="noopener noreferrer">
              {section.linkLabel}
            </a>
          </div>
          <div className="work-audience__media" aria-label={`${section.title} project visuals`}>
            {section.media.map((src) => (
              <img key={src} src={src} alt={`${section.title} design visual`} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

function BrainbiteArticle({ caseStudy }: { caseStudy: BrainbiteCaseStudy }) {
  return (
    <>
      <section className="work-section-block" aria-labelledby="overview-title">
        <h2 id="overview-title">Overview</h2>
        {caseStudy.intro.split("\n\n").map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <section className="work-step-grid" aria-label="Problem and solution">
        <article className="work-step">
          <h2>The Problem</h2>
          {caseStudy.problem.map((point) => (
            <p key={point}>{point}</p>
          ))}
        </article>
        <article className="work-step">
          <h2>The Solution</h2>
          <p>{caseStudy.solution}</p>
        </article>
      </section>

      <section className="work-section-block">
        <h2>Design and animation of gamified UI elements</h2>
        <p>
          The goal here was to provide distinction to important UI elements as well as playful
          transition states for UI elements.
        </p>
        <div className="work-media-strip">
          {caseStudy.gamifiedMedia.map((src) => (
            <img key={src} src={src} alt="Brainbite gamified product interface" />
          ))}
        </div>
      </section>

      <section className="work-section-block">
        <h2>Animation of learning mascots</h2>
        <p>
          The work defined and animated emotions, idle states, and implementation language for
          developers importing and using Rive files.
        </p>
      </section>
    </>
  );
}

function Testimonials({ caseStudy }: { caseStudy: CaseStudy }) {
  const testimonials = Array.isArray(caseStudy.testimonial)
    ? caseStudy.testimonial
    : [caseStudy.testimonial];

  return (
    <section className="work-testimonials" aria-labelledby="testimonial-title">
      <h2 id="testimonial-title">Client notes</h2>
      {testimonials.map((testimonial) => (
        <blockquote key={`${testimonial.author}-${testimonial.role}`}>
          <p>&quot;{testimonial.quote}&quot;</p>
          <footer>
            <strong>{testimonial.author}</strong>
            <span>{testimonial.role}</span>
          </footer>
        </blockquote>
      ))}
    </section>
  );
}
