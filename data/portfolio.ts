export type ProjectVariant = "hero" | "phone" | "gallery" | "marketplace";

export type ProjectCard = {
  id: string;
  title: string;
  company?: string;
  role?: string;
  summary?: string;
  variant: ProjectVariant;
  previewable?: boolean;
  assets: {
    phone?: string;
    desktop?: string;
    dashboard?: string;
    gallery?: string[];
    background?: string;
  };
};

export type ExperienceItem = {
  company: string;
  role: string;
  dates: string;
};

export type ToolLogo = {
  name: string;
  src: string;
};

export type ContactLink = {
  label: string;
  href: string;
  icon: string;
  tone: "linkedin" | "upwork" | "telegram" | "plain";
};

export type TidbitCard = {
  title: string;
  eyebrow: string;
  body: string;
  image?: string;
  tone: "soft" | "pink" | "ink" | "solar" | "green";
};

export type CaseStudy = {
  id: string;
  title: string;
  company: string;
  role: string;
  subtitle: string;
  intro: string;
  heroImage: string;
  steps: Array<{
    title: string;
    body: string;
  }>;
  audienceSections: Array<{
    title: string;
    points: string[];
    linkLabel: string;
    media: string[];
  }>;
  testimonial: {
    quote: string;
    author: string;
    role: string;
  };
};

export const projects: ProjectCard[] = [
  {
    id: "projetsolaire",
    title: "How do you market a vertical SaaS?",
    company: "Projetsolaire",
    role: "Lead product designer",
    summary: "End-to-end redesign of the projetsolaire landing site",
    variant: "hero",
    previewable: true,
    assets: {
      phone: "/assets/projetsolaire-phone.png",
      desktop: "/assets/projetsolaire-desktop.png"
    }
  },
  {
    id: "brainbite",
    title: "We can all (some what) build apps now. What's next?",
    company: "Brainbite",
    role: "Senior interaction designer",
    summary:
      "How we made brainbite's web and mobile apps come alive with Rive animations and gamification.",
    variant: "phone",
    assets: {
      phone: "/assets/brainbite-phone.png",
      background: "/assets/waves.svg"
    }
  },
  {
    id: "brand-gallery",
    title: "A gallery of my design work over the years...",
    company: "Various companies",
    role: "Various roles",
    summary:
      "A free canvas view of some brand and UX design work from 8+ years of design practice.",
    variant: "gallery",
    assets: {
      gallery: [
        "/assets/brand-1.jpg",
        "/assets/brand-2.png",
        "/assets/brand-3.png",
        "/assets/brand-4.png"
      ]
    }
  },
  {
    id: "marketplace",
    title: "Market, collect, convert, and manage.",
    company: "Projetsolaire",
    role: "Marketplace strategy",
    summary:
      "A system map for connecting solar leads, installers, quotes, and installed systems.",
    variant: "marketplace",
    assets: {
      dashboard: "/assets/marketplace-dashboard.png"
    }
  }
];

export const experiences: ExperienceItem[] = [
  {
    company: "ProjetSolaire",
    role: "Lead product designer",
    dates: "Sept 2025 - present"
  },
  {
    company: "Brainbite",
    role: "Senior interaction designer",
    dates: "Dec 2024 - Jul 2025"
  },
  {
    company: "Yenehealth",
    role: "Lead product designer",
    dates: "Apr 2024 - Dec 2024"
  }
];

export const tools: ToolLogo[] = [
  { name: "Figma", src: "/assets/figma.svg" },
  { name: "Cursor", src: "/assets/cursor.png" },
  { name: "Rive", src: "/assets/rive.svg" },
  { name: "Framer", src: "/assets/framer.svg" },
  { name: "Illustrator", src: "/assets/illustrator.svg" },
  { name: "After Effects", src: "/assets/aftereffects.svg" }
];

export const contactLinks: ContactLink[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/temesgenaymamo/",
    icon: "/assets/linkedin.svg",
    tone: "linkedin"
  },
  {
    label: "Upwork",
    href: "https://www.upwork.com/freelancers/~012600e15d8efd8eb0",
    icon: "/assets/upwork.svg",
    tone: "upwork"
  },
  {
    label: "Telegram",
    href: "https://t.me/just_tem",
    icon: "/assets/telegram.svg",
    tone: "telegram"
  }
];

