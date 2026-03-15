"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) router.push("/admin");
    };
    checkSession();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/admin");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">

        <div className="text-center mb-12">
          <p className="text-xl tracking-[0.4em] uppercase text-[#e6edf3] mb-2">Noire</p>
          <p className="text-xs tracking-[0.3em] uppercase text-[#30363d]">Admin Access</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-[#161b22] border border-[#30363d] px-4 py-3 text-sm text-[#e6edf3] placeholder-[#30363d] focus:outline-none focus:border-[#c0c0c0] transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs tracking-wide">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 text-xs tracking-[0.3em] uppercase transition-all duration-300 mt-2 ${
              loading
                ? "bg-[#30363d] text-[#8b949e] cursor-not-allowed"
                : "bg-[#c0c0c0] text-[#0d1117] hover:bg-[#e6edf3]"
            }`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

      </div>
    </main>
  );
}