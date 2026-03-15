"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setIsAdmin(false); return; }

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      setIsAdmin(profile?.is_admin || false);
    };

    checkAdmin();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAdmin();
    });

    return () => subscription.unsubscribe();
  }, []);

  const links = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/reservations", label: "Reservations" },
    { href: "/gallery", label: "Gallery" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-[#0d1117]/95 backdrop-blur-sm border-b border-[#30363d]" : "bg-transparent"
    }`}>
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="text-xl tracking-[0.4em] uppercase text-[#e6edf3] font-normal">
          Noire
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs tracking-[0.2em] uppercase transition-colors ${
                pathname === link.href
                  ? "text-[#c0c0c0]"
                  : "text-[#8b949e] hover:text-[#e6edf3]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {isAdmin && (
            <Link
              href="/admin"
              className="hidden md:flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#c0c0c0] hover:text-[#e6edf3] transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#c0c0c0] animate-pulse" />
              Admin
            </Link>
          )}

          <Link
            href="/reservations"
            className="hidden md:block text-xs tracking-[0.2em] uppercase border border-[#c0c0c0] text-[#c0c0c0] px-6 py-2.5 hover:bg-[#c0c0c0] hover:text-[#0d1117] transition-all duration-300"
          >
            Reserve
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={`block w-5 h-0.5 bg-[#e6edf3] transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-[#e6edf3] transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-[#e6edf3] transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>

      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0d1117] border-t border-[#30363d] px-6 py-6 flex flex-col gap-5">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs tracking-[0.2em] uppercase transition-colors ${
                pathname === link.href
                  ? "text-[#c0c0c0]"
                  : "text-[#8b949e] hover:text-[#e6edf3]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className="text-xs tracking-[0.2em] uppercase text-[#c0c0c0] flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#c0c0c0] animate-pulse" />
              Admin
            </Link>
          )}
          <Link
            href="/reservations"
            className="text-xs tracking-[0.2em] uppercase border border-[#c0c0c0] text-[#c0c0c0] px-6 py-2.5 text-center hover:bg-[#c0c0c0] hover:text-[#0d1117] transition-all duration-300 mt-2"
          >
            Reserve a Table
          </Link>
        </div>
      )}
    </nav>
  );
}