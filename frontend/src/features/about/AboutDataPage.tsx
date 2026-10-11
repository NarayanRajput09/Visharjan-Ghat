import { useTranslation } from 'react-i18next';
import {
  ShieldCheck,
  BookOpen,
  ExternalLink,
  FileText,
  CheckCircle2,
  Clock,
  Info,
} from 'lucide-react';
import { Card } from '../../components/Card';
import { useLimits } from '../../api/hooks';
import { ImageWithFallback } from '../../components/ImageWithFallback';
import { SOURCE_DOCUMENTS, METHODOLOGY_INFO } from '../../data/sources';

export function AboutDataPage() {
  const { t } = useTranslation();
  const { data: limitsData } = useLimits('B');

  const processSteps = [
    {
      step: '01',
      title: 'Pre-Immersion Ambient Baseline Testing',
      phase: 'Pre-Visarjan Phase',
      image: '/images/water-quality/water-sampling-boat.webp',
      description:
        'Field sampling crews deploy 24–48 hours prior to festival commencements to capture unperturbed ambient limnological baselines for DO, BOD, pH, turbidity, and fecal coliform across all designated ghat coordinates.',
      metric: 'Baseline DO Target: ≥ 5.0 mg/L',
    },
    {
      step: '02',
      title: 'During-Immersion Peak Surveillance',
      phase: 'Peak Festival Phase',
      image: '/images/ghats/ghat-containment-boom.webp',
      description:
        'Intensive on-site testing during active idol immersion days. Water samples are retrieved immediately adjacent to immersion ramps and containment booms to detect acute chemical shifts and dye leaching.',
      metric: 'Containment Boom Integrity Checked',
    },
    {
      step: '03',
      title: 'Post-Immersion Anoxia & Organic Decay Assay',
      phase: 'Post-Visarjan Phase',
      image: '/images/water-quality/water-testing-lab-analysis.webp',
      description:
        'Samples retrieved 24–72 hours following immersion ceremonies quantify microbiological respiration surges caused by submerged floral biomass and biodegradable clay, diagnosing zero-DO deoxygenation events.',
      metric: 'Critical Alert: Zero DO at Malviya & Bairagarh',
    },
    {
      step: '04',
      title: 'Deterministic CPCB Class B Compliance Engine',
      phase: 'Data Pipeline Phase',
      image: '/images/methodology/data-validation-pipeline.webp',
      description:
        'Every reading is programmatically validated against CPCB Class B outdoor bathing thresholds. Tier risk assignments use a conservative, zero-tolerance rule engine grounded strictly in official citations.',
      metric: '100% Deterministic Rule Engine',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10" data-testid="about-page">
      {/* 1. Cinematic Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-[#0B1220] border border-slate-800 text-white p-6 sm:p-12 shadow-xl">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="/images/hero/bhopal-bhoj-wetland-hero.webp"
            alt="Environmental water testing laboratory and Bhoj Wetland"
            className="w-full h-full object-cover opacity-35 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220] via-[#0B1220]/85 to-transparent" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F766E]/60 border border-[#36CFC9]/40 text-[#36CFC9] text-xs font-semibold backdrop-blur-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Scientific Traceability & Official Standards</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {t('about.title', 'About the Data & Methodology')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {t(
              'about.subtitle',
              'Understanding how Visarjan Ghat Watch extracts, audits, and analyzes 3 years of official MPPCB immersion water quality test reports (2023–2025).'
            )}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              <span>Dataset: {METHODOLOGY_INFO.dataset_period}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
              <span>Standard: {METHODOLOGY_INFO.evaluation_class}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Visual Storytelling: Step-by-Step Monitoring Process (Alternating Cards) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#0F766E]" />
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Lifecycle of Water Quality Intelligence
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              From field sample collection at Bhopal ghats to deterministic CPCB risk evaluation.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 self-start sm:self-auto">
            4-Stage Pipeline
          </span>
        </div>

        <div className="space-y-6">
          {processSteps.map((step, idx) => {
            const isEven = idx % 2 === 1;
            return (
              <div
                key={step.step}
                data-glow-card
                data-glow={idx === 2 ? 'high' : idx === 3 ? 'cyan' : 'emerald'}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-slate-300 transition-all items-center cursor-pointer select-none`}
              >
                {/* Photo Column */}
                <div
                  className={`lg:col-span-5 relative aspect-16/10 w-full overflow-hidden bg-slate-900 ${
                    isEven ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <ImageWithFallback
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#0F766E] text-white">
                    STAGE {step.step}
                  </span>
                  <span className="absolute bottom-2.5 left-3 text-xs font-bold text-white">
                    {step.phase}
                  </span>
                </div>

                {/* Content Column */}
                <div
                  className={`lg:col-span-7 p-6 sm:p-8 space-y-3 ${
                    isEven ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black font-mono text-[#0F766E]">
                      {step.step}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>

                  <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-[#0F766E]">
                    <CheckCircle2 className="w-4 h-4 text-[#36CFC9]" />
                    <span>{step.metric}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Why CPCB Class B Standards */}
      <Card
        title={t('about.class_b_heading', 'Why CPCB Class B Standards Were Selected')}
        headerAction={<ShieldCheck className="w-5 h-5 text-[#0F766E]" />}
      >
        <p className="text-sm text-slate-700 leading-relaxed">
          {t(
            'about.class_b_text',
            'Under Central Pollution Control Board (CPCB) classifications, designated water bodies utilized for outdoor bathing, religious bathing, and public immersion ceremonies are benchmarked against Class B criteria. This standard mandates a minimum Dissolved Oxygen (DO) concentration of 5.0 mg/L and Biochemical Oxygen Demand (BOD) not exceeding 3.0 mg/L.'
          )}
        </p>
      </Card>

      {/* 4. Limits Table */}
      <Card
        title={t('about.limits_table_heading', 'CPCB Class B Standard Thresholds')}
        subtitle="Primary standards used for deterministic risk assessment"
        headerAction={<BookOpen className="w-5 h-5 text-slate-600" />}
      >
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-xs text-left divide-y divide-slate-200">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-2.5 px-3">{t('about.limits_param', 'Parameter')}</th>
                <th className="py-2.5 px-3">{t('about.limits_standard', 'Standard Threshold')}</th>
                <th className="py-2.5 px-3">{t('about.limits_unit', 'Unit')}</th>
                <th className="py-2.5 px-3">{t('about.limits_meaning', 'Limnological Significance')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {limitsData?.limits ? (
                limitsData.limits.map((l, i) => {
                  let stdText = '';
                  if (l.limit_type === 'min') stdText = `≥ ${l.limit_min}`;
                  else if (l.limit_type === 'max') stdText = `≤ ${l.limit_max}`;
                  else if (l.limit_type === 'range') stdText = `${l.limit_min} – ${l.limit_max}`;

                  return (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{l.parameter}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-[#0F766E]">{stdText}</td>
                      <td className="py-2.5 px-3 text-slate-500">{l.unit ?? '-'}</td>
                      <td className="py-2.5 px-3 text-slate-600">{l.best_use}</td>
                    </tr>
                  );
                })
              ) : (
                <>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Dissolved oxygen (DO)</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-[#0F766E]">≥ 5.0</td>
                    <td className="py-2.5 px-3 text-slate-500">mg/L</td>
                    <td className="py-2.5 px-3 text-slate-600">Essential for aerobic balance and aquatic life survival</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Biochemical Oxygen Demand (BOD)</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-[#0F766E]">≤ 3.0</td>
                    <td className="py-2.5 px-3 text-slate-500">mg/L</td>
                    <td className="py-2.5 px-3 text-slate-600">Measures microbial oxygen uptake from organic offerings</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">pH</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-[#0F766E]">6.5 – 8.5</td>
                    <td className="py-2.5 px-3 text-slate-500">-</td>
                    <td className="py-2.5 px-3 text-slate-600">Acid-base equilibrium required for outdoor contact</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 5. Official Reports & PDF Sources with Preview Covers */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#0F766E]" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Official MPPCB & CPCB Document Sources
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">Direct Official PDF Citations</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SOURCE_DOCUMENTS.map((s) => (
            <div
              key={s.id}
              data-glow-card
              data-glow="cyan"
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-xl hover:border-teal-300 transition-all flex flex-col justify-between cursor-pointer select-none"
            >
              <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-900">
                <ImageWithFallback
                  src={s.previewImage}
                  alt={s.title}
                  className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2.5 right-2.5 text-xs font-bold text-white line-clamp-1">
                  {s.publisher} ({s.year})
                </span>
              </div>

              <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug">
                    {s.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                    {s.coverage_summary}
                  </p>
                  <span className="inline-block mt-2 text-[10px] font-mono text-slate-400">
                    {s.pages} Pages Document
                  </span>
                </div>

                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-50 hover:bg-[#E8F7F5] text-[#0F766E] text-xs font-semibold border border-slate-200 transition-colors w-full mt-2"
                >
                  <span>Open Official Document</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Scientific Rigor & Transparent Disclaimer */}
      <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
        <div className="flex items-center gap-2 text-slate-700">
          <Info className="w-4 h-4 text-[#0F766E]" />
          <h4 className="text-xs font-bold uppercase tracking-wider">Methodology & Transparency Policy</h4>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          {METHODOLOGY_INFO.disclaimer}
        </p>
      </div>
    </div>
  );
}
