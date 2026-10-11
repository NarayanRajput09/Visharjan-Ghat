import { useTranslation } from 'react-i18next';
import { MapPin, FileCheck2, AlertTriangle, TrendingUp, AlertOctagon, Activity } from 'lucide-react';
import type { components } from '../../api/schema';

type RankedGhat = components['schemas']['RankedGhat'];

interface MetricCardsProps {
  ghats?: RankedGhat[];
}

export function MetricCards({ ghats = [] }: MetricCardsProps) {
  const { t } = useTranslation();

  const totalGhats = ghats.length > 0 ? ghats.length : 7;
  const highTierCount = ghats.filter((g) => g.tier === 'high').length || 2;

  const metrics = [
    {
      id: 'total_ghats',
      title: t('metrics.total_ghats'),
      value: `${totalGhats}`,
      subtext: t('metrics.total_ghats_desc'),
      icon: MapPin,
      badge: 'Bhopal Lakes',
      accentColor: 'text-[#0F766E]',
      badgeBg: 'bg-[#E8F7F5] text-[#0F766E] border-[#36CFC9]/30',
      borderAccent: 'border-l-4 border-l-[#0F766E]',
    },
    {
      id: 'total_readings',
      title: t('metrics.total_readings'),
      value: '1,524',
      subtext: t('metrics.total_readings_desc'),
      icon: FileCheck2,
      badge: '2023–2025 MPPCB',
      accentColor: 'text-[#12243A]',
      badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
      borderAccent: 'border-l-4 border-l-slate-700',
    },
    {
      id: 'do_deficit',
      title: t('metrics.do_deficit'),
      value: '42 / 116',
      subtext: t('metrics.do_deficit_desc'),
      icon: Activity,
      badge: '36.2% Below Limit',
      accentColor: 'text-[#D97706]',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      borderAccent: 'border-l-4 border-l-[#D97706]',
    },
    {
      id: 'bod_exceedance',
      title: t('metrics.bod_exceedance'),
      value: '100 / 112',
      subtext: t('metrics.bod_exceedance_desc'),
      icon: TrendingUp,
      badge: '89.3% Exceedance',
      accentColor: 'text-[#DC2626]',
      badgeBg: 'bg-red-50 text-red-700 border-red-200',
      borderAccent: 'border-l-4 border-l-[#DC2626]',
    },
    {
      id: 'critical_events',
      title: t('metrics.critical_events'),
      value: '4 Events',
      subtext: t('metrics.critical_events_desc'),
      icon: AlertOctagon,
      badge: 'DO = 0.0 mg/L',
      accentColor: 'text-[#DC2626]',
      badgeBg: 'bg-red-100 text-red-800 border-red-300 font-mono',
      borderAccent: 'border-l-4 border-l-red-600',
    },
    {
      id: 'followup_sites',
      title: t('metrics.followup_sites'),
      value: `${highTierCount} Sites`,
      subtext: t('metrics.followup_sites_desc'),
      icon: AlertTriangle,
      badge: 'Urgent Aeration',
      accentColor: 'text-[#0F766E]',
      badgeBg: 'bg-[#E8F7F5] text-[#0F766E] border-[#36CFC9]/40',
      borderAccent: 'border-l-4 border-l-[#36CFC9]',
    },
  ];

  return (
    <section aria-label="Key environmental water quality metrics" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((m) => {
        const IconComponent = m.icon;
        return (
          <div
            key={m.id}
            className={`bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between ${m.borderAccent}`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider line-clamp-1">
                  {m.title}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${m.badgeBg}`}>
                  {m.badge}
                </span>
              </div>

              <div className="flex items-baseline gap-3">
                <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${m.accentColor}`}>
                  {m.value}
                </span>
                <IconComponent className={`w-5 h-5 opacity-70 ${m.accentColor}`} />
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2.5">
              {m.subtext}
            </p>
          </div>
        );
      })}
    </section>
  );
}
