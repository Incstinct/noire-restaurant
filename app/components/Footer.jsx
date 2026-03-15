import Link from "next/link";

export default function Footer() {
  const email = "hello@noire.pl";

  return (
    <footer className="border-t border-[#30363d] bg-[#0d1117]">
      <div className="max-w-6xl mx-auto px-6 py-16">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <div className="md:col-span-2">
            <p className="text-xl tracking-[0.4em] uppercase text-[#e6edf3] mb-4">Noire</p>
            <p className="text-sm text-[#8b949e] leading-relaxed max-w-xs">
              An intimate fine dining experience. Twelve tables. No compromises.
            </p>
            <div className="mt-6 flex flex-col gap-1">
              <p className="text-xs text-[#8b949e] tracking-wide">Tuesday — Sunday</p>
              <p className="text-xs text-[#8b949e] tracking-wide">18:00 — 23:00</p>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-[#30363d] mb-5">Navigate</p>
            <div className="flex flex-col gap-3">
              {[
                { href: "/menu", label: "Menu" },
                { href: "/reservations", label: "Reservations" },
                { href: "/gallery", label: "Gallery" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[#8b949e] hover:text-[#e6edf3] transition-colors tracking-wide"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-[#30363d] mb-5">Find Us</p>
            <div className="flex flex-col gap-3">
              <p className="text-sm text-[#8b949e] leading-relaxed">
                ul. Nowy Świat 12
                <br />
                00-400 Warsaw, Poland
              </p>
              <a
                href="tel:+48123456789"
                className="text-sm text-[#8b949e] hover:text-[#e6edf3] transition-colors"
              >
                +48 123 456 789
              </a>
              <a
                href={`mailto:${email}`}
                className="text-sm text-[#8b949e] hover:text-[#e6edf3] transition-colors"
              >
                {email}
              </a>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#30363d] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#30363d] tracking-wide">
            © 2026 Noire. All rights reserved.
          </p>
          <p className="text-xs text-[#30363d] tracking-wide">
            Built by <span className="text-[#8b949e] hover:text-[#c0c0c0] transition-colors cursor-pointer">Incstinct X</span>
          </p>
        </div>

      </div>
    </footer>
  );
}