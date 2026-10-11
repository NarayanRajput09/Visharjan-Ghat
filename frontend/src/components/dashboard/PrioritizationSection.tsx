import { useTranslation } from 'react-i18next';
import { Calculator, Calendar, ShieldCheck, Award } from 'lucide-react';

export function PrioritizationSection() {
  const { t } = useTranslation();

  const steps = [
    {
      num: '01',
      title: t('prioritization.step1_title'),
      desc: t('prioritization.step1_desc'),
      icon: Calculator,
      tag: 'DO 45% · BOD 35% · pH 20%',
      color: 'text-[#0F766E]',
      bg: 'bg-[#E8F7F5] border-[#36CFC9]/30',
    },
    {
      num: '02',
      title: t('prioritization.step2_title'),
      desc: t('prioritization.step2_desc'),
      icon: Calendar,
      tag: '2025 (1.0x) · 2024 (0.7x) · 2023 (0.5x)',
      color: 'text-[#12243A]',
      bg: 'bg-slate-100 border-slate-200',
    },
    {
      num: '03',
      title: t('prioritization.step3_title'),
      desc: t('prioritization.step3_desc'),
      icon: ShieldCheck,
      tag: 'No Imputation · No Fake Zeros',
      color: 'text-[#D97706]',
      bg: 'bg-amber-50 border-amber-200',
    },
    {
      num: '04',
      title: t('prioritization.step4_title'),
      desc: t('prioritization.step4_desc'),
      icon: Award,
      tag: 'High (≥40) · Med (15-39) · Low (<15)',
      color: 'text-[#DC2626]',
      bg: 'bg-red-50 border-red-200',
    },
  ];

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-[#E8F7F5] text-[#0F766E] text-[11px] font-bold border border-[#36CFC9]/40 uppercase tracking-wider">
            Deterministic Methodology
          </span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1.5">
          {t('prioritization.title')}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {t('prioritization.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((s) => {
          const Icon = s.icon;
          const glowColor = s.num === '01' ? 'cyan' : s.num === '02' ? 'emerald' : s.num === '03' ? 'medium' : 'high';
          return (
            <div
              key={s.num}
              data-glow-card
              data-glow={glowColor}
              className="bg-slate-50/60 rounded-xl p-4 border border-slate-200/80 hover:bg-white hover:shadow-lg transition-all flex flex-col justify-between space-y-3 cursor-pointer select-none"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-extrabold text-slate-400">
                    {s.num}
                  </span>
                  <div className={`p-1.5 rounded-lg border ${s.bg}`}>
                    <Icon className={`w-4 h-4 ${s.color}`} />
                  </div>
                </div>

                <h3 className="text-xs font-bold text-slate-900">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  {s.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60">
                <span className="text-[10px] font-mono font-semibold text-slate-500 block truncate">
                  {s.tag}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
