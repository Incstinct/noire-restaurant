"use client";
export const dynamic = "force-dynamic";
import Link from "next/link";

export default function About() {
  return (
    <main className="min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-24">
          <p className="text-xs tracking-[0.5em] uppercase text-[#c0c0c0] mb-4">Our Story</p>
          <h1 className="text-5xl md:text-6xl font-normal text-[#e6edf3] tracking-wide mb-6">
            About Noire
          </h1>
          <div className="w-16 h-px bg-[#30363d] mx-auto" />
        </div>

        {/* Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=800&q=80"
              alt="Chef at work"
              className="w-full aspect-[3/4] object-cover filter brightness-75"
            />
          </div>
          <div className="flex flex-col gap-6">
            <p className="text-xs tracking-[0.4em] uppercase text-[#c0c0c0]">The Beginning</p>
            <h2 className="text-3xl font-normal text-[#e6edf3] leading-relaxed">
              Born from a love of silence and craft
            </h2>
            <p className="text-[#8b949e] leading-relaxed">
              Noire opened in 2018 with a single belief — that a truly great meal requires nothing more than exceptional ingredients, skilled hands, and the right atmosphere.
            </p>
            <p className="text-[#8b949e] leading-relaxed">
              We chose twelve tables deliberately. Not as a limitation, but as a commitment. Every guest deserves our full attention, and full attention cannot be divided infinitely.
            </p>
          </div>
        </div>

        {/* Chef section */}
        <div className="border-t border-[#30363d] pt-24 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-6 md:order-1">
              <p className="text-xs tracking-[0.4em] uppercase text-[#c0c0c0]">The Kitchen</p>
              <h2 className="text-3xl font-normal text-[#e6edf3] leading-relaxed">
                Chef Marcus Veil
              </h2>
              <p className="text-[#8b949e] leading-relaxed">
                Marcus trained under three Michelin-starred chefs across Paris, Copenhagen and Tokyo before returning to Warsaw with a singular vision — Polish ingredients, global technique, no compromise.
              </p>
              <p className="text-[#8b949e] leading-relaxed">
                His menus change weekly, sometimes daily, depending on what the season offers. He believes the best dish is the one that could not have been made yesterday.
              </p>
            </div>
            <div className="md:order-2">
              <img
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&q=80"
                alt="Chef Marcus Veil"
                className="w-full aspect-[3/4] object-cover filter brightness-75"
              />
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="border-t border-[#30363d] pt-24 mb-24">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.4em] uppercase text-[#c0c0c0] mb-4">What We Believe</p>
            <h2 className="text-3xl font-normal text-[#e6edf3]">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#30363d]">
            {[
              {
                number: "01",
                title: "Seasonality",
                text: "We cook what the earth provides today. Not yesterday's delivery, not next week's order. Today."
              },
              {
                number: "02",
                title: "Restraint",
                text: "Every element on the plate earns its place. If it doesn't add, it doesn't appear. Simplicity is the hardest discipline."
              },
              {
                number: "03",
                title: "Presence",
                text: "No televisions. No loud music. No rush. We create space for conversation, for thought, for the meal itself."
              }
            ].map((value) => (
              <div key={value.number} className="bg-[#0d1117] p-10 flex flex-col gap-4">
                <span className="text-xs tracking-[0.3em] text-[#30363d]">{value.number}</span>
                <h3 className="text-lg font-normal text-[#e6edf3]">{value.title}</h3>
                <p className="text-sm text-[#8b949e] leading-relaxed">{value.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-[#8b949e] mb-8 leading-relaxed max-w-md mx-auto">
            We would love to welcome you. Reserve your table and experience Noire for yourself.
          </p>
          <Link
            href="/reservations"
            className="text-xs tracking-[0.3em] uppercase border border-[#c0c0c0] text-[#c0c0c0] px-12 py-4 hover:bg-[#c0c0c0] hover:text-[#0d1117] transition-all duration-300 inline-block"
          >
            Reserve a Table
          </Link>
        </div>

      </div>
    </main>
  );
}