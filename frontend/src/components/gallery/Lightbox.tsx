import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';
import type { GalleryRecord } from '../../types';

interface LightboxProps {
  item: GalleryRecord | null;
  items: GalleryRecord[];
  onClose: () => void;
  onNavigate: (item: GalleryRecord) => void;
  onViewOnMap?: (lat: number, lng: number) => void;
}

export function Lightbox({ item, items, onClose, onNavigate, onViewOnMap }: LightboxProps) {
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        const currentIndex = items.findIndex((i) => i.id === item.id);
        const prevIndex = (currentIndex - 1 + items.length) % items.length;
        const prev = items[prevIndex];
        if (prev) onNavigate(prev);
      } else if (e.key === 'ArrowRight') {
        const currentIndex = items.findIndex((i) => i.id === item.id);
        const nextIndex = (currentIndex + 1) % items.length;
        const next = items[nextIndex];
        if (next) onNavigate(next);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, items, onClose, onNavigate]);

  if (!item) return null;

  const currentIndex = items.findIndex((i) => i.id === item.id);
  const prevIndex = (currentIndex - 1 + items.length) % items.length;
  const nextIndex = (currentIndex + 1) % items.length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full bg-[#0F172A] rounded-2xl overflow-hidden border border-slate-700 shadow-2xl text-white flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#059669] text-white">
              {item.category}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {currentIndex + 1} of {items.length}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            aria-label="Close high-resolution lightbox"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media Area with Prev/Next Controls */}
        <div className="relative aspect-16/10 w-full overflow-hidden bg-black flex items-center justify-center">
          <img
            src={item.imageUrl}
            alt={item.alt}
            className="w-full h-full object-contain"
          />

          {/* Navigation Arrows */}
          {items[prevIndex] && (
            <button
              type="button"
              onClick={() => onNavigate(items[prevIndex]!)}
              className="absolute left-3 p-2.5 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition-colors cursor-pointer backdrop-blur-xs"
              aria-label="Previous photograph"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {items[nextIndex] && (
            <button
              type="button"
              onClick={() => onNavigate(items[nextIndex]!)}
              className="absolute right-3 p-2.5 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition-colors cursor-pointer backdrop-blur-xs"
              aria-label="Next photograph"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Caption & Metadata Footer */}
        <div className="p-5 sm:p-6 space-y-3 bg-[#0F172A] overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <h3 id="lightbox-title" className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {item.title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-[#38BDF8] mt-0.5">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>{item.location}</span>
                <span className="text-slate-500">·</span>
                <span className="font-mono text-slate-400">
                  {item.latitude.toFixed(4)}°N, {item.longitude.toFixed(4)}°E
                </span>
              </div>
            </div>

            {onViewOnMap && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onViewOnMap(item.latitude, item.longitude);
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#059669] hover:bg-[#059669]/90 text-white text-xs font-semibold transition-colors cursor-pointer shrink-0"
              >
                <span>View on Map</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {item.caption}
          </p>

          {item.inspection_notes && (
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">Inspection Notes:</span>
                <span>{item.inspection_notes}</span>
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Photo Source: <span className="text-slate-300 font-medium">{item.imageSource}</span></span>
            <span className="text-slate-500">Bhopal Municipal Corporation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
