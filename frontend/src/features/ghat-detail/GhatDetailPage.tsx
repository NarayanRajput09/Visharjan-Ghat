import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  MapPin,
  CheckSquare,
  Compass,
  ShieldCheck,
  Camera,
  Activity,
  Layers,
  Sparkles,
  Droplets,
  ExternalLink,
  Newspaper,
} from 'lucide-react';
import { useGhat, useReadings } from '../../api/hooks';
import { TierBadge } from '../../components/TierBadge';
import { ConfidenceBadge } from '../../components/ConfidenceBadge';
import { Card } from '../../components/Card';
import { Banner } from '../../components/Banner';
import { Skeleton } from '../../components/Skeleton';
import { ImageWithFallback } from '../../components/ImageWithFallback';
import { ReasonList } from './ReasonList';
import { KnownGapsBanner } from './KnownGapsBanner';
import { CoverageMatrix } from './CoverageMatrix';
import { TrendChart } from './TrendChart';
import { ReadingsTable } from './ReadingsTable';
import { GHAT_IMAGES, GHAT_INSIGHTS } from '../../components/ghats/GhatCardsGrid';
import { GHAT_MEDIA_CITATIONS } from '../../data/sources';

export function GhatDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const cpcbClass = (searchParams.get('class') ?? 'B') as 'A' | 'B' | 'C' | 'D' | 'E';
  const { t, i18n } = useTranslation();

  const currentSlug = slug ?? '';
  const { data: ghatDetail, isLoading, isError, refetch } = useGhat(currentSlug, cpcbClass);
  const { data: readings = [] } = useReadings(currentSlug);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !ghatDetail) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Banner
          variant="error"
          title={t('common.error_title')}
          action={
            <button
              onClick={() => void refetch()}
              className="px-3 py-1.5 bg-red-700 text-white rounded text-xs cursor-pointer"
            >
              {t('common.retry')}
            </button>
          }
        >
          {t('common.error_title')}
        </Banner>
      </div>
    );
  }

  const { ghat, coverage, reasons, known_gaps, suggested_actions } = ghatDetail;
  const ghatName = i18n.language === 'hi' ? ghat.name_hi : ghat.name_en;
  const secondaryName = i18n.language === 'hi' ? ghat.name_en : ghat.name_hi;

  const coverImage = GHAT_IMAGES[ghat.slug] ?? '/images/ghats/ghat-steps-immersion.webp';
  const insight = GHAT_INSIGHTS[ghat.slug] ?? 'Official MPPCB monitoring site across 2023–2025 testing rounds.';
  const mediaCitation = GHAT_MEDIA_CITATIONS[ghat.slug];

  // Curated 6-image gallery for this specific ghat
  const ghatGallery = [
    {
      title: 'Site Immersion Infrastructure',
      subtitle: 'Designated Ghat Steps & Immersion Ramps',
      category: 'Site Structure',
      src: coverImage,
    },
    {
      title: 'Waterbody Landscape & Buffer',
      subtitle: `${ghat.water_body} littoral zone & water quality baseline`,
      category: 'Lake Context',
      src: '/images/ghats/ghat-water-reflection.webp',
    },
    {
      title: 'Field Sample Collection',
      subtitle: 'Sterile glass BOD & heavy metal sampling at water surface',
      category: 'Field Protocol',
      src: '/images/water-quality/water-sampling-field.webp',
    },
    {
      title: 'Laboratory Chemical Analysis',
      subtitle: 'MPPCB Central Lab spectrophotometric & DO determination',
      category: 'Laboratory',
      src: '/images/water-quality/water-testing-lab-analysis.webp',
    },
    {
      title: 'Critical DO / BOD Parameter Impact',
      subtitle: 'Optical probe analysis during post-visarjan deoxygenation',
      category: 'Water Quality',
      src: '/images/water-quality/dissolved-oxygen-meter.webp',
    },
    {
      title: 'Municipal Recovery & Skimming',
      subtitle: 'BMC specialized clean-up crew & surface debris extraction',
      category: 'Municipal Action',
      src: '/images/municipal-actions/lake-cleanup-boat.webp',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10" data-testid="ghat-detail-page">
      {/* 1. Back to Rankings Navigation */}
      <div>
        <Link
          to={`/ranking?class=${cpcbClass}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F766E] hover:text-[#0B1220] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('ghat_detail.back_to_ranking', 'Back to Risk Rankings')}</span>
        </Link>
      </div>

      {/* 2. Large Cover Photograph with Rich Metadata Overlay */}
      <section className="relative rounded-2xl overflow-hidden bg-[#0B1220] border border-slate-800 text-white shadow-xl">
        <div className="relative aspect-21/9 min-h-[300px] w-full overflow-hidden bg-slate-900">
          <ImageWithFallback
            src={coverImage}
            alt={`${ghatName} comprehensive environmental cover`}
            className="w-full h-full object-cover filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-[#0B1220]/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220]/90 via-[#0B1220]/50 to-transparent" />

          {/* Top Overlays */}
          <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#0B1220]/80 text-[#36CFC9] border border-[#36CFC9]/40 backdrop-blur-xs">
                Rank #{ghat.rank} in Bhopal
              </span>
              <span className="hidden sm:inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20 backdrop-blur-xs">
                CPCB Class {cpcbClass}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <TierBadge tier={ghat.tier} className="text-xs px-3 py-1 shadow-md" />
              <ConfidenceBadge confidence={ghat.confidence} className="text-xs px-3 py-1 shadow-md" />
            </div>
          </div>

          {/* Bottom Title & Details */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 text-[#36CFC9] text-xs font-semibold">
                <MapPin className="w-4 h-4" />
                <span>{ghat.water_body}</span>
                {ghat.lat && ghat.lng && (
                  <>
                    <span className="text-slate-500">·</span>
                    <span className="font-mono text-slate-300 flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-[#36CFC9]" />
                      {ghat.lat.toFixed(4)}°N, {ghat.lng.toFixed(4)}°E
                    </span>
                  </>
                )}
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {ghatName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                {secondaryName} · Designated Immersion Site
              </p>
            </div>

            {/* Score Pill */}
            <div className="bg-[#12243A]/90 border border-slate-700/80 p-3.5 rounded-xl backdrop-blur-md text-right shrink-0">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                {t('ghat_detail.score_label', 'Composite Risk Score')}
              </span>
              <span className="text-3xl font-black font-mono text-white">
                {ghat.score.toFixed(1)}
              </span>
              <span className="text-[10px] text-teal-400 block font-mono">
                / 100 Scale
              </span>
            </div>
          </div>
        </div>

        {/* Verified Insight Banner under Cover */}
        <div className="px-6 py-3 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2.5 text-xs text-slate-300">
          <Sparkles className="w-4 h-4 text-[#36CFC9] shrink-0" />
          <span className="font-semibold text-white">Official Insight:</span>
          <span>{insight}</span>
        </div>
      </section>

      {/* 3. Multi-Image Ghat Environmental Gallery (6 Photos) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#0F766E]" />
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Site Photographic & Limnological Survey
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            6 Photographic Records
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {ghatGallery.map((g, idx) => (
            <div
              key={idx}
              data-glow-card
              data-glow="cyan"
              className="group relative rounded-xl overflow-hidden border border-slate-200 bg-white shadow-2xs hover:shadow-xl hover:border-teal-300 transition-all flex flex-col cursor-pointer select-none"
            >
              <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-900">
                <ImageWithFallback
                  src={g.src}
                  alt={g.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-white/90 text-slate-800">
                  {g.category}
                </span>
                <span className="absolute bottom-1.5 left-1.5 right-1.5 text-[10px] font-bold text-white line-clamp-1">
                  {g.title}
                </span>
              </div>
              <div className="p-2 text-[10px] text-slate-500 line-clamp-2 leading-tight">
                {g.subtitle}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Two-Column Editorial Layout on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Analytical Data & Reasons */}
        <div className="lg:col-span-7 space-y-8">
          {/* Reasons List */}
          <Card
            title={t('ghat_detail.reasons_title', 'Deterministic Risk Evaluation')}
            subtitle="Verified chemical anomalies extracted directly from MPPCB official test reports"
            headerAction={<ShieldCheck className="w-5 h-5 text-[#0F766E]" />}
          >
            <ReasonList reasons={reasons} limit={4} />
          </Card>

          {/* Historical Trend Chart */}
          <Card
            title={t('ghat_detail.trend_title', 'Dissolved Oxygen & BOD Temporal Trend')}
            subtitle="Historical readings (2023–2025) plotted against CPCB Class B bathing limits"
            headerAction={<Activity className="w-5 h-5 text-[#0F766E]" />}
          >
            <TrendChart readings={readings} />
          </Card>

          {/* Suggested Municipal Interventions */}
          <Card
            title={t('ghat_detail.suggested_actions_title', 'Recommended Municipal Interventions')}
            subtitle={t('ghat_detail.suggested_actions_note', 'Targeted environmental management actions')}
            headerAction={<CheckSquare className="w-5 h-5 text-[#0F766E]" />}
          >
            {suggested_actions && suggested_actions.length > 0 ? (
              <ul className="space-y-2.5">
                {suggested_actions.map((actKey, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100"
                  >
                    <CheckSquare className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">
                        {t(`actions.${actKey}`, actKey)}
                      </span>
                      <span className="text-[11px] text-slate-500 mt-0.5 block">
                        Action item prioritized based on recorded DO deficit and post-immersion organic spikes.
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400 italic">{t('common.no_data')}</p>
            )}
          </Card>
        </div>

        {/* Right Column (5 cols): Municipal Actions Gallery & Known Gaps */}
        <div className="lg:col-span-5 space-y-8">
          {/* Municipal Action Gallery Cards */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#0F766E]" />
                <h3 className="text-sm font-bold text-slate-900">
                  Municipal Action Field Protocols
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">BMC Operations</span>
            </div>

            <div className="space-y-3">
              <div className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 flex items-center h-24">
                <ImageWithFallback
                  src="/images/municipal-actions/lake-cleanup-boat.webp"
                  alt="Lake cleanup boat"
                  className="w-1/3 h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="p-3 w-2/3 space-y-0.5 text-white">
                  <span className="text-[10px] font-bold uppercase text-[#36CFC9] block">Immediate Protocol</span>
                  <span className="text-xs font-bold block">Mechanized Silt & Debris Skimming</span>
                  <p className="text-[10px] text-slate-300 line-clamp-1">Deployment of weed harvesters to clear floral biomass.</p>
                </div>
              </div>

              <div className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 flex items-center h-24">
                <ImageWithFallback
                  src="/images/municipal-actions/lake-aeration-diffusers.webp"
                  alt="Lake aeration"
                  className="w-1/3 h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="p-3 w-2/3 space-y-0.5 text-white">
                  <span className="text-[10px] font-bold uppercase text-amber-300 block">Aeration Intervention</span>
                  <span className="text-xs font-bold block">Micro-Bubble Surface Aerators</span>
                  <p className="text-[10px] text-slate-300 line-clamp-1">Preventing chronic anoxic collapse in enclosed kunds.</p>
                </div>
              </div>

              <div className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 flex items-center h-24">
                <ImageWithFallback
                  src="/images/municipal-actions/waste-segregation-ghat.webp"
                  alt="Waste segregation"
                  className="w-1/3 h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="p-3 w-2/3 space-y-0.5 text-white">
                  <span className="text-[10px] font-bold uppercase text-emerald-300 block">Civic Segregation</span>
                  <span className="text-xs font-bold block">Containment Boom & Barrier Separation</span>
                  <p className="text-[10px] text-slate-300 line-clamp-1">Physical isolation of immersion waste from open lake water.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Civic Directives & News Media Citation */}
          {mediaCitation && (
            <div
              data-glow-card
              data-glow="cyan"
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3 cursor-pointer select-none transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Newspaper className="w-4 h-4 text-[#0F766E]" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Civic Directives & Media Citation
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-[#1E40AF] font-bold border border-blue-200">
                  {mediaCitation.source} · {mediaCitation.date}
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-800 leading-snug">
                {mediaCitation.title}
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {mediaCitation.excerpt}
              </p>

              <a
                href={mediaCitation.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#E8F7F5] hover:bg-[#0F766E] text-[#0F766E] hover:text-white text-xs font-semibold border border-[#36CFC9]/40 transition-colors w-full mt-1"
              >
                <span>Read Verified Media Coverage</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Known Data Limitations Accordion */}
          <KnownGapsBanner gaps={known_gaps} />
        </div>
      </div>

      {/* 5. Sampling Coverage Matrix */}
      <section>
        <Card
          title={t('ghat_detail.coverage_title', 'Multi-Year Sampling Coverage Matrix')}
          subtitle={t('ghat_detail.coverage_subtitle', 'Audit of official MPPCB samples across Pre, During, and Post phases (2023–2025)')}
          headerAction={<Layers className="w-5 h-5 text-[#0F766E]" />}
        >
          <CoverageMatrix coverage={coverage} />
        </Card>
      </section>

      {/* 6. Comprehensive Multi-Filter Readings Table */}
      <section>
        <Card
          title={t('ghat_detail.readings_title', 'Official Water Quality Test Readings & Traceability')}
          subtitle={t('ghat_detail.readings_subtitle', 'Filterable table with direct page references to MPPCB annual PDF reports')}
          headerAction={<Droplets className="w-5 h-5 text-[#0F766E]" />}
        >
          <ReadingsTable readings={readings} />
        </Card>
      </section>
    </div>
  );
}
