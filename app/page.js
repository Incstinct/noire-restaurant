"use client";
export const dynamic = "force-dynamic";
import Link from "next/link";

export default function Home() {
  return (
    <main>

      {/* Hero — full screen */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">

        {/* Background gradient */}
        <div className="absolute inset-0 bg-[#0d1117]">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0d1117]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#c0c0c0]/3 rounded-full blur-[120px]" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-8">
          <p className="text-xs tracking-[0.5em] uppercase text-[#8b949e]">
            Est. 2018 — Warsaw
          </p>
          <h1 className="text-6xl md:text-8xl font-normal tracking-[0.1em] text-[#e6edf3] leading-none">
            Noire
          </h1>
          <div className="w-16 h-px bg-[#c0c0c0]/50" />
          <p className="text-base md:text-lg text-[#8b949e] font-normal max-w-md leading-relaxed tracking-wide">
            An intimate fine dining experience where every detail is considered and every moment is crafted.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link
              href="/reservations"
              className="text-xs tracking-[0.3em] uppercase bg-[#c0c0c0] text-[#0d1117] px-10 py-4 hover:bg-[#e6edf3] transition-all duration-300"
            >
              Reserve a Table
            </Link>
            <Link
              href="/menu"
              className="text-xs tracking-[0.3em] uppercase border border-[#30363d] text-[#8b949e] px-10 py-4 hover:border-[#c0c0c0] hover:text-[#e6edf3] transition-all duration-300"
            >
              View Menu
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-xs tracking-[0.3em] uppercase text-[#30363d]">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-[#30363d] to-transparent" />
        </div>

      </section>

      {/* About strip */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <p className="text-xs tracking-[0.4em] uppercase text-[#c0c0c0] mb-6">Our Philosophy</p>
        <h2 className="text-3xl md:text-4xl font-normal text-[#e6edf3] leading-relaxed mb-8">
          Where silence speaks louder<br />than words
        </h2>
        <p className="text-[#8b949e] leading-relaxed max-w-xl mx-auto">
          Noire was born from a belief that dining is not merely sustenance — it is theatre, intimacy, and memory. We source only what the season offers and cook only what feels true.
        </p>
      </section>

      {/* Three columns */}
      <section className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-3 gap-px bg-[#30363d]">
        {[
          {
            number: "01",
            title: "The Kitchen",
            text: "Led by Chef Marcus Veil, our kitchen operates with precision and passion. Every plate is a conversation."
          },
          {
            number: "02",
            title: "The Cellar",
            text: "Over 400 labels curated from small producers across Europe. Our sommelier will guide you through each pairing."
          },
          {
            number: "03",
            title: "The Space",
            text: "Twelve tables. Candlelight. No background music. Just the sound of a room fully present."
          }
        ].map((item) => (
          <div key={item.number} className="bg-[#0d1117] p-10 md:p-12 flex flex-col gap-6">
            <span className="text-xs tracking-[0.3em] text-[#30363d]">{item.number}</span>
            <h3 className="text-lg font-normal text-[#e6edf3] tracking-wide">{item.title}</h3>
            <p className="text-sm text-[#8b949e] leading-relaxed">{item.text}</p>
          </div>
        ))}
      </section>

      {/* Menu preview */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs tracking-[0.4em] uppercase text-[#c0c0c0] mb-2">Seasonal</p>
            <h2 className="text-3xl font-normal text-[#e6edf3]">Tonight's Menu</h2>
          </div>
          <Link
            href="/menu"
            className="text-xs tracking-[0.2em] uppercase text-[#8b949e] hover:text-[#c0c0c0] transition-colors"
          >
            Full Menu →
          </Link>
        </div>

        <div className="flex flex-col gap-px bg-[#30363d]">
          {[
            { name: "Oysters, Cucumber Granita, Dill Oil", category: "Starter", price: "$24" },
            { name: "Hand-Rolled Pasta, Black Truffle, Aged Parmesan", category: "Main", price: "$52" },
            { name: "Wagyu Beef, Bone Marrow Butter, Wild Herbs", category: "Main", price: "$78" },
            { name: "Dark Chocolate Sphere, Salted Caramel, Hazelnut", category: "Dessert", price: "$18" },
          ].map((item) => (
            <div key={item.name} className="bg-[#0d1117] px-6 py-5 flex items-center justify-between group hover:bg-[#161b22] transition-colors duration-200">
              <div className="flex items-center gap-6">
                <span className="text-xs tracking-[0.2em] uppercase text-[#30363d] w-16 hidden sm:block">{item.category}</span>
                <span className="text-[#e6edf3] text-sm md:text-base">{item.name}</span>
              </div>
              <span className="text-[#8b949e] text-sm flex-shrink-0 ml-4">{item.price}</span>
            </div>
          ))}
        </div>
      </section>
      
      {/* Quick Info */}
      <section className="border-t border-[#30363d]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-px bg-[#30363d]">
          {[
            {
              label: "Location",
              lines: ["ul. Nowy Świat 12", "Warsaw, Poland"],
              href: "https://maps.google.com/?q=Nowy+Swiat+12+Warsaw",
            },
            {
              label: "Hours",
              lines: ["Tue — Fri  18:00 — 23:00", "Sat — Sun  17:00 — 23:00", "Monday  Closed"],
              href: null,
            },
            {
              label: "Phone",
              lines: ["+48 123 456 789"],
              href: "tel:+48123456789",
            },
            {
              label: "Email",
              lines: ["hello@noire.pl"],
              href: "mailto:hello@noire.pl",
            },
          ].map((item) => (
            <div key={item.label} className="bg-[#0d1117] px-8 py-10 flex flex-col gap-4">
              <p className="text-xs tracking-[0.3em] uppercase text-[#30363d]">{item.label}</p>
              {item.href ? (
                <a
                  href={item.href}
                  className="flex flex-col gap-1 group"
                >
                  {item.lines.map((line, i) => (
                    <span key={i} className="text-sm text-[#8b949e] group-hover:text-[#e6edf3] transition-colors">
                      {line}
                    </span>
                  ))}
                </a>
              ) : (
                <div className="flex flex-col gap-1">
                  {item.lines.map((line, i) => (
                    <span key={i} className="text-sm text-[#8b949e]">{line}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Reservation CTA */}
      <section className="border-t border-[#30363d] py-24 text-center px-6">
        <p className="text-xs tracking-[0.4em] uppercase text-[#8b949e] mb-6">Join Us</p>
        <h2 className="text-3xl md:text-4xl font-normal text-[#e6edf3] mb-8">
          Reserve your evening
        </h2>
        <p className="text-[#8b949e] mb-10 max-w-md mx-auto leading-relaxed">
          We seat a limited number of guests each evening to ensure every table receives our full attention.
        </p>
        <Link
          href="/reservations"
          className="text-xs tracking-[0.3em] uppercase border border-[#c0c0c0] text-[#c0c0c0] px-12 py-4 hover:bg-[#c0c0c0] hover:text-[#0d1117] transition-all duration-300 inline-block"
        >
          Make a Reservation
        </Link>
      </section>

    </main>
  );
}