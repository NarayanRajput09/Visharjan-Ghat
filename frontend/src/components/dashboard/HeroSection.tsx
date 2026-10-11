import { useTranslation } from 'react-i18next';
import { ArrowRight, Database, ShieldAlert, Droplets, Waves, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from '../ImageWithFallback';

interface HeroSectionProps {
  onExploreClick?: () => void;
}

export function HeroSection({ onExploreClick }: HeroSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden rounded-2xl bg-[#0B1220] border border-slate-800 text-white shadow-xl">
      {/* Full-width Panoramic Bhopal Upper Lake Photograph */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="/images/hero/bhopal-upper-lake-hero.webp"
          alt="Bhopal Upper Lake scenic water expanse"
          className="w-full h-full object-cover object-center opacity-40 filter brightness-95"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220] via-[#0B1220]/90 to-[#0F766E]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-transparent to-transparent" />
      </div>

      <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Hero Copy (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F766E]/70 border border-[#36CFC9]/40 text-[#36CFC9] text-xs font-semibold backdrop-blur-xs">
                <span className="w-2 h-2 rounded-full bg-[#36CFC9] animate-pulse" />
                <span>Protecting Bhopal’s Lakes</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/70 border border-slate-700 text-slate-300 text-xs font-medium">
                <Database className="w-3.5 h-3.5 text-teal-400" />
                <span>MPPCB Official Dataset · 2023–2025</span>
              </div>
            </div>

            {/* Hero Titles */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Visarjan Ghat Environmental Intelligence
              </h1>

              <p className="text-base sm:text-lg font-medium text-[#36CFC9] tracking-tight flex items-center gap-2">
                <Waves className="w-5 h-5 text-teal-400" />
                <span>{t('hero.tagline', 'From Water Data to Civic Action')}</span>
              </p>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                Comprehensive environmental intelligence tracking idol immersion ghats, lake water quality, organic pollution spikes, and municipal restoration across Bhopal’s Upper Lake, Lower Lake, Shahpura Lake, and Hathaikheda Dam.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                to="/ranking"
                onClick={onExploreClick}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#0F766E]/90 text-white font-semibold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02] cursor-pointer border border-[#36CFC9]/30"
              >
                <span>Explore Ghat Rankings</span>
                <ArrowRight className="w-4 h-4 text-teal-200" />
              </Link>

              <Link
                to="/water-quality"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs sm:text-sm backdrop-blur-xs transition-all"
              >
                <Droplets className="w-4 h-4 text-teal-300" />
                <span>Water Quality Intelligence</span>
              </Link>
            </div>

            {/* Methodology metadata */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
              <ShieldAlert className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span className="font-medium text-slate-300">CPCB Class B Standard Evaluation</span>
              <span className="hidden sm:inline text-slate-600">·</span>
              <span>7 Monitored Immersion Sites · 1,524 Water Quality Observations</span>
            </div>
          </div>

          {/* Floating Monitoring-Status Panel & Secondary Image Previews (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Floating Status Box */}
            <div className="bg-[#12243A]/90 border border-slate-700/80 rounded-xl p-4 shadow-xl backdrop-blur-md space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#36CFC9]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Live Environmental Status
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-600/50 text-emerald-300">
                  MONITORED
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-medium">Bhojtal Water Body</span>
                  <span className="text-sm font-bold text-white font-mono">Upper Lake</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-medium">Designated Sites</span>
                  <span className="text-sm font-bold text-teal-300 font-mono">7 Immersion Ghats</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-medium">High Risk Hotspots</span>
                  <span className="text-sm font-bold text-red-400 font-mono">3 Ghats (Anoxia)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-medium">CPCB Class Target</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">Class B (DO ≥ 5.0)</span>
                </div>
              </div>
            </div>

            {/* Overlapping Secondary Image Thumbnails Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="group relative rounded-lg overflow-hidden border border-slate-700 aspect-video bg-slate-900 shadow-md">
                <ImageWithFallback
                  src="/images/water-quality/water-sampling-field.webp"
                  alt="Field sampling"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                  <span className="text-[9px] font-bold text-white truncate">Field Sampling</span>
                </div>
              </div>

              <div className="group relative rounded-lg overflow-hidden border border-slate-700 aspect-video bg-slate-900 shadow-md">
                <ImageWithFallback
                  src="/images/ghats/ghat-steps-immersion.webp"
                  alt="Immersion ghat steps"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                  <span className="text-[9px] font-bold text-white truncate">Ghat Steps</span>
                </div>
              </div>

              <div className="group relative rounded-lg overflow-hidden border border-slate-700 aspect-video bg-slate-900 shadow-md">
                <ImageWithFallback
                  src="/images/municipal-actions/lake-cleanup-boat.webp"
                  alt="Lake cleanup operations"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                  <span className="text-[9px] font-bold text-white truncate">Lake Skimmer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export const DashboardHero = HeroSection;
export const ImageHero = HeroSection;
