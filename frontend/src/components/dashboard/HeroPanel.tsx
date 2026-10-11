import { ArrowRight, Droplets, Waves, Database, ShieldCheck, Activity } from 'lucide-react';
import { GHATS_DATA } from '../../data/ghats';
import { GALLERY_ITEMS } from '../../data/gallery';
import type { GalleryRecord } from '../../types';

interface HeroPanelProps {
  onExploreClick?: () => void;
  onWaterQualityClick?: () => void;
  onOpenLightbox?: (item: GalleryRecord) => void;
  cpcbClass?: string;
}

export function HeroPanel({
  onExploreClick,
  onWaterQualityClick,
  onOpenLightbox,
  cpcbClass = 'B',
}: HeroPanelProps) {
  const highRiskCount = GHATS_DATA.filter((g) => g.risk_tier === 'high').length;
  const uniqueWaterBodies = new Set(GHATS_DATA.map((g) => g.water_body)).size;

  // 3 small authentic previews
  const defaultItem = GALLERY_ITEMS[0] as GalleryRecord;
  const previewItems: Array<{ id: string; label: string; item: GalleryRecord }> = [
    {
      id: 'sampling',
      label: 'Water Sampling',
      item: (GALLERY_ITEMS.find((g) => g.id === 'water-quality-sampling') || GALLERY_ITEMS[4] || defaultItem) as GalleryRecord,
    },
    {
      id: 'ghat',
      label: 'Immersion Steps',
      item: (GALLERY_ITEMS.find((g) => g.id === 'civic-immersion-ghat') || GALLERY_ITEMS[3] || defaultItem) as GalleryRecord,
    },
    {
      id: 'cleanup',
      label: 'Lake Cleanup',
      item: (GALLERY_ITEMS.find((g) => g.id === 'municipal-lake-cleanup') || GALLERY_ITEMS[5] || defaultItem) as GalleryRecord,
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-slate-800 text-white shadow-xl">
      {/* Authentic Panoramic Upper Lake Photographic Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero/bhopal-upper-lake-hero.webp"
          alt="Bhopal Upper Lake Bhojtal water expanse"
          className="w-full h-full object-cover object-center opacity-35 filter brightness-95"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/90 to-[#059669]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent" />
      </div>

      <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Content (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Status Label */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#059669]/70 border border-[#10B981]/40 text-[#10B981] text-xs font-semibold backdrop-blur-xs">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span>ENVIRONMENTAL MONITORING</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 text-xs font-medium">
                <Database className="w-3.5 h-3.5 text-teal-400" />
                <span>Environmental Dataset · 2023–2025</span>
              </div>
            </div>

            {/* Headline and Subtitle */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Visarjan Ghat Environmental Intelligence
              </h1>

              <p className="text-base sm:text-lg font-medium text-[#38BDF8] tracking-tight flex items-center gap-2">
                <Waves className="w-5 h-5 text-teal-400 shrink-0" />
                <span className="italic">From Water Data to Civic Action</span>
              </p>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                Explore water-quality observations, immersion-site rankings, pollution risk indicators, and lake conservation activities across Bhopal’s Upper Lake, Lower Lake, Shahpura Lake, and Hathaikheda Dam.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                type="button"
                onClick={onExploreClick}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#059669] hover:bg-[#059669]/90 text-white font-semibold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02] cursor-pointer"
              >
                <span>Explore Ghat Rankings</span>
                <ArrowRight className="w-4 h-4 text-emerald-200" />
              </button>

              <button
                type="button"
                onClick={onWaterQualityClick}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs sm:text-sm backdrop-blur-xs transition-all cursor-pointer"
              >
                <Droplets className="w-4 h-4 text-teal-300" />
                <span>Water Quality Intelligence</span>
              </button>
            </div>

            {/* Source indicator */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span className="font-medium text-slate-300">CPCB Class {cpcbClass} Evaluation Standard</span>
              <span className="hidden sm:inline text-slate-600">·</span>
              <span>Published MPPCB Official Test Reports</span>
            </div>
          </div>

          {/* Right Analytics Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* 2x2 Metric Grid */}
            <div className="bg-[#0F172A]/90 border border-slate-700 rounded-xl p-4 shadow-xl backdrop-blur-md space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#38BDF8]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Bhopal Immersion Analytics
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-600/50 text-emerald-300">
                  AUDITED
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-medium">Water Bodies</span>
                  <span className="text-lg font-bold text-white font-mono mt-0.5 block">{uniqueWaterBodies} Basins</span>
                  <span className="text-[10px] text-slate-500">Bhojtal & Urban Lakes</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-medium">Immersion Sites</span>
                  <span className="text-lg font-bold text-teal-300 font-mono mt-0.5 block">{GHATS_DATA.length} Ghats</span>
                  <span className="text-[10px] text-slate-500">Designated BMC Points</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-medium">High-Risk Sites</span>
                  <span className="text-lg font-bold text-red-400 font-mono mt-0.5 block">{highRiskCount} Ghats</span>
                  <span className="text-[10px] text-slate-500">Severe DO Depletion</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-medium">Evaluation Standard</span>
                  <span className="text-lg font-bold text-emerald-400 font-mono mt-0.5 block">Class {cpcbClass}</span>
                  <span className="text-[10px] text-slate-500">DO ≥ 5.0 · BOD ≤ 3.0</span>
                </div>
              </div>
            </div>

            {/* 3 Small Authentic Photographic Previews Opening Lightbox */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-400 font-semibold block px-1">
                Authentic Photographic Previews (Click to inspect):
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                {previewItems.map((prev) => (
                  <button
                    key={prev.id}
                    data-glow-card
                    data-glow="cyan"
                    type="button"
                    onClick={() => onOpenLightbox?.(prev.item)}
                    className="group relative rounded-xl overflow-hidden border border-slate-700/80 hover:border-cyan-400 aspect-video bg-slate-900 shadow-md text-left cursor-pointer transition-all duration-200"
                    aria-label={`View high-resolution photograph of ${prev.label}`}
                  >
                    <img
                      src={prev.item.imageUrl}
                      alt={prev.item.alt}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                      <span className="text-[9px] font-bold text-white truncate drop-shadow-sm">
                        {prev.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