export const tidbits: TidbitCard[] = [
  {
    title: "Motion studies",
    eyebrow: "Interaction",
    body:
      "Small prototypes exploring when motion clarifies state changes and when it gets in the way.",
    image: "/assets/brand-1.jpg",
    tone: "pink"
  },
  {
    title: "Solar flows",
    eyebrow: "Systems",
    body:
      "A collection of notes on quote flows, calculators, installer onboarding, and lead quality.",
    image: "/assets/marketplace-dashboard.png",
    tone: "solar"
  },
  {
    title: "Rive experiments",
    eyebrow: "Animation",
    body:
      "Character moments, game-like feedback, and tiny reward loops for product experiences.",
    image: "/assets/brainbite-phone.png",
    tone: "green"
  },
  {
    title: "Brand fragments",
    eyebrow: "Identity",
    body:
      "Logo directions, marks, typography tests, and visual systems from client explorations.",
    image: "/assets/brand-3.png",
    tone: "soft"
  },
  {
    title: "Useful constraints",
    eyebrow: "Process",
    body:
      "The best ideas usually came from making technical limits visible early enough to design with them.",
    tone: "ink"
  },
  {
    title: "Interface maps",
    eyebrow: "UX",
    body:
      "Before screens, I like drawing the agreement between people, systems, and the promises in between.",
    tone: "soft"
  },
  {
    title: "Microcopy",
    eyebrow: "Writing",
    body:
      "Notes on making product language feel direct, warm, and unambiguous without sounding flat.",
    tone: "pink"
  },
  {
    title: "Toolbox",
    eyebrow: "Craft",
    body:
      "Figma for structure, Rive for life, Framer for fast feel, and code when the idea needs a pulse.",
    tone: "green"
  },
  {
    title: "Off the top",
    eyebrow: "Archive",
    body:
      "Loose sketches, remembered problems, and half-formed design instincts worth revisiting later.",
    tone: "solar"
  },
  {
    title: "Field notes",
    eyebrow: "Research",
    body:
      "Patterns from conversations with homeowners, installers, founders, and teams under pressure.",
    tone: "ink"
  }
];

export const caseStudies: CaseStudy[] = [
  {
    id: "projetsolaire",
    title: "How do you market a vertical SaaS?",
    company: "Projetsolaire",
    role: "Lead product designer",
    subtitle: "End-to-end redesign of the projetsolaire landing site",
    heroImage: "/assets/projetsolaire-phone.png",
    intro:
      "The ProjetSolaire landing site was originally built for a single audience - installers - and had accumulated fragmented pages from different stages of the company's growth. As the platform expanded into a D2C consumer surface, introduced plan-based tiers, and pushed into new verticals like community solar and white-label partnerships, the existing site could not carry the weight. The redesign consolidated overlapping flows, made room for the new tiering and product directions, and reframed the entire experience around homeowners, installers, and partners.",
    steps: [
      {
        title: "The Problem",
        body:
          "We are a vertical SaaS for the French solar industry, but the site was bloated and the design inconsistent."
      },
      {
        title: "The Research",
        body:
          "We spoke to homeowners, installers, and C&I customers. The discussions were open and tailored."
      },
      {
        title: "The Solution",
        body:
          "Messaging for businesses and homeowners needed to differ because each group valued different communications."
      }
    ],
    audienceSections: [
      {
        title: "Home owners side",
        points: [
          "Fundamental concern is certification of installers and prevalent scams. Customers need reassurance.",
          "Secondary concern is reluctance to invest unless ROI is clear, so calculators and lead generation matter.",
          "Since solar is technical, the learning blog needed to surface higher in the journey."
        ],
        linkLabel: "Visit the site",
        media: [
          "/assets/homeowners-wide.png",
          "/assets/projetsolaire-phone.png",
          "/assets/marketplace-dashboard.png"
        ]
      },
      {
        title: "Installers side",
        points: [
          "Their fundamental concerns lie in interoperability between tools that different team members use.",
          "Administrative automations are the best selling service. The project marketplace is what people look forward to.",
          "They want demonstrated use cases they can apply, so features and solutions were surfaced separately."
        ],
        linkLabel: "Visit the site",
        media: ["/assets/projetsolaire-desktop.png", "/assets/installer-strip.png"]
      }
    ],
    testimonial: {
      quote:
        "Temesgen is a talented and creative designer who contributed significantly to our projects. He consistently produced clean, modern, and user-focused designs while being reliable and easy to work with throughout the development process. He has a strong understanding of UI/UX principles, branding, and product design, and was able to quickly adapt to changing requirements and feedback. His work helped improve the overall quality and professionalism of our products. I would confidently recommend Temesgen for design roles involving product design, UI/UX, and digital experiences.",
      author: "Maarten Elgar",
      role: "CTO and co-founder, Projetsolaire"
    }
  }
];
