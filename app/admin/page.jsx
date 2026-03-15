"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Admin() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("menu");
  const [menuItems, setMenuItems] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [modRequests, setModRequests] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [menuForm, setMenuForm] = useState({
    name: "", description: "", price: "", category: "Starters", available: true
  });

  const [galleryForm, setGalleryForm] = useState({
    src: "", alt: "", size: "small"
  });

  const categories = ["Starters", "Mains", "Desserts", "Drinks"];

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (!profile?.is_admin) { router.push("/"); return; }

      setLoading(false);
      fetchAll();
    };

    checkAdmin();
  }, []);

  const fetchAll = async () => {
    const [menu, res, msg, gal, mod] = await Promise.all([
      supabase.from("menu_items").select("*").order("created_at", { ascending: true }),
      supabase.from("reservations").select("*").order("created_at", { ascending: false }),
      supabase.from("messages").select("*").order("created_at", { ascending: false }),
      supabase.from("gallery").select("*").order("created_at", { ascending: true }),
      supabase.from("modification_requests").select("*").order("created_at", { ascending: false }),
    ]);

    setMenuItems(menu.data || []);
    setReservations(res.data || []);
    setMessages(msg.data || []);
    setGallery(gal.data || []);
    setModRequests(mod.data || []);
  };

  const resetMenuForm = () => {
    setEditingId(null);
    setMenuForm({ name: "", description: "", price: "", category: "Starters", available: true });
    setError(null);
    setSuccess(null);
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    if (!menuForm.name || !menuForm.price) {
      setError("Name and price are required.");
      setSaving(false);
      return;
    }

    const payload = {
      name: menuForm.name,
      description: menuForm.description,
      price: Number(menuForm.price),
      category: menuForm.category,
      available: menuForm.available,
    };

    if (editingId) {
      const { error } = await supabase.from("menu_items").update(payload).eq("id", editingId);
      if (error) setError(error.message);
      else { setSuccess("Item updated."); resetMenuForm(); fetchAll(); }
    } else {
      const { error } = await supabase.from("menu_items").insert([payload]);
      if (error) setError(error.message);
      else { setSuccess("Item added."); resetMenuForm(); fetchAll(); }
    }
    setSaving(false);
  };

  const handleMenuEdit = (item) => {
    setEditingId(item.id);
    setMenuForm({
      name: item.name,
      description: item.description || "",
      price: item.price,
      category: item.category,
      available: item.available,
    });
    setError(null);
    setSuccess(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMenuDelete = async (id) => {
    if (!confirm("Delete this menu item?")) return;
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) setError(error.message);
    else fetchAll();
  };

  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    if (!galleryForm.src) {
      setError("Image URL is required.");
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("gallery").insert([{
      src: galleryForm.src,
      alt: galleryForm.alt,
      size: galleryForm.size,
    }]);

    if (error) setError(error.message);
    else {
      setSuccess("Image added.");
      setGalleryForm({ src: "", alt: "", size: "small" });
      fetchAll();
    }
    setSaving(false);
  };

  const handleGalleryDelete = async (id) => {
    if (!confirm("Delete this image?")) return;
    const { error } = await supabase.from("gallery").delete().eq("id", id);
    if (error) setError(error.message);
    else fetchAll();
  };

  const handleReservationStatus = async (id, status) => {
    await supabase.from("reservations").update({ status }).eq("id", id);
    fetchAll();
  };

  const handleModStatus = async (id, status) => {
    await supabase.from("modification_requests").update({ status }).eq("id", id);
    fetchAll();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <p className="text-[#30363d] text-sm animate-pulse tracking-widest uppercase">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] pt-24 pb-24">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs tracking-[0.4em] uppercase text-[#30363d] mb-1">Noire</p>
            <h1 className="text-4xl font-normal text-[#e6edf3]">Admin</h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs tracking-[0.2em] uppercase text-[#30363d] hover:text-[#e6edf3] transition-colors"
          >
            Sign Out
          </button>
        </div>

        <div className="w-full h-px bg-[#30363d] mb-12" />

        {/* Tabs */}
        <div className="flex gap-8 mb-12 border-b border-[#30363d] overflow-x-auto scrollbar-none">
          {[
            { id: "menu", label: "Menu" },
            { id: "reservations", label: `Reservations ${reservations.length > 0 ? `(${reservations.length})` : ""}` },
            { id: "modifications", label: `Modifications ${modRequests.length > 0 ? `(${modRequests.length})` : ""}` },
            { id: "messages", label: `Messages ${messages.length > 0 ? `(${messages.length})` : ""}` },
            { id: "gallery", label: "Gallery" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setError(null); setSuccess(null); }}
              className={`text-xs tracking-[0.2em] uppercase pb-4 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "text-[#c0c0c0] border-b-2 border-[#c0c0c0]"
                  : "text-[#30363d] hover:text-[#8b949e]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Menu Tab */}
        {activeTab === "menu" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-sm tracking-[0.2em] uppercase text-[#8b949e] mb-8">
                {editingId ? "Edit Item" : "Add Item"}
              </h2>
              <form onSubmit={handleMenuSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="text-xs tracking-[0.2em] uppercase text-[#30363d] mb-2 block">Name</label>
                  <input
                    type="text"
                    value={menuForm.name}
                    onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                    className="w-full bg-[#161b22] border border-[#30363d] px-4 py-3 text-sm text-[#e6edf3] focus:outline-none focus:border-[#c0c0c0] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs tracking-[0.2em] uppercase text-[#30363d] mb-2 block">Description</label>
                  <textarea
                    value={menuForm.description}
                    onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                    rows={3}
                    className="w-full bg-[#161b22] border border-[#30363d] px-4 py-3 text-sm text-[#e6edf3] focus:outline-none focus:border-[#c0c0c0] transition-colors resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs tracking-[0.2em] uppercase text-[#30363d] mb-2 block">Price ($)</label>
                    <input
                      type="number"
                      value={menuForm.price}
                      onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })}
                      className="w-full bg-[#161b22] border border-[#30363d] px-4 py-3 text-sm text-[#e6edf3] focus:outline-none focus:border-[#c0c0c0] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs tracking-[0.2em] uppercase text-[#30363d] mb-2 block">Category</label>
                    <div className="relative">
                      <select
                        value={menuForm.category}
                        onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })}
                        className="appearance-none w-full bg-[#161b22] border border-[#30363d] px-4 py-3 text-sm text-[#e6edf3] focus:outline-none focus:border-[#c0c0c0] transition-colors cursor-pointer"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b949e] pointer-events-none text-xs">▾</span>
                    </div>
                  </div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={menuForm.available}
                    onChange={(e) => setMenuForm({ ...menuForm, available: e.target.checked })}
                    className="w-3 h-3 accent-[#c0c0c0]"
                  />
                  <span className="text-xs tracking-[0.2em] uppercase text-[#8b949e]">Available</span>
                </label>
                {error && <p className="text-red-400 text-xs">{error}</p>}
                {success && <p className="text-[#c0c0c0] text-xs">{success}</p>}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className={`px-8 py-3 text-xs tracking-[0.2em] uppercase transition-all duration-300 ${
                      saving ? "bg-[#30363d] text-[#8b949e] cursor-not-allowed" : "bg-[#c0c0c0] text-[#0d1117] hover:bg-[#e6edf3]"
                    }`}
                  >
                    {saving ? "Saving..." : editingId ? "Update" : "Add Item"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetMenuForm}
                      className="px-8 py-3 text-xs tracking-[0.2em] uppercase border border-[#30363d] text-[#8b949e] hover:border-[#c0c0c0] hover:text-[#e6edf3] transition-all duration-300"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div>
              <h2 className="text-sm tracking-[0.2em] uppercase text-[#8b949e] mb-8">
                All Items ({menuItems.length})
              </h2>
              <div className="flex flex-col gap-px bg-[#30363d]">
                {menuItems.length === 0 ? (
                  <div className="bg-[#0d1117] px-6 py-8 text-center">
                    <p className="text-[#30363d] text-xs tracking-wide">No items yet.</p>
                  </div>
                ) : (
                  menuItems.map((item) => (
                    <div key={item.id} className="bg-[#0d1117] px-4 py-4 flex items-center justify-between hover:bg-[#161b22] transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#e6edf3] truncate">{item.name}</p>
                        <p className="text-xs text-[#30363d]">{item.category} — ${item.price} {!item.available && "· Unavailable"}</p>
                      </div>
                      <div className="flex gap-4 flex-shrink-0 ml-4">
                        <button
                          onClick={() => handleMenuEdit(item)}
                          className="text-xs text-[#30363d] hover:text-[#c0c0c0] transition-colors uppercase tracking-wide"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleMenuDelete(item.id)}
                          className="text-xs text-[#30363d] hover:text-red-400 transition-colors uppercase tracking-wide"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Reservations Tab */}
        {activeTab === "reservations" && (
          <div className="flex flex-col gap-px bg-[#30363d]">
            {reservations.length === 0 ? (
              <div className="bg-[#0d1117] px-6 py-12 text-center">
                <p className="text-[#30363d] text-xs tracking-wide">No reservations yet.</p>
              </div>
            ) : (
              reservations.map((res) => (
                <div key={res.id} className="bg-[#0d1117] px-6 py-5 hover:bg-[#161b22] transition-colors">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <p className="text-sm text-[#e6edf3] mb-1">{res.name}</p>
                      <p className="text-xs text-[#8b949e]">{res.email} {res.phone && `· ${res.phone}`}</p>
                      {res.notes && <p className="text-xs text-[#30363d] mt-2 italic">{res.notes}</p>}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm text-[#c0c0c0]">{res.date} · {res.time}</p>
                      <p className="text-xs text-[#8b949e] mt-1">{res.guests} {res.guests === 1 ? "guest" : "guests"}</p>
                      <span className={`text-xs tracking-wide uppercase mt-1 block ${
                        res.status === "confirmed" ? "text-green-400" :
                        res.status === "cancelled" ? "text-red-400" :
                        "text-[#c0c0c0]"
                      }`}>
                        {res.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleReservationStatus(res.id, "confirmed")}
                      className={`text-xs tracking-[0.15em] uppercase px-4 py-2 border transition-all duration-200 ${
                        res.status === "confirmed"
                          ? "border-green-400 text-green-400 cursor-default"
                          : "border-[#30363d] text-[#8b949e] hover:border-green-400 hover:text-green-400"
                      }`}
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleReservationStatus(res.id, "cancelled")}
                      className={`text-xs tracking-[0.15em] uppercase px-4 py-2 border transition-all duration-200 ${
                        res.status === "cancelled"
                          ? "border-red-400 text-red-400 cursor-default"
                          : "border-[#30363d] text-[#8b949e] hover:border-red-400 hover:text-red-400"
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleReservationStatus(res.id, "pending")}
                      className="text-xs tracking-[0.15em] uppercase px-4 py-2 border border-[#30363d] text-[#8b949e] hover:border-[#c0c0c0] hover:text-[#e6edf3] transition-all duration-200"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Modifications Tab */}
        {activeTab === "modifications" && (
          <div className="flex flex-col gap-px bg-[#30363d]">
            {modRequests.length === 0 ? (
              <div className="bg-[#0d1117] px-6 py-12 text-center">
                <p className="text-[#30363d] text-xs tracking-wide">No modification requests yet.</p>
              </div>
            ) : (
              modRequests.map((mod) => (
                <div key={mod.id} className="bg-[#0d1117] px-6 py-5 hover:bg-[#161b22] transition-colors">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <p className="text-sm text-[#e6edf3] mb-1">{mod.name}</p>
                      <p className="text-xs text-[#8b949e]">{mod.email}</p>
                      <div className="mt-2 flex flex-col gap-1">
                        {mod.requested_date && (
                          <p className="text-xs text-[#8b949e]">New date: <span className="text-[#c0c0c0]">{mod.requested_date}</span></p>
                        )}
                        {mod.requested_time && (
                          <p className="text-xs text-[#8b949e]">New time: <span className="text-[#c0c0c0]">{mod.requested_time}</span></p>
                        )}
                        {mod.requested_guests && (
                          <p className="text-xs text-[#8b949e]">New guests: <span className="text-[#c0c0c0]">{mod.requested_guests}</span></p>
                        )}
                        {mod.notes && (
                          <p className="text-xs text-[#30363d] italic mt-1">{mod.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-[#30363d]">{new Date(mod.created_at).toLocaleDateString()}</p>
                      <span className={`text-xs tracking-wide uppercase mt-1 block ${
                        mod.status === "confirmed" ? "text-green-400" :
                        mod.status === "cancelled" ? "text-red-400" :
                        "text-[#c0c0c0]"
                      }`}>
                        {mod.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleModStatus(mod.id, "confirmed")}
                      className={`text-xs tracking-[0.15em] uppercase px-4 py-2 border transition-all duration-200 ${
                        mod.status === "confirmed"
                          ? "border-green-400 text-green-400 cursor-default"
                          : "border-[#30363d] text-[#8b949e] hover:border-green-400 hover:text-green-400"
                      }`}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleModStatus(mod.id, "cancelled")}
                      className={`text-xs tracking-[0.15em] uppercase px-4 py-2 border transition-all duration-200 ${
                        mod.status === "cancelled"
                          ? "border-red-400 text-red-400 cursor-default"
                          : "border-[#30363d] text-[#8b949e] hover:border-red-400 hover:text-red-400"
                      }`}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === "messages" && (
          <div className="flex flex-col gap-px bg-[#30363d]">
            {messages.length === 0 ? (
              <div className="bg-[#0d1117] px-6 py-12 text-center">
                <p className="text-[#30363d] text-xs tracking-wide">No messages yet.</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="bg-[#0d1117] px-6 py-5 hover:bg-[#161b22] transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm text-[#e6edf3]">{msg.name}</p>
                      <p className="text-xs text-[#8b949e]">{msg.email}</p>
                    </div>
                    <p className="text-xs text-[#30363d]">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm text-[#8b949e] leading-relaxed">{msg.message}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === "gallery" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-sm tracking-[0.2em] uppercase text-[#8b949e] mb-8">Add Image</h2>
              <form onSubmit={handleGallerySubmit} className="flex flex-col gap-5">
                <div>
                  <label className="text-xs tracking-[0.2em] uppercase text-[#30363d] mb-2 block">Image URL</label>
                  <input
                    type="text"
                    value={galleryForm.src}
                    onChange={(e) => setGalleryForm({ ...galleryForm, src: e.target.value })}
                    className="w-full bg-[#161b22] border border-[#30363d] px-4 py-3 text-sm text-[#e6edf3] focus:outline-none focus:border-[#c0c0c0] transition-colors"
                    placeholder="https://images.unsplash.com/..."
                  />
                  {galleryForm.src && (
                    <img src={galleryForm.src} alt="preview" className="mt-2 h-24 w-24 object-cover border border-[#30363d]" />
                  )}
                </div>
                <div>
                  <label className="text-xs tracking-[0.2em] uppercase text-[#30363d] mb-2 block">Alt Text</label>
                  <input
                    type="text"
                    value={galleryForm.alt}
                    onChange={(e) => setGalleryForm({ ...galleryForm, alt: e.target.value })}
                    className="w-full bg-[#161b22] border border-[#30363d] px-4 py-3 text-sm text-[#e6edf3] focus:outline-none focus:border-[#c0c0c0] transition-colors"
                    placeholder="Description of image"
                  />
                </div>
                <div>
                  <label className="text-xs tracking-[0.2em] uppercase text-[#30363d] mb-2 block">Size</label>
                  <div className="relative">
                    <select
                      value={galleryForm.size}
                      onChange={(e) => setGalleryForm({ ...galleryForm, size: e.target.value })}
                      className="appearance-none w-full bg-[#161b22] border border-[#30363d] px-4 py-3 text-sm text-[#e6edf3] focus:outline-none focus:border-[#c0c0c0] transition-colors cursor-pointer"
                    >
                      <option value="small">Small</option>
                      <option value="large">Large</option>
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b949e] pointer-events-none text-xs">▾</span>
                  </div>
                </div>
                {error && <p className="text-red-400 text-xs">{error}</p>}
                {success && <p className="text-[#c0c0c0] text-xs">{success}</p>}
                <button
                  type="submit"
                  disabled={saving}
                  className={`px-8 py-3 text-xs tracking-[0.2em] uppercase transition-all duration-300 w-fit ${
                    saving ? "bg-[#30363d] text-[#8b949e] cursor-not-allowed" : "bg-[#c0c0c0] text-[#0d1117] hover:bg-[#e6edf3]"
                  }`}
                >
                  {saving ? "Saving..." : "Add Image"}
                </button>
              </form>
            </div>
            <div>
              <h2 className="text-sm tracking-[0.2em] uppercase text-[#8b949e] mb-8">
                All Images ({gallery.length})
              </h2>
              <div className="flex flex-col gap-3">
                {gallery.map((img) => (
                  <div key={img.id} className="flex items-center gap-4 p-3 border border-[#30363d] hover:border-[#c0c0c0] transition-colors">
                    <img src={img.src} alt={img.alt} className="w-12 h-12 object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#8b949e] truncate">{img.alt || "No description"}</p>
                      <p className="text-xs text-[#30363d]">{img.size}</p>
                    </div>
                    <button
                      onClick={() => handleGalleryDelete(img.id)}
                      className="text-xs text-[#30363d] hover:text-red-400 transition-colors uppercase tracking-wide flex-shrink-0"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}