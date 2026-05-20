export type ProjectVariant = "hero" | "phone" | "gallery" | "marketplace";
export type ProjectStatus = "case-study" | "coming-soon";

export type MarketplaceSequenceItem = {
  label: string;
  image: string;
};

export type ProjectCard = {
  id: string;
  title: string;
  company?: string;
  role?: string;
  summary?: string;
  status: ProjectStatus;
  caseStudyId?: string;
  variant: ProjectVariant;
  previewable?: boolean;
  assets: {
    phone?: string;
    desktop?: string;
    dashboard?: string;
    gallery?: string[];
    background?: string;
    marketplaceLogo?: string;
    marketplaceSequence?: MarketplaceSequenceItem[];
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
  icon?: string;
  iconType: "image" | "email" | "whatsapp";
  group: "primary" | "secondary";
  tone: "linkedin" | "upwork" | "telegram" | "plain";
};

type TidbitCardBase = {
  title: string;
  eyebrow: string;
  tone: "soft" | "pink" | "ink" | "solar" | "green";
};

export type TidbitPinterestCard = TidbitCardBase & {
  kind: "pinterest";
  boardUrl: string;
  boardDescription: string;
};

export type TidbitSpotifyCard = TidbitCardBase & {
  kind: "spotify";
  playlistId: string;
};

export type TidbitIframeCard = TidbitCardBase & {
  kind: "iframe";
  src: string;
  body?: string;
};

export type TidbitPromoCard = TidbitCardBase & {
  kind: "promo";
  logo: string;
  previewImages?: string[];
  tagline: string;
  href: string;
};

export type TidbitVisualCard = TidbitCardBase & {
  kind: "visual";
  image: string;
  previewImages?: string[];
  href: string;
};

export type TidbitCard =
  | TidbitPinterestCard
  | TidbitSpotifyCard
  | TidbitIframeCard
  | TidbitPromoCard
  | TidbitVisualCard;

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
    href: string;
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
    status: "case-study",
    caseStudyId: "projetsolaire",
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
    status: "coming-soon",
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
    status: "coming-soon",
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
      "A story of how we built a comprehensive solar customers sales funnel, and the system to manage it.",
    status: "coming-soon",
    variant: "marketplace",
    assets: {
      dashboard: "/assets/marketplace-prospective.png",
      marketplaceLogo: "/assets/marketplace-logo.png",
      marketplaceSequence: [
        {
          label: "Prospective customers",
          image: "/assets/marketplace-prospective.png"
        },
        {
          label: "Hardware selling partners",
          image: "/assets/marketplace-prospective-overlay.png"
        },
        {
          label: "Customers with quotes",
          image: "/assets/marketplace-quotes.png"
        },
        {
          label: "Self-Installing customers",
          image: "/assets/marketplace-self-installing.png"
        }
      ]
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
  { name: "Figma", src: "/assets/tool-figma.png" },
  { name: "Cursor", src: "/assets/tool-cursor.png" },
  { name: "Rive", src: "/assets/tool-rive.png" },
  { name: "Framer", src: "/assets/tool-framer.png" },
  { name: "Illustrator", src: "/assets/tool-illustrator.png" },
  { name: "After Effects", src: "/assets/tool-aftereffects.png" }
];

export const contactLinks: ContactLink[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/temesgenaymamo/",
    icon: "/assets/contact-linkedin.png",
    iconType: "image",
    group: "primary",
    tone: "linkedin"
  },
  {
    label: "Upwork",
    href: "https://www.upwork.com/freelancers/~012600e15d8efd8eb0",
    icon: "/assets/contact-upwork.png",
    iconType: "image",
    group: "primary",
    tone: "upwork"
  },
  {
    label: "Telegram",
    href: "https://t.me/just_tem",
    icon: "/assets/contact-telegram.png",
    iconType: "image",
    group: "primary",
    tone: "telegram"
  },
  {
    label: "Email",
    href: "mailto:temesgenaymamo@gmail.com",
    iconType: "email",
    group: "secondary",
    tone: "plain"
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/251978254808",
    iconType: "whatsapp",
    group: "secondary",
    tone: "plain"
  }
];

export const tidbits: TidbitCard[] = [
  {
    kind: "pinterest",
    title: "Kitty mechanic",
    eyebrow: "Pinterest",
    tone: "pink",
    boardUrl: "https://www.pinterest.com/meursaultfrommerkato/kitty-mechanic/",
    boardDescription: "Cars, details, and the people who love them."
  },
  {
    kind: "spotify",
    title: "Floatin by",
    eyebrow: "Playlist",
    tone: "solar",
    playlistId: "4Ewhtz7Q06d1BLAHWB3ebD"
  },
  {
    kind: "visual",
    title: "Bitmap generator",
    eyebrow: "Side project",
    tone: "soft",
    image: "/assets/bitsme-preview.png",
    previewImages: ["/assets/bitsme-preview.png"],
    href: "https://bitsme.tem.works"
  },
  {
    kind: "pinterest",
    title: "It moves?",
    eyebrow: "Pinterest",
    tone: "green",
    boardUrl: "https://www.pinterest.com/meursaultfrommerkato/it-moves/",
    boardDescription: "Looping videos, smooth motion, hypnotic things."
  },
  {
    kind: "spotify",
    title: "Intergalactic traveller",
    eyebrow: "Playlist",
    tone: "ink",
    playlistId: "5QRQ0LRO3vpAE7rL8tngvn"
  },
  {
    kind: "promo",
    title: "Split/it",
    eyebrow: "Side project",
    tone: "soft",
    logo: "/assets/split-it-logo.svg",
    previewImages: ["/assets/split-it-logo.svg"],
    tagline: "split bills with friends",
    href: "https://bills.tem.works"
  },
  {
    kind: "pinterest",
    title: "The design is human",
    eyebrow: "Pinterest",
    tone: "soft",
    boardUrl:
      "https://www.pinterest.com/meursaultfrommerkato/the-design-is-very-human/",
    boardDescription: "Industrial design that starts with how things feel."
  },
  {
    kind: "spotify",
    title: "Zuko alone",
    eyebrow: "Playlist",
    tone: "pink",
    playlistId: "2lUWuXNupDhDK3ZkYoKzU1"
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
        href: "https://projetsolaire.com",
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
        href: "https://projetsolaire.com/installer",
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
