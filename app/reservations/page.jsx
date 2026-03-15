"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Reservations() {
  const [activeTab, setActiveTab] = useState("new");
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    date: "", time: "", guests: "2", notes: "",
  });
  const [modForm, setModForm] = useState({
    name: "", email: "",
    requested_date: "", requested_time: "",
    requested_guests: "2", notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [modSuccess, setModSuccess] = useState(false);
  const [error, setError] = useState(null);

  const timeSlots = [
    "18:00", "18:30", "19:00", "19:30",
    "20:00", "20:30", "21:00", "21:30",
  ];

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleModChange = (e) => setModForm({ ...modForm, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!form.name || !form.email || !form.date || !form.time || !form.guests) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("reservations").insert([{
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      date: form.date,
      time: form.time,
      guests: Number(form.guests),
      notes: form.notes.trim(),
      status: "pending",
    }]);

    if (error) {
      setError("Something went wrong. Please try again.");
    } else {
      setSuccess(true);
      setForm({ name: "", email: "", phone: "", date: "", time: "", guests: "2", notes: "" });
    }
    setLoading(false);
  };

  const handleModSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!modForm.name || !modForm.email) {
      setError("Name and email are required.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("modification_requests").insert([{
      name: modForm.name.trim(),
      email: modForm.email.trim(),
      requested_date: modForm.requested_date || null,
      requested_time: modForm.requested_time || null,
      requested_guests: Number(modForm.requested_guests),
      notes: modForm.notes.trim(),
      status: "pending",
    }]);

    if (error) {
      setError("Something went wrong. Please try again.");
    } else {
      setModSuccess(true);
      setModForm({ name: "", email: "", requested_date: "", requested_time: "", requested_guests: "2", notes: "" });
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.5em] uppercase text-[#c0c0c0] mb-4">Join Us</p>
          <h1 className="text-5xl md:text-6xl font-normal text-[#e6edf3] tracking-wide mb-6">
            Reserve
          </h1>
          <div className="w-16 h-px bg-[#30363d] mx-auto mb-6" />
          <p className="text-[#8b949e] max-w-md mx-auto leading-relaxed">
            We welcome a limited number of guests each evening. Reservations are recommended at least 48 hours in advance.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 mb-12 border-b border-[#30363d]">
          {[
            { id: "new", label: "New Reservation" },
            { id: "modify", label: "Modify Reservation" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setError(null); }}
              className={`text-xs tracking-[0.2em] uppercase pb-4 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-[#c0c0c0] border-b-2 border-[#c0c0c0]"
                  : "text-[#30363d] hover:text-[#8b949e]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* New Reservation */}
        {activeTab === "new" && (
          <>
            {success ? (
              <div className="border border-[#30363d] p-12 text-center">
                <div className="w-12 h-px bg-[#c0c0c0] mx-auto mb-8" />
                <h2 className="text-2xl font-normal text-[#e6edf3] mb-4">
                  Reservation Received
                </h2>
                <p className="text-[#8b949e] leading-relaxed mb-8">
                  Thank you. We will confirm your reservation within 24 hours via email.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="text-xs tracking-[0.3em] uppercase border border-[#30363d] text-[#8b949e] px-8 py-3 hover:border-[#c0c0c0] hover:text-[#e6edf3] transition-all duration-300"
                >
                  Make Another Reservation
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs tracking-[0.2em] uppercase text-[#8b949e] mb-2 block">
                      Full Name <span className="text-[#c0c0c0]">*</span>
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
                      Email <span className="text-[#c0c0c0]">*</span>
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs tracking-[0.2em] uppercase text-[#8b949e] mb-2 block">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full bg-[#161b22] border border-[#30363d] px-4 py-3 text-sm text-[#e6edf3] placeholder-[#30363d] focus:outline-none focus:border-[#c0c0c0] transition-colors"
                      placeholder="+48 123 456 789"
                    />
                  </div>
                  <div>
                    <label className="text-xs tracking-[0.2em] uppercase text-[#8b949e] mb-2 block">
                      Guests <span className="text-[#c0c0c0]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="guests"
                        value={form.guests}
                        onChange={handleChange}
                        className="appearance-none w-full bg-[#161b22] border border-[#30363d] px-4 py-3 text-sm text-[#e6edf3] focus:outline-none focus:border-[#c0c0c0] transition-colors cursor-pointer"
                      >
                        {[1,2,3,4,5,6,7,8].map((n) => (
                          <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>
                        ))}
                      </select>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b949e] pointer-events-none text-xs">▾</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs tracking-[0.2em] uppercase text-[#8b949e] mb-2 block">
                    Date <span className="text-[#c0c0c0]">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full bg-[#161b22] border border-[#30363d] px-4 py-3 text-sm text-[#e6edf3] focus:outline-none focus:border-[#c0c0c0] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs tracking-[0.2em] uppercase text-[#8b949e] mb-3 block">
                    Time <span className="text-[#c0c0c0]">*</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setForm({ ...form, time: slot })}
                        className={`py-2.5 text-xs tracking-wide border transition-all duration-200 ${
                          form.time === slot
                            ? "bg-[#c0c0c0] text-[#0d1117] border-[#c0c0c0]"
                            : "border-[#30363d] text-[#8b949e] hover:border-[#c0c0c0] hover:text-[#e6edf3]"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs tracking-[0.2em] uppercase text-[#8b949e] mb-2 block">
                    Special Requests
                  </label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full bg-[#161b22] border border-[#30363d] px-4 py-3 text-sm text-[#e6edf3] placeholder-[#30363d] focus:outline-none focus:border-[#c0c0c0] transition-colors resize-none"
                    placeholder="Allergies, celebrations, seating preferences..."
                  />
                </div>

                {error && <p className="text-red-400 text-xs tracking-wide">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 text-xs tracking-[0.3em] uppercase transition-all duration-300 ${
                    loading
                      ? "bg-[#30363d] text-[#8b949e] cursor-not-allowed"
                      : "bg-[#c0c0c0] text-[#0d1117] hover:bg-[#e6edf3]"
                  }`}
                >
                  {loading ? "Submitting..." : "Request Reservation"}
                </button>

                <p className="text-xs text-[#30363d] text-center tracking-wide">
                  We will confirm your reservation within 24 hours.
                </p>

              </form>
            )}
          </>
        )}

        {/* Modify Reservation */}
        {activeTab === "modify" && (
          <>
            {modSuccess ? (
              <div className="border border-[#30363d] p-12 text-center">
                <div className="w-12 h-px bg-[#c0c0c0] mx-auto mb-8" />
                <h2 className="text-2xl font-normal text-[#e6edf3] mb-4">
                  Request Received
                </h2>
                <p className="text-[#8b949e] leading-relaxed mb-8">
                  We have received your modification request and will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setModSuccess(false)}
                  className="text-xs tracking-[0.3em] uppercase border border-[#30363d] text-[#8b949e] px-8 py-3 hover:border-[#c0c0c0] hover:text-[#e6edf3] transition-all duration-300"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleModSubmit} className="flex flex-col gap-6">

                <div className="border border-[#30363d] px-6 py-4 mb-2">
                  <p className="text-xs text-[#8b949e] leading-relaxed">
                    To modify an existing reservation please provide your name and email used when booking, along with the changes you would like to make. We will contact you to confirm.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs tracking-[0.2em] uppercase text-[#8b949e] mb-2 block">
                      Full Name <span className="text-[#c0c0c0]">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={modForm.name}
                      onChange={handleModChange}
                      className="w-full bg-[#161b22] border border-[#30363d] px-4 py-3 text-sm text-[#e6edf3] placeholder-[#30363d] focus:outline-none focus:border-[#c0c0c0] transition-colors"
                      placeholder="Name used when booking"
                    />
                  </div>
                  <div>
                    <label className="text-xs tracking-[0.2em] uppercase text-[#8b949e] mb-2 block">
                      Email <span className="text-[#c0c0c0]">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={modForm.email}
                      onChange={handleModChange}
                      className="w-full bg-[#161b22] border border-[#30363d] px-4 py-3 text-sm text-[#e6edf3] placeholder-[#30363d] focus:outline-none focus:border-[#c0c0c0] transition-colors"
                      placeholder="Email used when booking"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs tracking-[0.2em] uppercase text-[#8b949e] mb-2 block">
                      New Date
                    </label>
                    <input
                      type="date"
                      name="requested_date"
                      value={modForm.requested_date}
                      onChange={handleModChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full bg-[#161b22] border border-[#30363d] px-4 py-3 text-sm text-[#e6edf3] focus:outline-none focus:border-[#c0c0c0] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs tracking-[0.2em] uppercase text-[#8b949e] mb-2 block">
                      New Guests
                    </label>
                    <div className="relative">
                      <select
                        name="requested_guests"
                        value={modForm.requested_guests}
                        onChange={handleModChange}
                        className="appearance-none w-full bg-[#161b22] border border-[#30363d] px-4 py-3 text-sm text-[#e6edf3] focus:outline-none focus:border-[#c0c0c0] transition-colors cursor-pointer"
                      >
                        {[1,2,3,4,5,6,7,8].map((n) => (
                          <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>
                        ))}
                      </select>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b949e] pointer-events-none text-xs">▾</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs tracking-[0.2em] uppercase text-[#8b949e] mb-3 block">
                    New Time
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setModForm({ ...modForm, requested_time: slot })}
                        className={`py-2.5 text-xs tracking-wide border transition-all duration-200 ${
                          modForm.requested_time === slot
                            ? "bg-[#c0c0c0] text-[#0d1117] border-[#c0c0c0]"
                            : "border-[#30363d] text-[#8b949e] hover:border-[#c0c0c0] hover:text-[#e6edf3]"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs tracking-[0.2em] uppercase text-[#8b949e] mb-2 block">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={modForm.notes}
                    onChange={handleModChange}
                    rows={3}
                    className="w-full bg-[#161b22] border border-[#30363d] px-4 py-3 text-sm text-[#e6edf3] placeholder-[#30363d] focus:outline-none focus:border-[#c0c0c0] transition-colors resize-none"
                    placeholder="Describe what you would like to change..."
                  />
                </div>

                {error && <p className="text-red-400 text-xs tracking-wide">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 text-xs tracking-[0.3em] uppercase transition-all duration-300 ${
                    loading
                      ? "bg-[#30363d] text-[#8b949e] cursor-not-allowed"
                      : "bg-[#c0c0c0] text-[#0d1117] hover:bg-[#e6edf3]"
                  }`}
                >
                  {loading ? "Submitting..." : "Submit Modification Request"}
                </button>

              </form>
            )}
          </>
        )}

      </div>
    </main>
  );
}