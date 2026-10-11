import { Link } from 'react-router-dom';
import { AlertOctagon, AlertTriangle, ShieldCheck, ArrowRight, Activity } from 'lucide-react';
import { ImageWithFallback } from '../ImageWithFallback';
import type { components } from '../../api/schema';

type RankedGhat = components['schemas']['RankedGhat'];

interface RiskSummaryCardsProps {
  ghats: RankedGhat[];
  onSelectTier?: (tier: 'high' | 'medium' | 'low') => void;
}

export function RiskSummaryCards({ ghats, onSelectTier }: RiskSummaryCardsProps) {
  const highGhats = ghats.filter((g) => g.tier === 'high');
  const mediumGhats = ghats.filter((g) => g.tier === 'medium');
  const lowGhats = ghats.filter((g) => g.tier === 'low');

  const cards = [
    {
      tier: 'high' as const,
      title: 'HIGH RISK',
      count: highGhats.length,
      badgeText: 'Priority Intervention',
      badgeClass: 'bg-red-500/90 text-white border-red-400',
      borderClass: 'border-l-4 border-l-[#DC2626] border-slate-700',
      imageSrc: '/images/water-quality/do-depletion-anoxia.webp',
      overlayGrad: 'from-[#0B1220] via-[#0B1220]/85 to-[#0B1220]/40',
      icon: AlertOctagon,
      iconColor: 'text-red-400',
      summary: 'Critical DO depletion (< 3.0 mg/L) or peak BOD spikes (> 15 mg/L). Urgent aeration required.',
      trendText: '4 Zero-DO deoxygenation events',
      ghatsList: highGhats.map((g) => g.name_en).join(', '),
    },
    {
      tier: 'medium' as const,
      title: 'MEDIUM RISK',
      count: mediumGhats.length,
      badgeText: 'Elevated Monitoring',
      badgeClass: 'bg-amber-500/90 text-white border-amber-400',
      borderClass: 'border-l-4 border-l-[#D97706] border-slate-700',
      imageSrc: '/images/water-quality/bod-organic-loading.webp',
      overlayGrad: 'from-[#0B1220] via-[#0B1220]/85 to-[#0B1220]/40',
      icon: AlertTriangle,
      iconColor: 'text-amber-400',
      summary: 'Moderate BOD departure (> 3.0 mg/L) with episodic DO drops. Barricade and debris skimming advised.',
      trendText: 'Intermittent bathing limit breaches',
      ghatsList: mediumGhats.map((g) => g.name_en).join(', '),
    },
    {
      tier: 'low' as const,
      title: 'LOW RISK',
      count: lowGhats.length,
      badgeText: 'Acceptable Baseline',
      badgeClass: 'bg-emerald-600/90 text-white border-emerald-400',
      borderClass: 'border-l-4 border-l-[#059669] border-slate-700',
      imageSrc: '/images/hero/bhopal-bhoj-wetland-hero.webp',
      overlayGrad: 'from-[#0B1220] via-[#0B1220]/85 to-[#0B1220]/40',
      icon: ShieldCheck,
      iconColor: 'text-emerald-400',
      summary: 'Satisfactory DO levels (≥ 5.0 mg/L) and lower organic loading during test cycles.',
      trendText: 'Consistent CPCB Class B compliance',
      ghatsList: lowGhats.map((g) => g.name_en).join(', '),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.tier}
            className={`group relative rounded-xl overflow-hidden border bg-[#0B1220] text-white p-5 shadow-sm transition-all duration-300 hover:shadow-xl flex flex-col justify-between ${c.borderClass}`}
          >
            {/* Background Photographic Asset with Restrained Overlay */}
            <div className="absolute inset-0 z-0">
              <ImageWithFallback
                src={c.imageSrc}
                alt={c.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-35"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${c.overlayGrad}`} />
            </div>

            {/* Card Content on Top */}
            <div className="relative z-10">
              {/* Header Badge */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border shadow-xs ${c.badgeClass}`}>
                  {c.title}
                </span>
                <span className="text-[11px] text-slate-300 font-medium">
                  {c.badgeText}
                </span>
              </div>

              {/* Count and Icon */}
              <div className="flex items-baseline justify-between mb-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
                    {c.count}
                  </span>
                  <span className="text-xs font-semibold text-slate-300">
                    {c.count === 1 ? 'Ghat' : 'Ghats'}
                  </span>
                </div>
                <div className={`p-2 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs ${c.iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              {/* Short explanation */}
              <p className="text-xs text-slate-200 leading-relaxed mt-2">
                {c.summary}
              </p>

              {/* Status / Trend indicator */}
              <div className="mt-3 py-1.5 px-2 bg-black/40 rounded-lg border border-white/10 flex items-center gap-1.5 text-[11px] text-slate-300">
                <Activity className="w-3 h-3 text-[#36CFC9] shrink-0" />
                <span className="line-clamp-1">{c.trendText}</span>
              </div>
            </div>

            {/* Click-through Action */}
            <div className="relative z-10 mt-4 pt-3 border-t border-white/15">
              <Link
                to={`/ranking?tier=${c.tier}`}
                onClick={() => onSelectTier?.(c.tier)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#36CFC9] hover:text-white transition-colors group"
              >
                <span>View {c.title.toLowerCase()} ghats ({c.count})</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export const RiskSummaryCard = RiskSummaryCards;
