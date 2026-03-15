"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import Link from "next/link";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const email = "hello@noire.pl";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!form.name || !form.email || !form.message) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("messages")
      .insert([{
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      }]);

    if (error) {
      setError("Something went wrong. Please try again.");
    } else {
      setSuccess(true);
      setForm({ name: "", email: "", message: "" });
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.5em] uppercase text-[#c0c0c0] mb-4">Get in Touch</p>
          <h1 className="text-5xl md:text-6xl font-normal text-[#e6edf3] tracking-wide mb-6">
            Contact
          </h1>
          <div className="w-16 h-px bg-[#30363d] mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

          {/* Left — info */}
          <div className="flex flex-col gap-12">

            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-[#30363d] mb-4">Location</p>
              <p className="text-[#8b949e] leading-relaxed">
                ul. Nowy Świat 12
                <br />
                00-400 Warsaw, Poland
              </p>
            </div>

            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-[#30363d] mb-4">Hours</p>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between max-w-xs">
                  <span className="text-[#8b949e] text-sm">Tuesday — Friday</span>
                  <span className="text-[#e6edf3] text-sm">18:00 — 23:00</span>
                </div>
                <div className="flex justify-between max-w-xs">
                  <span className="text-[#8b949e] text-sm">Saturday — Sunday</span>
                  <span className="text-[#e6edf3] text-sm">17:00 — 23:00</span>
                </div>
                <div className="flex justify-between max-w-xs">
                  <span className="text-[#8b949e] text-sm">Monday</span>
                  <span className="text-[#e6edf3] text-sm">Closed</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-[#30363d] mb-4">Reach Us</p>
              <div className="flex flex-col gap-2">
                <a
                  href="tel:+48123456789"
                  className="text-[#8b949e] hover:text-[#e6edf3] transition-colors text-sm"
                >
                  +48 123 456 789
                </a>
                <a
                  href={`mailto:${email}`}
                  className="text-[#8b949e] hover:text-[#e6edf3] transition-colors text-sm"
                >
                  {email}
                </a>
              </div>
            </div>

            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-[#30363d] mb-4">Reservations</p>
              <p className="text-[#8b949e] text-sm leading-relaxed mb-4">
                For reservations we recommend booking at least 48 hours in advance.
              </p>
              <Link
                href="/reservations"
                className="text-xs tracking-[0.3em] uppercase border border-[#30363d] text-[#8b949e] px-6 py-3 hover:border-[#c0c0c0] hover:text-[#e6edf3] transition-all duration-300 inline-block"
              >
                Reserve a Table
              </Link>
            </div>

          </div>

          {/* Right — form */}
          <div>
            {success ? (
              <div className="border border-[#30363d] p-12 text-center h-full flex flex-col items-center justify-center gap-6">
                <div className="w-12 h-px bg-[#c0c0c0]" />
                <h2 className="text-2xl font-normal text-[#e6edf3]">Message Sent</h2>
                <p className="text-[#8b949e] leading-relaxed">
                  Thank you for reaching out. We will get back to you shortly.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="text-xs tracking-[0.3em] uppercase border border-[#30363d] text-[#8b949e] px-8 py-3 hover:border-[#c0c0c0] hover:text-[#e6edf3] transition-all duration-300"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                  <label className="text-xs tracking-[0.2em] uppercase text-[#8b949e] mb-2 block">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full bg-[#161b22] border border-[#30363d] px-4 py-3 text-sm text-[#e6edf3] placeholder-[#30363d] focus:outline-none focus:border-[#c0c0c0] transition-colors"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="text-xs tracking-[0.2em] uppercase text-[#8b949e] mb-2 block">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-[#161b22] border border-[#30363d] px-4 py-3 text-sm text-[#e6edf3] placeholder-[#30363d] focus:outline-none focus:border-[#c0c0c0] transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="text-xs tracking-[0.2em] uppercase text-[#8b949e] mb-2 block">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full bg-[#161b22] border border-[#30363d] px-4 py-3 text-sm text-[#e6edf3] placeholder-[#30363d] focus:outline-none focus:border-[#c0c0c0] transition-colors resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-xs tracking-wide">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 text-xs tracking-[0.3em] uppercase transition-all duration-300 ${
                    loading
                      ? "bg-[#30363d] text-[#8b949e] cursor-not-allowed"
                      : "bg-[#c0c0c0] text-[#0d1117] hover:bg-[#e6edf3]"
                  }`}
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}