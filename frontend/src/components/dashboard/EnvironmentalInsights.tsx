import { Droplets } from 'lucide-react';
import { ImageWithFallback } from '../ImageWithFallback';

export function EnvironmentalInsights() {
  const insights = [
    {
      id: 'do',
      title: 'Dissolved Oxygen Depletion',
      param: 'DO < 3.0 mg/L',
      standard: 'CPCB Standard: ≥ 5.0 mg/L',
      status: 'Critical Indicator',
      statusColor: 'bg-red-500/90 text-white',
      imageSrc: '/images/water-quality/dissolved-oxygen-meter.webp',
      description: 'Acute deoxygenation episodes recorded at Malviya Kund (0.0 mg/L) and Bairagarh (0.8 mg/L) during peak Durga Visarjan post-immersion cycles.',
      tag: 'Anoxia Alert',
    },
    {
      id: 'bod',
      title: 'Biochemical Oxygen Demand',
      param: 'BOD up to 26 mg/L',
      standard: 'CPCB Standard: ≤ 3.0 mg/L',
      status: 'Organic Surge',
      statusColor: 'bg-amber-500/90 text-white',
      imageSrc: '/images/water-quality/bod-incubator-lab.webp',
      description: 'Microbial decomposition of biodegradable pooja offerings and organic matter drives rapid oxygen consumption far exceeding bathing limits.',
      tag: '8.6x Exceedance',
    },
    {
      id: 'metals',
      title: 'Heavy Metal & Pigment Surveillance',
      param: 'Lead & Chromium AAS',
      standard: 'Strict BDL Target',
      status: 'Toxicology Risk',
      statusColor: 'bg-indigo-500/90 text-white',
      imageSrc: '/images/water-quality/heavy-metal-spectrometry.webp',
      description: 'Laboratory spectrometry for synthetic dyes and chemical paints leaching from non-clay idols into urban lake sediments.',
      tag: 'Pigment Screening',
    },
    {
      id: 'coverage',
      title: '3-Year Multi-Phase Sampling',
      param: '1,524 Test Observations',
      standard: 'Pre · During · Post',
      status: 'Protocol Coverage',
      statusColor: 'bg-emerald-600/90 text-white',
      imageSrc: '/images/water-quality/water-sample-bottles.webp',
      description: 'Rigorous chain of custody monitoring executed across 2023, 2024, and 2025 Ganesh and Durga Visarjan cycles across 7 sites.',
      tag: '100% Traceability',
    },
  ];

  return (
    <section className="space-y-4" aria-label="Lake Water Quality Parameters">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-[#0F766E]" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Environmental Indicators & Chemical Findings
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Key physical-chemical parameters evaluated against CPCB Class B Outdoor Bathing criteria.
          </p>
        </div>
        <span className="text-xs font-mono text-slate-400 self-start sm:self-auto">
          Official MPPCB Parameters
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {insights.map((item) => (
          <div
            key={item.id}
            data-glow-card
            data-glow={item.id === 'do' ? 'high' : item.id === 'bod' ? 'medium' : item.id === 'metals' ? 'cyan' : 'low'}
            className="group relative rounded-xl overflow-hidden border border-slate-200 bg-white shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between cursor-pointer select-none"
          >
            {/* Top Image with Banner */}
            <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-900">
              <ImageWithFallback
                src={item.imageSrc}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

              {/* Status Badge */}
              <div className="absolute top-2.5 left-2.5">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${item.statusColor} shadow-xs`}>
                  {item.status}
                </span>
              </div>

              {/* Tag at Top Right */}
              <div className="absolute top-2.5 right-2.5">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-black/60 text-teal-300 border border-teal-500/30 backdrop-blur-xs">
                  {item.tag}
                </span>
              </div>

              {/* Prominent Param and Unit */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                <span className="text-sm font-black font-mono tracking-tight block">
                  {item.param}
                </span>
                <span className="text-[10px] text-slate-300 block">
                  {item.standard}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#0F766E] transition-colors">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>MPPCB Tested</span>
                <span className="text-[#0F766E] font-semibold">2023–2025 Cycles</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export const WaterMonitoringCard = EnvironmentalInsights;
