import { useState } from 'react';
import { Camera, MapPin, Maximize2, ExternalLink } from 'lucide-react';
import { GALLERY_ITEMS } from '../../data/gallery';
import { Lightbox } from './Lightbox';
import type { GalleryRecord } from '../../types';

interface PhotoGalleryProps {
  onViewOnMap?: (lat: number, lng: number) => void;
}

export function PhotoGallery({ onViewOnMap }: PhotoGalleryProps) {
  const [selectedItem, setSelectedItem] = useState<GalleryRecord | null>(null);

  return (
    <section className="space-y-4" aria-label="Bhopal Environmental Photography Gallery">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#059669]" />
            <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">
              Bhopal Environmental Photography Gallery
            </h2>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Verified documentary photography across Bhoj Wetland, Kamla Park, Shahpura Lake, and municipal action sites.
          </p>
        </div>
        <span className="text-xs font-mono text-[#64748B] bg-slate-100 px-3 py-1 rounded-full border border-slate-200 self-start sm:self-auto">
          6 Curated Visual Records
        </span>
      </div>

      {/* 3-Column Responsive Grid on Desktop, 2 on Tablet, 1 on Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {GALLERY_ITEMS.map((item) => (
          <article
            key={item.id}
            data-glow-card
            data-glow="cyan"
            className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-2xl hover:border-cyan-400/60 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            onClick={() => setSelectedItem(item)}
          >
            {/* Photographic Header with h-48 ratio */}
            <div
              className="relative h-48 w-full overflow-hidden bg-slate-900 cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              <img
                src={item.imageUrl}
                alt={item.alt}
                loading="lazy"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/85 via-[#0F172A]/20 to-transparent" />

              {/* Category Badge top left */}
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/95 text-[#0F172A] shadow-xs">
                  {item.category}
                </span>
              </div>

              {/* Expand Icon top right */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedItem(item);
                }}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition-colors cursor-pointer backdrop-blur-xs"
                aria-label={`Open full inspection view for ${item.title}`}
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Location & Title over gradient */}
              <div className="absolute bottom-2.5 left-3 right-3 text-white">
                <div className="flex items-center gap-1 text-[11px] text-[#38BDF8] font-semibold mb-0.5">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>
                <h3 className="text-sm font-bold text-white tracking-tight line-clamp-1">
                  {item.title}
                </h3>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <p className="text-xs text-[#64748B] leading-relaxed line-clamp-3">
                {item.caption}
              </p>

              <div className="pt-2 border-t border-[#E2E8F0] space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 truncate max-w-[190px]">
                    Source: {item.imageSource}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedItem(item)}
                    className="inline-flex items-center gap-1 font-semibold text-[#059669] hover:text-[#0F172A] transition-colors cursor-pointer"
                  >
                    <span>View Inspection</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        item={selectedItem}
        items={GALLERY_ITEMS}
        onClose={() => setSelectedItem(null)}
        onNavigate={(item) => setSelectedItem(item)}
        onViewOnMap={onViewOnMap}
      />
    </section>
  );
}
