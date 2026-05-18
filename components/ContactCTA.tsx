import { contactLinks } from "@/data/portfolio";

type ContactCTAProps = {
  compact?: boolean;
};

export default function ContactCTA({ compact = false }: ContactCTAProps) {
  const primaryLinks = contactLinks.slice(0, 3);

  return (
    <section className={`contact-cta ${compact ? "contact-cta--compact" : ""}`} aria-labelledby="contact-title">
      <img className="contact-wave" src="/assets/waves.svg" alt="" aria-hidden="true" />
      <div className="contact-inner">
        <h2 id="contact-title">Lets collaborate on your next big project!</h2>
        <ContactGroup title="Where I respond the fastest" links={primaryLinks} />
      </div>
      <a className="off-top-link" href="#top">
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
  links: typeof contactLinks;
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
            <img src={link.icon} alt="" />
          </a>
        ))}
      </div>
    </div>
  );
}
