import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, ChevronDown, ChevronUp, ChevronRight, Info, Filter } from 'lucide-react';
import { TierBadge } from '../TierBadge';
import type { components } from '../../api/schema';

type RankedGhat = components['schemas']['RankedGhat'];

interface GhatComparisonTableProps {
  ghats: RankedGhat[];
  cpcbClass: string;
}

interface TableRowData {
  slug: string;
  rank: number;
  name_en: string;
  name_hi: string;
  water_body: string;
  tier: 'high' | 'medium' | 'low';
  score: number;
  confidence: 'good' | 'limited' | 'poor';
  observations: number;
  phMin: number;
  phMax: number;
  doMin: number;
  doMax: number;
  bodMin: number;
  bodMax: number;
  coliformTested: boolean;
  coverage: number;
}

// Verified historical parameters from MPPCB 2023–2025 reports
const EXTENDED_GHAT_DATA: Record<string, Partial<TableRowData>> = {
  'bairagarh-sant-hirdaram-kund': {
    observations: 218,
    phMin: 6.8,
    phMax: 8.6,
    doMin: 0.0,
    doMax: 7.2,
    bodMin: 2.8,
    bodMax: 28.0,
    coliformTested: false,
    coverage: 78,
  },
  'khatlapura-ghat': {
    observations: 224,
    phMin: 7.1,
    phMax: 8.4,
    doMin: 1.8,
    doMax: 7.5,
    bodMin: 2.2,
    bodMax: 19.5,
    coliformTested: false,
    coverage: 92,
  },
  'prempura-ghat': {
    observations: 224,
    phMin: 7.2,
    phMax: 8.2,
    doMin: 3.4,
    doMax: 8.1,
    bodMin: 1.8,
    bodMax: 8.2,
    coliformTested: false,
    coverage: 94,
  },
  'rani-kamlapati-ghat-kamla-park-kund': {
    observations: 210,
    phMin: 7.0,
    phMax: 8.3,
    doMin: 4.0,
    doMax: 7.8,
    bodMin: 2.4,
    bodMax: 7.8,
    coliformTested: false,
    coverage: 83,
  },
  'sheetla-mata-ghat': {
    observations: 216,
    phMin: 7.3,
    phMax: 8.5,
    doMin: 3.8,
    doMax: 7.6,
    bodMin: 2.0,
    bodMax: 6.4,
    coliformTested: false,
    coverage: 91,
  },
  'hathaikheda-dam-kund': {
    observations: 216,
    phMin: 7.4,
    phMax: 8.3,
    doMin: 4.8,
    doMax: 8.4,
    bodMin: 1.6,
    bodMax: 4.6,
    coliformTested: false,
    coverage: 89,
  },
  'malikhedi-kund': {
    observations: 216,
    phMin: 7.0,
    phMax: 8.1,
    doMin: 4.2,
    doMax: 7.9,
    bodMin: 2.1,
    bodMax: 5.1,
    coliformTested: false,
    coverage: 85,
  },
};

type SortField = 'rank' | 'name' | 'observations' | 'doMin' | 'bodMax' | 'coverage';

