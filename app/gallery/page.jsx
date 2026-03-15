"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) console.error(error);
      else setImages(data);
      setLoading(false);
    };

    fetchImages();
  }, []);

  // Split images into 3 columns for masonry
  const col1 = images.filter((_, i) => i % 3 === 0);
  const col2 = images.filter((_, i) => i % 3 === 1);
  const col3 = images.filter((_, i) => i % 3 === 2);

  const ImageCard = ({ image }) => (
    <div
        onClick={() => setSelected(image)}
        className="relative overflow-hidden cursor-pointer group bg-[#161b22] mb-2 aspect-square"
    >
        <img
        src={image.src}
        alt={image.alt}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-75 group-hover:brightness-90"
        />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <span className="text-xs tracking-[0.3em] uppercase text-white">View</span>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.5em] uppercase text-[#c0c0c0] mb-4">Visual</p>
          <h1 className="text-5xl md:text-6xl font-normal text-[#e6edf3] tracking-wide mb-6">
            Gallery
          </h1>
          <div className="w-16 h-px bg-[#30363d] mx-auto" />
        </div>

        {/* Loading skeleton */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-[#161b22] animate-pulse"
                style={{ aspectRatio: "1/1" }}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 items-start">
            {/* Column 1 */}
            <div className="flex flex-col gap-2">
              {col1.map((image) => <ImageCard key={image.id} image={image} />)}
            </div>
            {/* Column 2 */}
            <div className="flex flex-col gap-2">
              {col2.map((image) => <ImageCard key={image.id} image={image} />)}
            </div>
            {/* Column 3 */}
            <div className="flex flex-col gap-2">
              {col3.map((image) => <ImageCard key={image.id} image={image} />)}
            </div>
          </div>
        )}

      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-6"
          onClick={() => setSelected(null)}
        >
          <button
            className="absolute top-6 right-6 text-[#8b949e] hover:text-[#e6edf3] transition-colors text-xs tracking-[0.3em] uppercase"
            onClick={() => setSelected(null)}
          >
            Close
          </button>
          <img
            src={selected.src}
            alt={selected.alt}
            className="max-w-full max-h-[85vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

    </main>
  );
}