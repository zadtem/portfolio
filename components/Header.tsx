const navItems = [
  { label: "Work", href: "#work" },
  { label: "Me", href: "#me" },
  { label: "Tidbits", href: "#tidbits" }
];

export default function Header() {
  return (
    <header className="site-header" aria-label="Primary">
      <a className="brand" href="#top">
        Temesgen Mamo
      </a>
      <nav className="nav-links" aria-label="Portfolio sections">
        {navItems.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
