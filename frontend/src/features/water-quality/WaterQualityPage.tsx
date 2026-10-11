import { useTranslation } from 'react-i18next';
import { Droplets, ShieldCheck, ArrowLeft, Download, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WaterQualityCharts } from '../../components/charts/WaterQualityCharts';
import { ImageWithFallback } from '../../components/ImageWithFallback';
import { api } from '../../api/client';

export function WaterQualityPage() {
  const { t } = useTranslation();

  const labProtocols = [
    {
      title: 'Biochemical Oxygen Demand (BOD)',
      metric: 'CPCB Limit: ≤ 3.0 mg/L',
      image: '/images/water-quality/bod-incubator-lab.webp',
      detail: '5-day 20°C standard incubation measuring biological degradation rate.',
    },
    {
      title: 'Dissolved Oxygen (DO)',
      metric: 'CPCB Standard: ≥ 5.0 mg/L',
      image: '/images/water-quality/dissolved-oxygen-meter.webp',
      detail: 'Electrochemical & optical probe measurement detecting lake anoxia.',
    },
    {
      title: 'Heavy Metal & Pigment AAS',
      metric: 'Target: Below Detection Limit',
      image: '/images/water-quality/heavy-metal-spectrometry.webp',
      detail: 'Atomic absorption spectrometry for lead and chromium dye residues.',
    },
    {
      title: 'Deep Limnology Van Dorn Sampling',
      metric: 'Multi-Depth Profiling',
      image: '/images/water-quality/water-sampling-boat.webp',
      detail: 'Vertical water column sampling across Bhojtal limnetic zones.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10" data-testid="water-quality-page">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <Link
            to="/ranking"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F766E] hover:text-[#0B1220] transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t('ghat_detail.back_to_ranking', 'Back to Risk Rankings')}</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Droplets className="w-7 h-7 text-[#0F766E]" />
            <span>{t('analytics.title', 'Water Quality Analytical Intelligence')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            {t('analytics.subtitle', 'Explore historical trends, chemical parameters, and CPCB Class B compliance metrics across 2023–2025 idol immersion festivals.')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={api.getExportCsvUrl('B')}
            download="visarjan_water_quality_2023_2025.csv"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>{t('ranking.download_csv', 'Download CSV Dataset')}</span>
          </a>

          <Link
            to="/about"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0F766E] hover:bg-[#0F766E]/90 text-white text-xs font-semibold transition-colors shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t('nav.sources', 'Official Sources')}</span>
          </Link>
        </div>
      </div>

      {/* Visual Context Banner (4 Photographic Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {labProtocols.map((p, idx) => (
          <div
            key={idx}
            data-glow-card
            data-glow={idx === 0 ? 'medium' : idx === 1 ? 'high' : 'cyan'}
            className="group relative rounded-xl overflow-hidden border border-slate-200 bg-white shadow-2xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between cursor-pointer select-none"
          >
            <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-900">
              <ImageWithFallback
                src={p.image}
                alt={p.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute top-2 left-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#0F766E] text-white">
                  {p.metric}
                </span>
              </div>
              <div className="absolute bottom-2 left-2 right-2 text-white">
                <span className="text-xs font-bold block line-clamp-1">{p.title}</span>
              </div>
            </div>
            <div className="p-3 text-[11px] text-slate-600 leading-relaxed">
              {p.detail}
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Component */}
      <WaterQualityCharts initialGhat="all" />

      {/* Parameter Criteria Summary */}
      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 space-y-3">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#0F766E]" />
          <span>Scientific Criteria Summary (CPCB Class B Standard)</span>
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          The Central Pollution Control Board (CPCB) designates water bodies utilized for public outdoor bathing and religious festivals under Class B criteria.
          Immersion ghats require minimal dissolved oxygen of 5.0 mg/L to maintain organic breakdown balance. During immersion cycles,
          biodegradable materials, organic flowers, and paints induce acute microbiological respiration, spiking BOD loads (normal limit ≤ 3.0 mg/L)
          and precipitating severe oxygen depletion.
        </p>
      </div>
    </div>
  );
}
