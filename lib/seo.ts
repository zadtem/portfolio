import type { Metadata } from "next";
import { caseStudies, contactLinks, projects, testimonials, tools } from "@/data/portfolio";

export const siteUrl = "https://tem.works";
export const siteName = "Temesgen Mamo Portfolio";
export const profileName = "Temesgen Mamo";
export const siteTitle = "Temesgen Mamo - Rive Animator, UI Designer & Product Design Lead";
export const siteDescription =
  "Portfolio of Temesgen Mamo, a Rive animator, UI designer, product designer, interaction designer, and design lead for remote product teams across European and GMT-overlap time zones.";

export const specialties = [
  "Rive animation",
  "UI design",
  "Product design",
  "Interaction design",
  "Design leadership",
  "SaaS design",
  "Gamified product experiences",
  "Design systems"
];

export const caseStudySeo = {
  projetsolaire: {
    slug: "projetsolaire",
    title: "ProjetSolaire SaaS Landing Page Redesign",
    description:
      "A product design case study on restructuring the ProjetSolaire SaaS landing experience for homeowners, installers, and solar industry partners.",
    image: "/assets/projetsolaire-desktop.png"
  },
  brainbite: {
    slug: "brainbite",
    title: "Brainbite Rive Animation and Gamified UI Design",
    description:
      "A Rive animation and interaction design case study showing how Brainbite added production-ready motion, learning mascots, and gamified UI moments.",
    image: "/assets/brainbite-hero.png"
  }
} as const;

export type CaseStudySlug = keyof typeof caseStudySeo;

export const caseStudySlugs = Object.keys(caseStudySeo) as CaseStudySlug[];

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export function getCaseStudyBySlug(slug: string) {
  if (!isCaseStudySlug(slug)) return null;
  const caseStudy = caseStudies.find((item) => item.id === slug);
  if (!caseStudy) return null;

  return {
    caseStudy,
    seo: caseStudySeo[slug]
  };
}

export function isCaseStudySlug(slug: string): slug is CaseStudySlug {
  return slug in caseStudySeo;
}

export function buildMetadata({
  title,
  description,
  path,
  image = "/assets/projetsolaire-desktop.png"
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    title,
    description,
    alternates: {
      canonical: url
    },
    openGraph: {
      title,
      description,
      url,
      siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title
        }
      ],
      locale: "en_US",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl]
    }
  };
}

function sameAsLinks() {
  return contactLinks
    .filter((link) => link.href.startsWith("https://"))
    .map((link) => link.href);
}

function toolNames() {
  return tools.map((tool) => tool.name);
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: profileName,
    url: siteUrl,
    jobTitle: [
      "Rive Animator",
      "UI Designer",
      "Product Designer",
      "Senior Interaction Designer",
      "Design Lead"
    ],
    description: siteDescription,
    knowsAbout: specialties,
    knowsLanguage: "en",
    sameAs: sameAsLinks(),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "professional inquiries",
      email: "temesgenaymamo@gmail.com",
      availableLanguage: "English"
    }
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: siteName,
    url: siteUrl,
    description: siteDescription,
    inLanguage: "en",
    publisher: {
      "@id": `${siteUrl}/#person`
    }
  };
}

export function creativeWorkJsonLd(slug: CaseStudySlug) {
  const entry = getCaseStudyBySlug(slug);
  if (!entry) return null;

  const { caseStudy, seo } = entry;
  const project = projects.find((item) => item.caseStudyId === slug || item.id === slug);
  const caseTestimonials = testimonials.filter((item) => item.caseStudyId === slug);

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${absoluteUrl(`/work/${seo.slug}`)}#creative-work`,
    name: seo.title,
    headline: caseStudy.title,
    description: seo.description,
    url: absoluteUrl(`/work/${seo.slug}`),
    image: absoluteUrl(seo.image),
    creator: {
      "@id": `${siteUrl}/#person`
    },
    about: [caseStudy.company, caseStudy.role, ...specialties],
    keywords: specialties.join(", "),
    workExample: project?.summary,
    tool: toolNames(),
    review: caseTestimonials.map((testimonial) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: testimonial.author
      },
      reviewBody: testimonial.quote
    }))
  };
}

export function portfolioJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      personJsonLd(),
      websiteJsonLd(),
      ...caseStudySlugs
        .map((slug) => creativeWorkJsonLd(slug))
        .filter((item): item is NonNullable<typeof item> => Boolean(item))
    ]
  };
}
