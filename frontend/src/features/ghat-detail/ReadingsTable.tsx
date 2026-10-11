import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Filter, Search } from 'lucide-react';
import { ReadingCell } from '../../components/ReadingCell';
import { SourceChip } from './SourceChip';
import type { components } from '../../api/schema';

type Reading = components['schemas']['Reading'];

type Props = {
  readings: Reading[];
  className?: string;
};

export function ReadingsTable({ readings, className = '' }: Props) {
  const { t } = useTranslation();
  const [search, setSearch] = useState<string>('');
  const [selectedParam, setSelectedParam] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedFestival, setSelectedFestival] = useState<string>('all');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Extract distinct parameters and years
  const parameters = useMemo(() => {
    const set = new Set<string>();
    readings.forEach((r) => set.add(r.parameter));
    return Array.from(set).sort();
  }, [readings]);

  const years = useMemo(() => {
    const set = new Set<number>();
    readings.forEach((r) => set.add(r.year));
    return Array.from(set).sort((a, b) => b - a);
  }, [readings]);

  // Filtered readings
  const filteredReadings = useMemo(() => {
    return readings.filter((r) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const paramMatch = r.parameter.toLowerCase().includes(q);
        const valueMatch = (r.value_as_printed ?? '').toLowerCase().includes(q);
        if (!paramMatch && !valueMatch) return false;
      }
      if (selectedParam !== 'all' && r.parameter !== selectedParam) return false;
      if (selectedYear !== 'all' && r.year !== Number(selectedYear)) return false;
      if (selectedFestival !== 'all' && r.festival !== selectedFestival) return false;
      if (selectedPhase !== 'all' && r.phase !== selectedPhase) return false;
      if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;
      return true;
    });
  }, [readings, search, selectedParam, selectedYear, selectedFestival, selectedPhase, selectedStatus]);

  return (
    <div className={`space-y-4 ${className}`} data-testid="readings-table">
      {/* Comprehensive Filter Controls */}
      <div className="flex flex-wrap items-center gap-2.5 p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Filters:</span>
        </div>

        {/* Text Search */}
        <div className="relative min-w-[150px]">
          <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search parameter..."
            className="w-full pl-7 pr-2 py-1 bg-white border border-slate-300 rounded-md text-xs placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
          />
        </div>

        {/* Parameter filter */}
        <select
          value={selectedParam}
          onChange={(e) => setSelectedParam(e.target.value)}
          aria-label={t('ghat_detail.filter_parameter')}
          className="bg-white border border-slate-300 rounded-md px-2.5 py-1 text-slate-700 text-xs focus:ring-1 focus:ring-blue-500 cursor-pointer"
        >
          <option value="all">{t('ghat_detail.filter_all_parameters')}</option>
          {parameters.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        {/* Year filter */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          aria-label={t('ghat_detail.filter_year')}
          className="bg-white border border-slate-300 rounded-md px-2.5 py-1 text-slate-700 text-xs focus:ring-1 focus:ring-blue-500 cursor-pointer"
        >
          <option value="all">{t('ghat_detail.filter_all_years')}</option>
          {years.map((y) => (
            <option key={y} value={String(y)}>
              {y}
            </option>
          ))}
        </select>

        {/* Festival filter */}
        <select
          value={selectedFestival}
          onChange={(e) => setSelectedFestival(e.target.value)}
          className="bg-white border border-slate-300 rounded-md px-2.5 py-1 text-slate-700 text-xs focus:ring-1 focus:ring-blue-500 cursor-pointer"
          aria-label="Filter by festival"
        >
          <option value="all">All Festivals</option>
          <option value="Ganesh">Ganesh Visarjan</option>
          <option value="Durga">Durga Visarjan</option>
        </select>

        {/* Phase filter */}
        <select
          value={selectedPhase}
          onChange={(e) => setSelectedPhase(e.target.value)}
          className="bg-white border border-slate-300 rounded-md px-2.5 py-1 text-slate-700 text-xs focus:ring-1 focus:ring-blue-500 cursor-pointer"
          aria-label="Filter by sampling phase"
        >
          <option value="all">All Phases</option>
          <option value="pre">Pre-immersion</option>
          <option value="during">During immersion</option>
          <option value="after">Post-immersion</option>
        </select>

        {/* Status filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-white border border-slate-300 rounded-md px-2.5 py-1 text-slate-700 text-xs focus:ring-1 focus:ring-blue-500 cursor-pointer"
          aria-label="Filter by sample status"
        >
          <option value="all">All Statuses</option>
          <option value="measured">Measured</option>
          <option value="bdl">Below Detection Limit (BDL)</option>
          <option value="not_sampled">Not Tested</option>
        </select>

        <span className="text-slate-400 text-[11px] ml-auto font-mono">
          {filteredReadings.length} readings
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-xs text-left divide-y divide-slate-200">
          <thead className="bg-slate-100 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-2.5 px-3">{t('reading.table_parameter')}</th>
              <th className="py-2.5 px-3">{t('reading.table_year')}</th>
              <th className="py-2.5 px-3">{t('reading.table_festival')}</th>
              <th className="py-2.5 px-3">{t('reading.table_phase')}</th>
              <th className="py-2.5 px-3">{t('reading.table_status')}</th>
              <th className="py-2.5 px-3">{t('reading.table_value')}</th>
              <th className="py-2.5 px-3 text-right">{t('reading.table_source')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredReadings.map((reading) => (
              <tr key={reading.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-2 px-3 font-semibold text-slate-800">{reading.parameter}</td>
                <td className="py-2 px-3 text-slate-600 font-mono">{reading.year}</td>
                <td className="py-2 px-3 text-slate-600">
                  {t(`reading.festival.${reading.festival}`, reading.festival)}
                </td>
                <td className="py-2 px-3 text-slate-600">
                  {t(`reading.phase.${reading.phase}`, reading.phase)}
                </td>
                <td className="py-2 px-3">
                  <span className="capitalize text-slate-500">
                    {t(`reading.status.${reading.status}`)}
                  </span>
                </td>
                <td className="py-2 px-3">
                  <ReadingCell reading={reading} />
                </td>
                <td className="py-2 px-3 text-right">
                  <SourceChip reading={reading} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const WaterQualityReadingsTable = ReadingsTable;
