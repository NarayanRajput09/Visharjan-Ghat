import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  BarChart2,
  ShieldCheck,
  ArrowRight,
  Droplets,
  MapPin,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useRanking } from '../../api/hooks';
import { GHATS_DATA } from '../../data/ghats';
import { GALLERY_ITEMS } from '../../data/gallery';
import type { GhatRecord, RiskTier, GalleryRecord } from '../../types';

// Image-rich specialized components
import { HeroPanel } from '../../components/dashboard/HeroPanel';
import { RiskSummary } from '../../components/dashboard/RiskSummary';
import { PhotoGallery } from '../../components/gallery/PhotoGallery';
import { Lightbox } from '../../components/gallery/Lightbox';
import { GhatSearch } from '../../components/ghats/GhatSearch';
import { GhatGrid } from '../../components/ghats/GhatGrid';
import { GhatDetailDrawer } from '../../components/ghats/GhatDetailDrawer';
import { WaterQualityAnalytics } from '../../components/charts/WaterQualityAnalytics';
import { BhopalMap } from '../map/GhatMap';
import { MunicipalActionsPanel } from '../../components/ghats/MunicipalActionsPanel';
import { EnvironmentalInsights } from '../../components/dashboard/EnvironmentalInsights';
import { EnvironmentalAssistant } from '../../components/assistant/EnvironmentalAssistant';
import { TierBadge } from '../../components/TierBadge';

