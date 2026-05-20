"use client";

import { EnvelopeOpen, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { contactLinks, type ContactLink } from "@/data/portfolio";

type ContactCTAProps = {
  compact?: boolean;
};

export default function ContactCTA({ compact = false }: ContactCTAProps) {
  const primaryLinks = contactLinks.filter((link) => link.group === "primary");
  const secondaryLinks = contactLinks.filter((link) => link.group === "secondary");
  const titleId = compact ? "case-contact-title" : "contact-title";

  return (
    <section
      className={`contact-cta ${compact ? "contact-cta--compact" : ""}`}
      id={compact ? undefined : "contact"}
      aria-labelledby={titleId}
      data-section
    >
      <img className="contact-wave" src="/assets/waves.svg" alt="" aria-hidden="true" />
      <div className="contact-inner">
        <h2 id={titleId}>Lets collaborate on your next big project!</h2>
        <ContactGroup title="Where I respond the fastest" links={primaryLinks} />
        <ContactGroup title="Other places where I also exist" links={secondaryLinks} />
      </div>
      <a
        className="off-top-link"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        Off the top
      </a>
    </section>
  );
}

function ContactGroup({
  title,
  links
}: {
  title: string;
  links: ContactLink[];
}) {
  return (
    <div className="contact-group">
      <p>{title}</p>
      <div className="contact-links">
        {links.map((link) => (
          <a
            key={link.label}
            className={`contact-link contact-link--${link.tone}`}
            href={link.href}
            aria-label={link.label}
          >
            <ContactIcon link={link} />
          </a>
        ))}
      </div>
    </div>
  );
}

function ContactIcon({ link }: { link: ContactLink }) {
  if (link.iconType === "email") {
    return <EnvelopeOpen aria-hidden="true" size={36} weight="regular" />;
  }

  if (link.iconType === "whatsapp") {
    return <WhatsappLogo aria-hidden="true" size={36} weight="regular" />;
  }

  return <img src={link.icon} alt="" />;
}
