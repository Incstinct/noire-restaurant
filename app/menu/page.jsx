"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const categories = ["All", "Starters", "Mains", "Desserts", "Drinks"];

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq("available", true)
        .order("created_at", { ascending: true });

      if (error) console.error(error);
      else setMenuItems(data);
      setLoading(false);
    };

    fetchMenu();
  }, []);

  const filtered = activeCategory === "All"
    ? menuItems
    : menuItems.filter((item) => item.category === activeCategory);

  return (
    <main className="min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.5em] uppercase text-[#c0c0c0] mb-4">Seasonal</p>
          <h1 className="text-5xl md:text-6xl font-normal text-[#e6edf3] tracking-wide mb-6">
            Our Menu
          </h1>
          <div className="w-16 h-px bg-[#30363d] mx-auto mb-6" />
          <p className="text-[#8b949e] max-w-md mx-auto leading-relaxed">
            Our menu changes with the seasons. Every ingredient is sourced locally and prepared with care.
          </p>
        </div>

        {/* Category filters */}
        <div className="flex gap-2 flex-wrap justify-center mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs tracking-[0.2em] uppercase px-6 py-2.5 transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-[#c0c0c0] text-[#0d1117]"
                  : "border border-[#30363d] text-[#8b949e] hover:border-[#c0c0c0] hover:text-[#e6edf3]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu items */}
        {loading ? (
          <div className="flex flex-col gap-px bg-[#30363d]">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#0d1117] px-6 py-6 animate-pulse">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="h-3 bg-[#161b22] rounded w-1/3 mb-3" />
                    <div className="h-3 bg-[#161b22] rounded w-2/3" />
                  </div>
                  <div className="h-3 bg-[#161b22] rounded w-12 ml-8" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-[#8b949e] text-sm tracking-wide">No items available in this category.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-px bg-[#30363d]">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-[#0d1117] px-6 py-6 hover:bg-[#161b22] transition-colors duration-200 group"
              >
                <div className="flex justify-between items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-[#e6edf3] font-normal tracking-wide">
                        {item.name}
                      </h3>
                      {!item.available && (
                        <span className="text-xs text-[#30363d] tracking-wide">Unavailable</span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-sm text-[#8b949e] leading-relaxed">
                        {item.description}
                      </p>
                    )}
                    <p className="text-xs tracking-[0.2em] uppercase text-[#30363d] mt-2">
                      {item.category}
                    </p>
                  </div>
                  <span className="text-[#c0c0c0] font-normal flex-shrink-0 text-sm">
                    ${item.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}