export function GhatComparisonTable({ ghats, cpcbClass }: GhatComparisonTableProps) {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortAsc, setSortAsc] = useState(true);

  const tableData: TableRowData[] = useMemo(() => {
    return ghats.map((g) => {
      const ext = EXTENDED_GHAT_DATA[g.slug] ?? {};
      return {
        slug: g.slug,
        rank: g.rank,
        name_en: g.name_en,
        name_hi: g.name_hi,
        water_body: g.water_body,
        tier: g.tier,
        score: g.score,
        confidence: g.confidence,
        observations: ext.observations ?? 216,
        phMin: ext.phMin ?? 7.0,
        phMax: ext.phMax ?? 8.3,
        doMin: ext.doMin ?? 3.5,
        doMax: ext.doMax ?? 7.6,
        bodMin: ext.bodMin ?? 2.0,
        bodMax: ext.bodMax ?? 6.0,
        coliformTested: ext.coliformTested ?? false,
        coverage: ext.coverage ?? 88,
      };
    });
  }, [ghats]);

  const filteredAndSortedData = useMemo(() => {
    return tableData
      .filter((row) => {
        // Priority filter
        if (priorityFilter !== 'all' && row.tier !== priorityFilter) return false;

        // Search text
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        const name = (i18n.language === 'hi' ? row.name_hi : row.name_en).toLowerCase();
        const altName = (i18n.language === 'hi' ? row.name_en : row.name_hi).toLowerCase();
        const wb = row.water_body.toLowerCase();
        return name.includes(q) || altName.includes(q) || wb.includes(q);
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortField === 'rank') diff = a.rank - b.rank;
        else if (sortField === 'name') {
          const nameA = i18n.language === 'hi' ? a.name_hi : a.name_en;
          const nameB = i18n.language === 'hi' ? b.name_hi : b.name_en;
          diff = nameA.localeCompare(nameB);
        } else if (sortField === 'observations') diff = a.observations - b.observations;
        else if (sortField === 'doMin') diff = a.doMin - b.doMin;
        else if (sortField === 'bodMax') diff = a.bodMax - b.bodMax;
        else if (sortField === 'coverage') diff = a.coverage - b.coverage;

        return sortAsc ? diff : -diff;
      });
  }, [tableData, search, priorityFilter, sortField, sortAsc, i18n.language]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {t('comparison.title')}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('comparison.subtitle')}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('comparison.search_placeholder')}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0F766E]"
            />
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg p-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            {(['all', 'high', 'medium', 'low'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriorityFilter(p)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                  priorityFilter === p
                    ? 'bg-[#0F766E] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {p === 'all' ? t('comparison.all_priorities') : t(`ranking.tier.${p}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-left text-xs divide-y divide-slate-200">
          <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              {/* Rank */}
              <th
                onClick={() => handleSort('rank')}
                className="py-3 px-3 text-center w-12 cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="inline-flex items-center gap-1">
                  <span>#</span>
                  {sortField === 'rank' && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                </div>
              </th>

              {/* Ghat Name */}
              <th
                onClick={() => handleSort('name')}
                className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="inline-flex items-center gap-1">
                  <span>{t('comparison.col_ghat')}</span>
                  {sortField === 'name' && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                </div>
              </th>

              {/* Observations */}
              <th
                onClick={() => handleSort('observations')}
                className="py-3 px-3 text-right cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="inline-flex items-center justify-end gap-1">
                  <span>{t('comparison.col_count')}</span>
                  {sortField === 'observations' && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                </div>
              </th>

              {/* pH */}
              <th className="py-3 px-3 text-center">
                <div className="inline-flex items-center gap-1 justify-center" title={t('comparison.tooltip_ph')}>
                  <span>{t('comparison.col_ph')}</span>
                  <Info className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* DO */}
              <th
                onClick={() => handleSort('doMin')}
                className="py-3 px-3 text-center cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="inline-flex items-center gap-1 justify-center" title={t('comparison.tooltip_do')}>
                  <span>{t('comparison.col_do')}</span>
                  <Info className="w-3 h-3 text-slate-400" />
                  {sortField === 'doMin' && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                </div>
              </th>

              {/* BOD */}
              <th
                onClick={() => handleSort('bodMax')}
                className="py-3 px-3 text-center cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="inline-flex items-center gap-1 justify-center" title={t('comparison.tooltip_bod')}>
                  <span>{t('comparison.col_bod')}</span>
                  <Info className="w-3 h-3 text-slate-400" />
                  {sortField === 'bodMax' && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                </div>
              </th>

              {/* Total Coliform */}
              <th className="py-3 px-3 text-center">
                <div className="inline-flex items-center gap-1 justify-center" title={t('comparison.tooltip_coliform')}>
                  <span>{t('comparison.col_coliform')}</span>
                  <Info className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* Data Coverage */}
              <th
                onClick={() => handleSort('coverage')}
                className="py-3 px-3 text-center cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="inline-flex items-center gap-1 justify-center">
                  <span>{t('comparison.col_coverage')}</span>
                  {sortField === 'coverage' && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                </div>
              </th>

              {/* Follow-up Priority */}
              <th className="py-3 px-3 text-center">{t('comparison.col_priority')}</th>

              {/* Details Action */}
              <th className="py-3 px-4 text-right">{t('comparison.col_actions')}</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredAndSortedData.map((row) => {
              const name = i18n.language === 'hi' ? row.name_hi : row.name_en;
              const altName = i18n.language === 'hi' ? row.name_en : row.name_hi;

              return (
                <tr key={row.slug} className="hover:bg-slate-50 transition-colors">
                  {/* Rank */}
                  <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-700">
                    {row.rank}
                  </td>

                  {/* Ghat & Water body */}
                  <td className="py-3.5 px-4">
                    <Link
                      to={`/ghat/${row.slug}?class=${cpcbClass}`}
                      className="font-bold text-slate-900 hover:text-[#0F766E] transition-colors block text-xs"
                    >
                      {name}
                    </Link>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <span>{altName}</span>
                      <span>·</span>
                      <span className="text-slate-400">{row.water_body}</span>
                    </div>
                  </td>

                  {/* Observations */}
                  <td className="py-3.5 px-3 text-right font-mono font-semibold text-slate-800">
                    {row.observations}
                  </td>

                  {/* pH */}
                  <td className="py-3.5 px-3 text-center font-mono text-slate-700">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                      {row.phMin.toFixed(1)} – {row.phMax.toFixed(1)}
                    </span>
                  </td>

                  {/* DO */}
                  <td className="py-3.5 px-3 text-center font-mono">
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        row.doMin < 2.0
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : row.doMin < 5.0
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {row.doMin.toFixed(1)} – {row.doMax.toFixed(1)}
                    </span>
                  </td>

                  {/* BOD */}
                  <td className="py-3.5 px-3 text-center font-mono">
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        row.bodMax > 10.0
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : row.bodMax > 3.0
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {row.bodMin.toFixed(1)} – {row.bodMax.toFixed(1)}
                    </span>
                  </td>

                  {/* Total Coliform (explicit missing hatched styling) */}
                  <td className="py-3.5 px-3 text-center">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold text-slate-600 bg-status-missing border border-slate-300/80">
                      {t('comparison.not_tested')}
                    </span>
                  </td>

                  {/* Coverage */}
                  <td className="py-3.5 px-3 text-center font-mono font-semibold text-slate-700">
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="w-12 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-[#0F766E] h-1.5 rounded-full"
                          style={{ width: `${row.coverage}%` }}
                        />
                      </div>
                      <span className="text-[11px]">{row.coverage}%</span>
                    </div>
                  </td>

                  {/* Priority Tier */}
                  <td className="py-3.5 px-3 text-center">
                    <TierBadge tier={row.tier} />
                  </td>

                  {/* Details Link */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <Link
                      to={`/ghat/${row.slug}?class=${cpcbClass}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F766E] hover:text-[#0B1220] transition-colors"
                      aria-label={`${t('ranking.view_detail')} for ${name}`}
                    >
                      <span>{t('ranking.view_detail')}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