export function OverviewDashboardPage() {
  const { i18n } = useTranslation();
  const [selectedTier, setSelectedTier] = useState<RiskTier | 'all'>('all');
  const [selectedGhat, setSelectedGhat] = useState<GhatRecord | null>(null);
  const [lightboxItem, setLightboxItem] = useState<GalleryRecord | null>(null);
  const [focusedCoords, setFocusedCoords] = useState<[number, number] | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);

  // Optional backend hook to sync with FastAPI if running
  const { data: rankingData, isLoading } = useRanking('B');

  // Merge backend score/rank if available, preserving all rich data
  const mergedGhats: GhatRecord[] = GHATS_DATA.map((ghat) => {
    const apiMatch = rankingData?.ghats?.find((g) => g.slug === ghat.slug);
    if (apiMatch) {
      return {
        ...ghat,
        score: apiMatch.score ?? ghat.score,
        rank: apiMatch.rank ?? ghat.rank,
        risk_tier: (apiMatch.tier as RiskTier) ?? ghat.risk_tier,
      };
    }
    return ghat;
  });

  const filteredGhats =
    selectedTier === 'all'
      ? mergedGhats
      : mergedGhats.filter((g) => g.risk_tier === selectedTier);

  // Smooth scroll refs
  const mapSectionRef = useRef<HTMLElement>(null);
  const ghatsSectionRef = useRef<HTMLElement>(null);
  const analyticsSectionRef = useRef<HTMLElement>(null);

  const scrollToMap = () => {
    mapSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToGhats = () => {
    ghatsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToAnalytics = () => {
    analyticsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSelectGhatFromSearch = (ghat: GhatRecord) => {
    setSelectedGhat(ghat);
    setFocusedCoords([ghat.latitude, ghat.longitude]);
  };

  const handleViewOnMapFromSearch = (lat: number, lng: number) => {
    setFocusedCoords([lat, lng]);
    scrollToMap();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-12" data-testid="overview-dashboard-page">
      {/* 1. Authentic Photography Hero Panel with 2x2 Metrics & Lightbox Previews */}
      <HeroPanel
        onExploreClick={scrollToGhats}
        onWaterQualityClick={scrollToAnalytics}
        onOpenLightbox={(item) => setLightboxItem(item)}
      />

      {/* 2. Prominent Autocomplete Search Bar with Thumbnail & Keyboard Navigation */}
      <section aria-label="Ghat Intelligence Search" className="max-w-3xl mx-auto w-full -mt-4">
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
          <GhatSearch
            onSelectGhat={handleSelectGhatFromSearch}
            onViewOnMap={handleViewOnMapFromSearch}
            placeholder="Search Bhopal immersion ghats by name, lake, or landmark (e.g. Bairagarh, Khatlapura)..."
          />
        </div>
      </section>

      {/* 3. Three Large Interactive Risk Cards with Dynamic Filters */}
      <section aria-label="Risk Summary Overview">
        <RiskSummary
          ghats={mergedGhats}
          selectedTier={selectedTier}
          onSelectTier={(tier) => setSelectedTier(tier)}
        />
      </section>

      {/* 4. Six-Image Bhopal Environmental Photography Gallery */}
      <section aria-label="Bhopal Environmental Gallery">
        <PhotoGallery
          onViewOnMap={(lat, lng) => {
            setFocusedCoords([lat, lng]);
            scrollToMap();
          }}
        />
      </section>

      {/* 5. GIS Intelligence: Interactive Map (8 cols) + Directory Panel (4 cols) */}
      <section ref={mapSectionRef} className="space-y-4" aria-label="GIS Mapping Intelligence">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#059669]" />
              <span>Bhopal Immersion Ghats GIS Intelligence</span>
            </h2>
            <p className="text-xs text-slate-500">
              Interactive geographic tracking across Bhoj Wetland, Upper Lake, Lower Lake, Shahpura Lake, and Hathaikheda Dam.
            </p>
          </div>
          <Link
            to="/ranking"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#059669] hover:text-[#0F172A] transition-colors self-start sm:self-auto"
          >
            <span>Complete Risk Table</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Interactive Map (8 cols) */}
          <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <BhopalMap
              ghats={filteredGhats}
              focusedCoords={focusedCoords}
              onSelectGhatSlug={(slug) => {
                const found = mergedGhats.find((g) => g.slug === slug);
                if (found) setSelectedGhat(found);
              }}
            />
          </div>

          {/* Adjacent Ghat Directory Panel (4 cols) */}
          <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                Monitored Sites Directory
              </h3>
              <div className="flex items-center gap-2">
                {selectedTier !== 'all' && (
                  <button
                    onClick={() => setSelectedTier('all')}
                    className="text-[10px] font-semibold text-[#059669] hover:underline cursor-pointer"
                  >
                    Reset Filter
                  </button>
                )}
                <span className="text-[11px] font-mono text-slate-500">
                  {filteredGhats.length} {filteredGhats.length === 1 ? 'Location' : 'Locations'}
                </span>
              </div>
            </div>

            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {filteredGhats.map((ghat) => {
                const name = i18n.language === 'hi' ? ghat.name_hi : ghat.name_en;
                return (
                  <button
                    key={ghat.slug}
                    data-glow-card
                    data-glow-tier={ghat.risk_tier}
                    type="button"
                    onClick={() => {
                      setSelectedGhat(ghat);
                      setFocusedCoords([ghat.latitude, ghat.longitude]);
                    }}
                    className="w-full text-left group flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/70 hover:bg-[#E8F7F5] hover:border-[#059669]/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-md overflow-hidden bg-slate-800 shrink-0">
                        <img
                          src={ghat.imageUrl}
                          alt={ghat.name_en}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                        />
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] font-bold text-slate-400">
                            #{ghat.rank}
                          </span>
                          <span className="text-xs font-bold text-slate-800 group-hover:text-[#059669] transition-colors truncate">
                            {name}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 block truncate">
                          {ghat.water_body}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <TierBadge tier={ghat.risk_tier} className="text-[10px] px-1.5 py-0.2" />
                      <span className="font-mono text-xs font-bold text-slate-700">
                        {ghat.score.toFixed(1)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={() => setIsAssistantOpen(true)}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-gradient-to-r from-[#1E40AF] to-[#059669] text-white text-xs font-semibold shadow-xs hover:opacity-95 transition-opacity cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
                <span>Ask AI Environmental Assistant</span>
              </button>

              <Link
                to="/ranking"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-50 hover:bg-[#E8F7F5] text-[#0F766E] text-xs font-semibold transition-colors border border-slate-200"
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Open Full Risk Ranking Table</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. All Seven Immersion Ghats — Photographic Cards Grid */}
      <section ref={ghatsSectionRef} aria-label="Seven Monitored Immersion Ghats" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
              <Droplets className="w-5 h-5 text-[#059669]" />
              <span>All Monitored Immersion Ghats</span>
            </h2>
            <p className="text-xs text-slate-500">
              Verified photographic records, water quality metrics (DO/BOD), and deterministic CPCB Class B scoring.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
              Showing {filteredGhats.length} of {mergedGhats.length}
            </span>
            {selectedTier !== 'all' && (
              <button
                onClick={() => setSelectedTier('all')}
                className="text-xs font-semibold text-[#059669] hover:underline cursor-pointer"
              >
                Show All
              </button>
            )}
          </div>
        </div>

        <GhatGrid
          ghats={filteredGhats}
          onSelectGhat={(ghat) => setSelectedGhat(ghat)}
          isLoading={isLoading}
          language={i18n.language === 'hi' ? 'hi' : 'en'}
        />
      </section>

      {/* 7. Image-Enhanced Environmental Indicators & Scientific Guidance */}
      <EnvironmentalInsights />

      {/* 8. Water Quality Analytics: Recharts DO/BOD Comparisons & Historical Trends */}
      <section ref={analyticsSectionRef} aria-label="Lake Water Quality Intelligence" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Droplets className="w-5 h-5 text-[#059669]" />
              <span>Lake Water Quality Intelligence (MPPCB 2023–2025)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Multi-year limnological comparisons across Pre-, During-, and Post-Visarjan festival phases.
            </p>
          </div>
          <Link
            to="/water-quality"
            className="text-xs font-semibold text-[#059669] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Detailed Visualizations</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <WaterQualityAnalytics
          ghats={mergedGhats}
          onSelectGhat={(ghat) => setSelectedGhat(ghat)}
        />
      </section>

      {/* 9. Suggested Municipal Field Operations & Restoration Protocols */}
      <section aria-label="Municipal Field Operations Protocols" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#059669]" />
            <span>Municipal Field Operations & Protocols</span>
          </h2>
        </div>
        <MunicipalActionsPanel compact={false} />
      </section>

      {/* Full Slide-over Drawer for Ghat Detail View */}
      <GhatDetailDrawer
        ghat={selectedGhat}
        onClose={() => setSelectedGhat(null)}
        onViewOnMap={(lat, lng) => {
          setFocusedCoords([lat, lng]);
          setSelectedGhat(null);
          scrollToMap();
        }}
      />

      {/* Full-screen Lightbox for Photographic Previews */}
      <Lightbox
        item={lightboxItem}
        items={GALLERY_ITEMS}
        onClose={() => setLightboxItem(null)}
        onNavigate={(item) => setLightboxItem(item)}
        onViewOnMap={(lat, lng) => {
          setFocusedCoords([lat, lng]);
          setLightboxItem(null);
          scrollToMap();
        }}
      />

      {/* AI Environmental Assistant Drawer */}
      <EnvironmentalAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        onSelectGhatSlug={(slug) => {
          const found = mergedGhats.find((g) => g.slug === slug);
          if (found) {
            setSelectedGhat(found);
            setIsAssistantOpen(false);
          }
        }}
      />
    </div>
  );
}
