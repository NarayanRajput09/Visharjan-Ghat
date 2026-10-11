import { CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from '../ImageWithFallback';

interface MunicipalActionItem {
  id: string;
  title: string;
  category: string;
  imageSrc: string;
  description: string;
  suggestedAction: string;
  statusBadge: string;
}

export const MUNICIPAL_ACTIONS: MunicipalActionItem[] = [
  {
    id: 'water-sampling',
    title: 'Pre- & Post-Visarjan Water Sampling',
    category: 'Monitoring',
    imageSrc: '/images/water-quality/water-sampling-field.webp',
    description: 'Collecting baseline physical-chemical samples at designated immersion coordinates before citizen influx.',
    suggestedAction: 'Collect 3-phase samples (pre, during, post) within 24h of immersion.',
    statusBadge: 'Mandatory Protocol',
  },
  {
    id: 'do-monitoring',
    title: 'Dissolved Oxygen Real-Time Monitoring',
    category: 'Oxygen Tracking',
    imageSrc: '/images/water-quality/dissolved-oxygen-meter.webp',
    description: 'Continuous monitoring of DO saturation to detect acute hypolimnetic oxygen drops below the 5.0 mg/L threshold.',
    suggestedAction: 'Deploy portable optical DO meters for continuous immersion surveillance.',
    statusBadge: 'Critical Threshold',
  },
  {
    id: 'aeration-planning',
    title: 'Subsurface & Surface Aeration Planning',
    category: 'Restoration',
    imageSrc: '/images/municipal-actions/lake-aeration-diffusers.webp',
    description: 'Positioning high-capacity micro-bubble diffusers to aerate high-risk enclosed basins such as Bairagarh and Malviya.',
    suggestedAction: 'Activate auxiliary aerators 24–48 hours prior to immersion peak.',
    statusBadge: 'Active Deployment',
  },
  {
    id: 'floating-debris',
    title: 'Floating Debris & Biomass Removal',
    category: 'Cleanup',
    imageSrc: '/images/municipal-actions/floating-debris-removal.webp',
    description: 'Immediate retrieval of pooja samagri, bamboo frames, and floral waste to prevent bacterial oxygen depletion.',
    suggestedAction: 'Station continuous boat-mounted skimming crews along littoral perimeter.',
    statusBadge: 'Rapid Recovery',
  },
  {
    id: 'waste-segregation',
    title: 'On-Site Waste Segregation Bays',
    category: 'Sanitation',
    imageSrc: '/images/municipal-actions/waste-segregation-ghat.webp',
    description: 'Providing color-coded segregation bays for flowers, clay idols, cloth, and non-biodegradable synthetic items.',
    suggestedAction: 'Establish dry/wet segregation kiosks at all 7 designated ghat entrances.',
    statusBadge: 'Source Segregation',
  },
  {
    id: 'site-cleanup',
    title: 'Immersion-Site Silt & Sedi-Clean',
    category: 'Ghat Maintenance',
    imageSrc: '/images/municipal-actions/post-immersion-cleanup.webp',
    description: 'Overnight clearing of immersion sedimentation tanks, stone ramps, and stone steps by BMC sanitary divisions.',
    suggestedAction: 'Perform overnight post-immersion pressure washing and debris clearing.',
    statusBadge: 'Sanitation Routine',
  },
  {
    id: 'post-testing',
    title: 'Post-Immersion Ecological Recovery Testing',
    category: 'Impact Audit',
    imageSrc: '/images/water-quality/water-testing-lab-analysis.webp',
    description: 'Secondary water assays conducted 7 days post-festival to confirm DO recovery and organic BOD normalization.',
    suggestedAction: 'Transmit follow-up samples to MPPCB Central Lab within 7 business days.',
    statusBadge: 'Compliance Audit',
  },
  {
    id: 'environmental-awareness',
    title: 'Mitti Ke Ganesh Public Campaign',
    category: 'Community',
    imageSrc: '/images/municipal-actions/civic-awareness-campaign.webp',
    description: 'Citizen outreach campaigns promoting unbaked clay idols, natural plant dyes, and artificial tank immersions.',
    suggestedAction: 'Distribute informational civic guidelines at temples and community mandals.',
    statusBadge: 'Citizen Engagement',
  },
];

interface MunicipalActionsPanelProps {
  ghatName?: string;
  className?: string;
  compact?: boolean;
}

export function MunicipalActionsPanel({ ghatName, className = '', compact = false }: MunicipalActionsPanelProps) {
  const displayActions = compact ? MUNICIPAL_ACTIONS.slice(0, 4) : MUNICIPAL_ACTIONS;

  return (
    <div className={`space-y-4 ${className}`} data-testid="municipal-actions-panel">
      {/* Banner Card */}
      <div className="relative rounded-xl overflow-hidden bg-[#0B1220] border border-slate-800 text-white p-5 shadow-xs">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="/images/municipal-actions/lake-cleanup-boat.webp"
            alt="Bhopal lake restoration and cleanup"
            className="w-full h-full object-cover opacity-25 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220] via-[#0B1220]/85 to-transparent" />
        </div>

        <div className="relative z-10 space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#36CFC9] tracking-wider block">
            Bhopal Municipal Corporation · Field Action Plan
          </span>
          <h3 className="text-base font-bold text-white tracking-tight">
            Municipal Interventions {ghatName ? `for ${ghatName}` : '& Restoration'}
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Targeted operational directives for BMC Zonal Offices across 7 designated immersion ghats.
          </p>
        </div>
      </div>

      {/* Action Cards Grid */}
      <div className={`grid gap-4 ${compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
        {displayActions.map((action) => (
          <div
            key={action.id}
            data-glow-card
            data-glow="cyan"
            className="group relative rounded-xl overflow-hidden border border-slate-200 bg-white shadow-2xs hover:shadow-xl hover:border-teal-300 transition-all duration-300 flex flex-col justify-between cursor-pointer select-none"
          >
            {/* Photographic Image with Category Tag */}
            <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-900">
              <ImageWithFallback
                src={action.imageSrc}
                alt={action.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

              <div className="absolute top-2.5 left-2.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 text-slate-800 shadow-xs">
                  {action.category}
                </span>
              </div>

              <div className="absolute top-2.5 right-2.5">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#0F766E]/90 text-[#36CFC9] border border-[#36CFC9]/30 backdrop-blur-xs">
                  {action.statusBadge}
                </span>
              </div>

              <div className="absolute bottom-2 left-2.5 right-2.5 text-white">
                <h4 className="text-xs font-bold leading-snug line-clamp-1 drop-shadow-sm">
                  {action.title}
                </h4>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {action.description}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-start gap-1.5 text-[11px] text-[#0F766E] bg-[#E8F7F5] p-2 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span className="font-semibold leading-tight">{action.suggestedAction}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const MunicipalActionCard = MunicipalActionsPanel;
