import { AlertOctagon, AlertTriangle, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import type { GhatRecord, RiskTier } from '../../types';

interface RiskSummaryProps {
  ghats: GhatRecord[];
  selectedTier: RiskTier | 'all';
  onSelectTier: (tier: RiskTier | 'all') => void;
}

export function RiskSummary({ ghats, selectedTier, onSelectTier }: RiskSummaryProps) {
  const highGhats = ghats.filter((g) => g.risk_tier === 'high');
  const mediumGhats = ghats.filter((g) => g.risk_tier === 'medium');
  const lowGhats = ghats.filter((g) => g.risk_tier === 'low');

  const cards = [
    {
      tier: 'high' as RiskTier,
      title: 'HIGH RISK',
      count: highGhats.length,
      subtitle: 'Priority Intervention',
      badgeClass: 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-500/25',
      borderClass: 'border-l-4 border-l-[#EF4444]',
      cardBg: 'hover:bg-red-50/40',
      activeBorder: selectedTier === 'high' ? 'ring-2 ring-red-500 shadow-xl shadow-red-500/15 bg-red-50/30' : '',
      icon: AlertOctagon,
      iconColor: 'text-[#EF4444]',
      description:
        'Locations with verified critical DO depletion (< 3.0 mg/L) or acute BOD surges exceeding 15.0 mg/L. Urgent aeration and containment barriers required.',
      actionLabel: 'View High-Risk Ghats →',
    },
    {
      tier: 'medium' as RiskTier,
      title: 'MEDIUM RISK',
      count: mediumGhats.length,
      subtitle: 'Elevated Monitoring',
      badgeClass: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/25',
      borderClass: 'border-l-4 border-l-[#F59E0B]',
      cardBg: 'hover:bg-amber-50/40',
      activeBorder: selectedTier === 'medium' ? 'ring-2 ring-amber-500 shadow-xl shadow-amber-500/15 bg-amber-50/30' : '',
      icon: AlertTriangle,
      iconColor: 'text-[#F59E0B]',
      description:
        'Sites recording moderate BOD departures (3.0 – 10.0 mg/L) with episodic DO drops. Barricades and immediate post-visarjan debris skimming advised.',
      actionLabel: 'View Medium-Risk Ghats →',
    },
    {
      tier: 'low' as RiskTier,
      title: 'LOW RISK',
      count: lowGhats.length,
      subtitle: 'Acceptable Baseline',
      badgeClass: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25',
      borderClass: 'border-l-4 border-l-[#10B981]',
      cardBg: 'hover:bg-emerald-50/40',
      activeBorder: selectedTier === 'low' ? 'ring-2 ring-emerald-500 shadow-xl shadow-emerald-500/15 bg-emerald-50/30' : '',
      icon: ShieldCheck,
      iconColor: 'text-[#10B981]',
      description:
        'Measurements satisfy CPCB Class B outdoor bathing thresholds (DO ≥ 5.0 mg/L, low organic loading) across tested multi-phase cycles.',
      actionLabel: 'View Low-Risk Ghats →',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#059669]" />
            <span>Risk Tier Distribution (Calculated from Dataset)</span>
          </h3>
        </div>
        {selectedTier !== 'all' && (
          <button
            type="button"
            onClick={() => onSelectTier('all')}
            className="text-xs font-bold text-[#059669] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Show All Tiers ({ghats.length})</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map((c) => {
          const Icon = c.icon;
          const isSelected = selectedTier === c.tier;

          return (
            <div
              key={c.tier}
              data-glow-card
              data-glow-tier={c.tier}
              onClick={() => onSelectTier(isSelected ? 'all' : c.tier)}
              className={`bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm transition-all duration-300 hover:shadow-xl cursor-pointer flex flex-col justify-between ${c.borderClass} ${c.cardBg} ${c.activeBorder}`}
            >
              <div>
                {/* Header Badge & Subtitle */}
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${c.badgeClass}`}>
                    {c.title}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    {c.subtitle}
                  </span>
                </div>

                {/* Count & Icon */}
                <div className="flex items-baseline justify-between mb-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight font-mono">
                      {c.count}
                    </span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      {c.count === 1 ? 'Ghat' : 'Ghats'}
                    </span>
                  </div>
                  <div className={`p-3 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs ${c.iconColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed mt-2.5">
                  {c.description}
                </p>
              </div>

              {/* Action Link */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                <span className={isSelected ? 'text-[#059669]' : 'text-slate-700'}>
                  {c.actionLabel}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
