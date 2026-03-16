const footerLinks = [
  { label: "Instagram", href: "#" },
  { label: "Twitter", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "Email", href: "mailto:hello@pahaditadka.com" },
];

export function Footer() {
  return (
    <footer id="contact" className="text-center py-12 px-4 mt-16 opacity-70">
      <div className="flex justify-center gap-8 mb-4 flex-wrap">
        {footerLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-sm font-medium hover:opacity-60 transition-opacity"
          >
            {link.label}
          </a>
        ))}
      </div>
      <p className="text-sm">
        &copy; {new Date().getFullYear()} pahadi तड़का. Made with ❤️ in the mountains.
      </p>
    </footer>
  );
}
