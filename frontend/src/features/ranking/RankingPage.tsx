import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FileText, Download, Info, Search, Loader2, ShieldCheck, Award, LayoutGrid, List } from 'lucide-react';
import { useRanking, useCreateBrief } from '../../api/hooks';
import { api } from '../../api/client';
import { RankingTable } from './RankingTable';
import { GhatRankingGrid } from './GhatRankingGrid';
import { GhatComparisonTable } from '../../components/ghats/GhatComparisonTable';
import { PrioritizationSection } from '../../components/dashboard/PrioritizationSection';
import { Button } from '../../components/Button';
import { Banner } from '../../components/Banner';
import { TableSkeleton } from '../../components/Skeleton';
import type { components } from '../../api/schema';

type CPCBClass = components['schemas']['CPCBClass'];

export function RankingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const cpcbClass = (searchParams.get('class') ?? 'B') as CPCBClass;
  const initialTier = searchParams.get('tier') ?? 'all';
  const [selectedTier, setSelectedTier] = useState<string>(initialTier);
  const [selectedConfidence, setSelectedConfidence] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const { data: rankingData, isLoading, isError, refetch } = useRanking(cpcbClass);
  const createBriefMutation = useCreateBrief();

  const handleClassChange = (newClass: CPCBClass) => {
    setSearchParams((prev) => {
      prev.set('class', newClass);
      return prev;
    });
  };

  const handleMakeBrief = async () => {
    try {
      const result = await createBriefMutation.mutateAsync(cpcbClass);
      navigate(`/brief/${result.brief_id}`);
    } catch (err) {
      console.error('Failed to generate brief:', err);
    }
  };

  const ghats = rankingData?.ghats ?? [];

  // Filter ghats by search, tier, and confidence
  const filteredGhats = useMemo(() => {
    return ghats.filter((g) => {
      if (selectedTier !== 'all' && g.tier !== selectedTier) return false;
      if (selectedConfidence !== 'all' && g.confidence !== selectedConfidence) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const name = (i18n.language === 'hi' ? g.name_hi : g.name_en).toLowerCase();
        const water = g.water_body.toLowerCase();
        return name.includes(query) || water.includes(query);
      }
      return true;
    });
  }, [ghats, selectedTier, selectedConfidence, searchQuery, i18n.language]);

  const highCount = ghats.filter((g) => g.tier === 'high').length;
  const mediumCount = ghats.filter((g) => g.tier === 'medium').length;
  const lowCount = ghats.filter((g) => g.tier === 'low').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10" data-testid="ranking-page">
      {/* 1. Header Section */}
      <div className="space-y-4 border-b border-slate-200 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1E40AF] text-[10px] font-mono font-bold border border-blue-200 uppercase tracking-wider">
                Official MPPCB Evaluation
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Ganesh & Durga Cycles (2023–2025)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Visarjan Ghat Risk Ranking
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Risk ranking of the 7 Bhopal immersion ghats evaluated against official MPPCB water test reports (2023–2025) using deterministic CPCB criteria.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <Button
              variant="primary"
              size="sm"
              onClick={handleMakeBrief}
              disabled={createBriefMutation.isPending}
              icon={
                createBriefMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <FileText className="w-3.5 h-3.5" />
                )
              }
            >
              {createBriefMutation.isPending
                ? t('ranking.generating_brief')
                : t('ranking.make_brief')}
            </Button>

            <a
              href={api.getExportCsvUrl(cpcbClass)}
              download="visarjan_ghats_ranking.csv"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t('ranking.download_csv')}</span>
            </a>
          </div>
        </div>

        {/* Risk Distribution Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Total Sites</span>
              <span className="text-xs font-bold text-slate-800 font-mono">7 Designated Ghats</span>
            </div>
          </div>

          <div className="bg-red-50/60 p-2.5 rounded-lg border border-red-200 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0" />
            <div>
              <span className="text-[10px] text-red-700 uppercase font-semibold block">High Priority</span>
              <span className="text-xs font-bold text-red-900 font-mono">{highCount} Sites</span>
            </div>
          </div>

          <div className="bg-amber-50/60 p-2.5 rounded-lg border border-amber-200 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
            <div>
              <span className="text-[10px] text-amber-700 uppercase font-semibold block">Medium Priority</span>
              <span className="text-xs font-bold text-amber-900 font-mono">{mediumCount} Sites</span>
            </div>
          </div>

          <div className="bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-200 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
            <div>
              <span className="text-[10px] text-emerald-700 uppercase font-semibold block">Low Priority</span>
              <span className="text-xs font-bold text-emerald-900 font-mono">{lowCount} Sites</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Full 5-Way Interactive Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* CPCB Class Selector */}
          <div className="flex items-center gap-2 relative">
            <span className="text-xs font-semibold text-slate-700">
              {t('ranking.cpcb_class_label')}
            </span>
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 border border-slate-200">
              {(['B', 'C', 'D'] as CPCBClass[]).map((cls) => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => handleClassChange(cls)}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                    cpcbClass === cls
                      ? 'bg-[#1E40AF] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  Class {cls}
                </button>
              ))}
            </div>

            {/* Info Tooltip */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowTooltip((p) => !p)}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                aria-label={t('ranking.cpcb_info_tooltip')}
              >
                <Info className="w-4 h-4" />
              </button>

              {showTooltip && (
                <div className="absolute left-0 bottom-full mb-2 w-72 bg-slate-900 text-white text-xs rounded-lg p-3 shadow-xl z-30">
                  <p className="leading-relaxed">{t('ranking.cpcb_info_tooltip')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Risk Tier Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
            <span className="text-slate-500 font-medium">Tier:</span>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="bg-transparent text-slate-800 font-semibold focus:outline-hidden cursor-pointer"
              aria-label="Filter by Risk Tier"
            >
              <option value="all">All Tiers</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
          </div>

          {/* Data Confidence Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedConfidence}
              onChange={(e) => setSelectedConfidence(e.target.value)}
              className="bg-transparent text-slate-800 font-semibold focus:outline-hidden cursor-pointer"
              aria-label="Filter by Confidence"
            >
              <option value="all">All Confidence</option>
              <option value="good">Good Confidence</option>
              <option value="limited">Limited Confidence</option>
              <option value="poor">Poor Confidence</option>
            </select>
          </div>
        </div>

        {/* Search Box and View Mode Toggle */}
        <div className="flex items-center gap-2">
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('ranking.search_placeholder')}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center p-0.5 rounded-lg border border-slate-200 bg-slate-100">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-[#0F766E] shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table View with Thumbnails"
              aria-label="Table view"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-[#0F766E] shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Photographic Cards Grid View"
              aria-label="Grid view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Primary Ranking (Table with Thumbnails or Photographic Grid) */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <TableSkeleton rows={7} cols={6} />
          </div>
        ) : isError ? (
          <Banner
            variant="error"
            title={t('common.error_title')}
            action={
              <button
                onClick={() => void refetch()}
                className="px-3 py-1 bg-red-700 text-white rounded text-xs"
              >
                {t('common.retry')}
              </button>
            }
          >
            {t('common.error_title')}
          </Banner>
        ) : viewMode === 'grid' ? (
          <GhatRankingGrid ghats={filteredGhats} cpcbClass={cpcbClass} />
        ) : (
          <RankingTable ghats={filteredGhats} cpcbClass={cpcbClass} />
        )}
      </div>

      {/* 4. Comprehensive Sortable Ghat Comparison Table */}
      <GhatComparisonTable ghats={filteredGhats} cpcbClass={cpcbClass} />

      {/* 5. Deterministic Prioritization Methodology Section */}
      <PrioritizationSection />
    </div>
  );
}
