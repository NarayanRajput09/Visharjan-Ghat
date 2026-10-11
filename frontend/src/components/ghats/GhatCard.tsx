import { MapPin, Droplets, Activity, ShieldCheck, ChevronRight, AlertCircle } from 'lucide-react';
import type { GhatRecord } from '../../types';

interface GhatCardProps {
  ghat: GhatRecord;
  onSelect: (ghat: GhatRecord) => void;
  language?: 'en' | 'hi';
}

export function GhatCard({ ghat, onSelect, language = 'en' }: GhatCardProps) {
  const displayName = language === 'hi' ? ghat.name_hi : ghat.name_en;
  const secondaryName = language === 'hi' ? ghat.name_en : ghat.name_hi;

  const tierBadges = {
    high: 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-red-500/20',
    medium: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/20',
    low: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-500/20',
  };

  const tierBorderHover = {
    high: 'hover:border-red-400 hover:shadow-red-500/15',
    medium: 'hover:border-amber-400 hover:shadow-amber-500/15',
    low: 'hover:border-emerald-400 hover:shadow-emerald-500/15',
  };

  const confidenceBadges = {
    good: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold',
    limited: 'bg-amber-50 text-amber-800 border-amber-300 font-semibold',
    poor: 'bg-red-50 text-red-800 border-red-300 font-semibold',
  };

  return (
    <article
      data-glow-card
      data-glow-tier={ghat.risk_tier}
      className={`group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative ${tierBorderHover[ghat.risk_tier]}`}
      onClick={() => onSelect(ghat)}
    >
      {/* Card Header Media Thumbnail with h-48 ratio */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <img
          src={ghat.imageUrl}
          alt={ghat.imageAlt}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
        />
        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent" />

        {/* Rank Badge top left */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-lg bg-[#0F172A]/90 backdrop-blur-md text-white text-xs font-mono font-bold border border-white/20 shadow-md">
            Rank #{ghat.rank}
          </span>
        </div>

        {/* Risk Badge top right */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md ${tierBadges[ghat.risk_tier]}`}>
            {ghat.risk_tier.toUpperCase()} RISK
          </span>
        </div>

        {/* Water body & Calculated Score over bottom gradient */}
        <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between text-white text-xs">
          <span className="font-semibold flex items-center gap-1.5 drop-shadow-md text-[#38BDF8]">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span className="truncate max-w-[150px]">{ghat.water_body}</span>
          </span>
          <span className="text-xs text-white font-mono font-extrabold px-2.5 py-0.5 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 shadow-sm">
            Score: {ghat.score.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4.5 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-[#059669] transition-colors leading-snug">
            {displayName}
          </h3>
          <p className="text-[11px] text-slate-500 font-medium line-clamp-1 mt-0.5">
            {secondaryName} · <span className="text-slate-400">Landmark:</span> {ghat.nearest_landmark}
          </p>
        </div>

        {/* Short description of key observed water-quality concern */}
        <div className="p-3 rounded-xl bg-slate-50/90 border border-slate-200/80 flex items-start gap-2.5 text-xs">
          <AlertCircle className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2 font-normal">
            {ghat.key_concern}
          </p>
        </div>

        {/* Key Metrics Grid: DO & BOD with vivid badges */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-200/70">
            <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
              Lowest DO
            </span>
            <span className="font-mono font-extrabold text-emerald-950 text-sm flex items-center gap-1.5 mt-0.5">
              <Droplets className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600/30" />
              {ghat.lowest_do.toFixed(1)} mg/L
            </span>
          </div>

          <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/70">
            <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider block">
              Peak BOD
            </span>
            <span className="font-mono font-extrabold text-amber-950 text-sm flex items-center gap-1.5 mt-0.5">
              <Activity className="w-3.5 h-3.5 text-amber-600" />
              {ghat.peak_bod.toFixed(1)} mg/L
            </span>
          </div>
        </div>

        {/* Coverage & Confidence Indicator */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Coverage:</span>
            <span className="font-bold text-slate-800">{ghat.monitoring_coverage}</span>
          </div>
          <span className={`px-2 py-0.5 rounded-md text-[10px] border capitalize ${confidenceBadges[ghat.confidence]}`}>
            {ghat.confidence} data
          </span>
        </div>

        {/* View Details Action with vibrant hover style */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(ghat);
          }}
          className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-50 group-hover:bg-[#059669] text-slate-700 group-hover:text-white text-xs font-bold border border-slate-200 group-hover:border-[#059669] transition-all duration-200 shadow-xs cursor-pointer"
        >
          <span>View Details</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </article>
  );
}
