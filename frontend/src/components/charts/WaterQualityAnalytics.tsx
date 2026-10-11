import { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { Droplets, Activity, Layers, ArrowUpDown, Download } from 'lucide-react';
import type { GhatRecord } from '../../types';

interface WaterQualityAnalyticsProps {
  ghats: GhatRecord[];
  onSelectGhat?: (ghat: GhatRecord) => void;
  cpcbClass?: string;
}

export function WaterQualityAnalytics({ ghats, onSelectGhat, cpcbClass = 'B' }: WaterQualityAnalyticsProps) {
  const [selectedGhatSlug, setSelectedGhatSlug] = useState<string>('all');
  const [sortField, setSortField] = useState<'rank' | 'lowest_do' | 'peak_bod' | 'score'>('rank');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // DO & BOD comparison dataset
  const comparisonData = ghats.map((g) => ({
    name: g.name_en.replace(' (Sant Hirdaram) Kund', '').replace(' / Kamla Park', '').replace(' / kund', ''),
    fullGhat: g,
    lowest_do: g.lowest_do,
    peak_bod: g.peak_bod,
    score: g.score,
  }));

  // Selected ghat for historical before/during/after trend
  const activeGhatForTrend =
    selectedGhatSlug === 'all'
      ? ghats[0]
      : ghats.find((g) => g.slug === selectedGhatSlug) || ghats[0];

  // Sorted ghats for comparison table
  const sortedGhats = [...ghats].sort((a, b) => {
    let diff = 0;
    if (sortField === 'rank') diff = a.rank - b.rank;
    else if (sortField === 'lowest_do') diff = a.lowest_do - b.lowest_do;
    else if (sortField === 'peak_bod') diff = a.peak_bod - b.peak_bod;
    else if (sortField === 'score') diff = b.score - a.score;
    return sortAsc ? diff : -diff;
  });

  const handleSort = (field: 'rank' | 'lowest_do' | 'peak_bod' | 'score') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleExportCsv = () => {
    const headers = 'Rank,Ghat Name,Water Body,Lowest DO (mg/L),Peak BOD (mg/L),Risk Tier,Score,Latest Sample Date,Data Source\n';
    const rows = sortedGhats
      .map(
        (g) =>
          `${g.rank},"${g.name_en}","${g.water_body}",${g.lowest_do},${g.peak_bod},"${g.risk_tier}",${g.score},"${g.latest_sample_date}","${g.data_provenance.agency}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'visarjan_ghats_water_quality_comparison.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="space-y-8" aria-label="Water Quality Analytics">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-[#059669]" />
            <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">
              Water Quality Analytics & Parametric Evaluations
            </h2>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Empirical comparative analysis benchmarked against CPCB Class {cpcbClass} Outdoor Bathing criteria (2023–2025).
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export Comparison CSV</span>
        </button>
      </div>

      {/* Charts Grid: A. DO Chart & B. BOD Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* A. Dissolved Oxygen Chart */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-[#059669]" />
                <span>Lowest Dissolved Oxygen (DO) by Ghat</span>
              </h3>
              <p className="text-[11px] text-[#64748B]">
                Minimum observed concentration in mg/L (CPCB Standard: ≥ 5.0 mg/L)
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-[#059669] border border-emerald-200">
              Target: ≥ 5.0
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 15, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-25} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 10 }} domain={[0, 8]} />
                <Tooltip
                  contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  formatter={(value: any) => [`${value} mg/L`, 'Lowest DO']}
                />
                <ReferenceLine
                  y={5.0}
                  stroke="#059669"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  label={{ value: 'Class B Standard (5.0)', fill: '#059669', fontSize: 10, position: 'top' }}
                />
                <Bar dataKey="lowest_do" fill="#059669" radius={[4, 4, 0, 0]} name="Lowest DO (mg/L)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* B. BOD Comparison Chart */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#F59E0B]" />
                <span>Peak Biochemical Oxygen Demand (BOD)</span>
              </h3>
              <p className="text-[11px] text-[#64748B]">
                Highest recorded organic loading in mg/L (CPCB Limit: ≤ 3.0 mg/L)
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-50 text-[#F59E0B] border border-amber-200">
              Limit: ≤ 3.0
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 15, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-25} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 10 }} domain={[0, 32]} />
                <Tooltip
                  contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  formatter={(value: any) => [`${value} mg/L`, 'Peak BOD']}
                />
                <ReferenceLine
                  y={3.0}
                  stroke="#EF4444"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  label={{ value: 'Bathing Limit (3.0)', fill: '#EF4444', fontSize: 10, position: 'top' }}
                />
                <Bar dataKey="peak_bod" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Peak BOD (mg/L)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* C. Before-and-After Immersion Trends */}
      <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#059669]" />
              <span>Before-and-After Festival Immersion Trajectory</span>
            </h3>
            <p className="text-[11px] text-[#64748B]">
              Examining temporal drop in DO and organic surge in BOD across Ganesh and Durga cycles.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Select Ghat:</span>
            <select
              value={selectedGhatSlug}
              onChange={(e) => setSelectedGhatSlug(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-[#0F172A] focus:outline-hidden cursor-pointer"
            >
              {ghats.map((g) => (
                <option key={g.slug} value={g.slug}>
                  {g.name_en}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={activeGhatForTrend?.historical_trends ?? []}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <ReferenceLine y={5.0} stroke="#059669" strokeDasharray="3 3" label={{ value: 'DO Standard (5.0)', fill: '#059669', fontSize: 10 }} />
              <ReferenceLine y={3.0} stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'BOD Limit (3.0)', fill: '#EF4444', fontSize: 10 }} />
              <Line type="monotone" dataKey="do" name="DO (mg/L)" stroke="#059669" strokeWidth={2.5} connectNulls={false} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="bod" name="BOD (mg/L)" stroke="#F59E0B" strokeWidth={2} connectNulls={false} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* D. Ghat Comparison Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden space-y-0">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#0F172A]">
            Comprehensive Ghat Parameter Comparison Table
          </h3>
          <span className="text-xs font-mono text-slate-500">
            {sortedGhats.length} Designated Sites
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-200">
            <thead className="bg-slate-100/70 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th
                  onClick={() => handleSort('rank')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-200/50"
                >
                  <div className="flex items-center gap-1">
                    <span>Rank</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3">Ghat Name</th>
                <th className="py-3 px-3">Water Body</th>
                <th
                  onClick={() => handleSort('lowest_do')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-200/50"
                >
                  <div className="flex items-center gap-1">
                    <span>Lowest DO</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('peak_bod')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-200/50"
                >
                  <div className="flex items-center gap-1">
                    <span>Peak BOD</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3">Risk Tier</th>
                <th
                  onClick={() => handleSort('score')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-200/50"
                >
                  <div className="flex items-center gap-1">
                    <span>Score</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3">Sample Date</th>
                <th className="py-3 px-3">Data Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {sortedGhats.map((g) => (
                <tr
                  key={g.id}
                  onClick={() => onSelectGhat?.(g)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-3 font-mono font-bold text-slate-700">#{g.rank}</td>
                  <td className="py-3 px-3 font-bold text-[#0F172A] hover:text-[#059669]">{g.name_en}</td>
                  <td className="py-3 px-3 text-slate-600">{g.water_body}</td>
                  <td className="py-3 px-3 font-mono font-bold text-[#059669]">
                    {g.lowest_do.toFixed(1)} mg/L
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-[#F59E0B]">
                    {g.peak_bod.toFixed(1)} mg/L
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        g.risk_tier === 'high'
                          ? 'bg-red-100 text-red-800'
                          : g.risk_tier === 'medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {g.risk_tier}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-800">{g.score.toFixed(1)}</td>
                  <td className="py-3 px-3 text-slate-500">{g.latest_sample_date}</td>
                  <td className="py-3 px-3 text-slate-400 font-mono text-[10px]">{g.data_provenance.agency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
