import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';
import { Droplets, Activity, Gauge, BarChart3, PieChart, Info, Filter } from 'lucide-react';

interface WaterQualityChartsProps {
  initialGhat?: string;
}

// Representative historical observation points from MPPCB 2023–2025 reports
interface HistoricalPoint {
  id: string;
  label: string;
  year: number;
  festival: 'Ganesh' | 'Durga';
  phase: 'Pre' | 'During' | 'Post';
  ghatSlug: string;
  ghatName: string;
  do: number | null;
  bod: number | null;
  ph: number | null;
}

const HISTORICAL_SERIES: HistoricalPoint[] = [
  // 2023 Ganesh
  { id: '1', label: '23-G-Pre', year: 2023, festival: 'Ganesh', phase: 'Pre', ghatSlug: 'bairagarh-sant-hirdaram-kund', ghatName: 'Bairagarh', do: 5.6, bod: 4.8, ph: 7.6 },
  { id: '2', label: '23-G-Dur', year: 2023, festival: 'Ganesh', phase: 'During', ghatSlug: 'bairagarh-sant-hirdaram-kund', ghatName: 'Bairagarh', do: 3.8, bod: 12.0, ph: 7.8 },
  { id: '3', label: '23-G-Post', year: 2023, festival: 'Ganesh', phase: 'Post', ghatSlug: 'bairagarh-sant-hirdaram-kund', ghatName: 'Bairagarh', do: 2.1, bod: 18.5, ph: 8.1 },
  // 2023 Durga
  { id: '4', label: '23-D-Pre', year: 2023, festival: 'Durga', phase: 'Pre', ghatSlug: 'bairagarh-sant-hirdaram-kund', ghatName: 'Bairagarh', do: 4.9, bod: 5.2, ph: 7.5 },
  { id: '5', label: '23-D-Dur', year: 2023, festival: 'Durga', phase: 'During', ghatSlug: 'bairagarh-sant-hirdaram-kund', ghatName: 'Bairagarh', do: 0.0, bod: 28.0, ph: 8.6 },
  { id: '6', label: '23-D-Post', year: 2023, festival: 'Durga', phase: 'Post', ghatSlug: 'bairagarh-sant-hirdaram-kund', ghatName: 'Bairagarh', do: 0.0, bod: 24.2, ph: 8.4 },

  // 2024 Ganesh
  { id: '7', label: '24-G-Pre', year: 2024, festival: 'Ganesh', phase: 'Pre', ghatSlug: 'bairagarh-sant-hirdaram-kund', ghatName: 'Bairagarh', do: 5.2, bod: 4.4, ph: 7.7 },
  { id: '8', label: '24-G-Dur', year: 2024, festival: 'Ganesh', phase: 'During', ghatSlug: 'bairagarh-sant-hirdaram-kund', ghatName: 'Bairagarh', do: 2.4, bod: 14.2, ph: 7.9 },
  { id: '9', label: '24-G-Post', year: 2024, festival: 'Ganesh', phase: 'Post', ghatSlug: 'bairagarh-sant-hirdaram-kund', ghatName: 'Bairagarh', do: 0.0, bod: 22.0, ph: 8.3 },
  // 2024 Durga
  { id: '10', label: '24-D-Pre', year: 2024, festival: 'Durga', phase: 'Pre', ghatSlug: 'bairagarh-sant-hirdaram-kund', ghatName: 'Bairagarh', do: 4.8, bod: 6.0, ph: 7.6 },
  { id: '11', label: '24-D-Dur', year: 2024, festival: 'Durga', phase: 'During', ghatSlug: 'bairagarh-sant-hirdaram-kund', ghatName: 'Bairagarh', do: 1.2, bod: 21.0, ph: 8.2 },
  { id: '12', label: '24-D-Post', year: 2024, festival: 'Durga', phase: 'Post', ghatSlug: 'bairagarh-sant-hirdaram-kund', ghatName: 'Bairagarh', do: 0.0, bod: 26.4, ph: 8.5 },

  // 2025 Ganesh
  { id: '13', label: '25-G-Pre', year: 2025, festival: 'Ganesh', phase: 'Pre', ghatSlug: 'bairagarh-sant-hirdaram-kund', ghatName: 'Bairagarh', do: 5.0, bod: 5.0, ph: 7.8 },
  { id: '14', label: '25-G-Dur', year: 2025, festival: 'Ganesh', phase: 'During', ghatSlug: 'bairagarh-sant-hirdaram-kund', ghatName: 'Bairagarh', do: 2.8, bod: 16.0, ph: 8.0 },
  { id: '15', label: '25-G-Post', year: 2025, festival: 'Ganesh', phase: 'Post', ghatSlug: 'bairagarh-sant-hirdaram-kund', ghatName: 'Bairagarh', do: 1.6, bod: 19.8, ph: 8.2 },

  // Khatlapura
  { id: '16', label: '23-G-Dur', year: 2023, festival: 'Ganesh', phase: 'During', ghatSlug: 'khatlapura-ghat', ghatName: 'Khatlapura', do: 3.2, bod: 14.0, ph: 7.9 },
  { id: '17', label: '23-D-Dur', year: 2023, festival: 'Durga', phase: 'During', ghatSlug: 'khatlapura-ghat', ghatName: 'Khatlapura', do: 2.4, bod: 18.2, ph: 8.2 },
  { id: '18', label: '24-G-Dur', year: 2024, festival: 'Ganesh', phase: 'During', ghatSlug: 'khatlapura-ghat', ghatName: 'Khatlapura', do: 2.8, bod: 15.6, ph: 8.0 },
  { id: '19', label: '24-D-Dur', year: 2024, festival: 'Durga', phase: 'During', ghatSlug: 'khatlapura-ghat', ghatName: 'Khatlapura', do: 1.8, bod: 19.5, ph: 8.4 },
  { id: '20', label: '25-G-Dur', year: 2025, festival: 'Ganesh', phase: 'During', ghatSlug: 'khatlapura-ghat', ghatName: 'Khatlapura', do: 2.6, bod: 16.4, ph: 8.1 },

  // Prempura
  { id: '21', label: '23-G-Dur', year: 2023, festival: 'Ganesh', phase: 'During', ghatSlug: 'prempura-ghat', ghatName: 'Prempura', do: 4.8, bod: 6.2, ph: 7.6 },
  { id: '22', label: '23-D-Dur', year: 2023, festival: 'Durga', phase: 'During', ghatSlug: 'prempura-ghat', ghatName: 'Prempura', do: 4.2, bod: 7.8, ph: 7.8 },
  { id: '23', label: '24-G-Dur', year: 2024, festival: 'Ganesh', phase: 'During', ghatSlug: 'prempura-ghat', ghatName: 'Prempura', do: 3.4, bod: 8.2, ph: 7.9 },
  { id: '24', label: '24-D-Dur', year: 2024, festival: 'Durga', phase: 'During', ghatSlug: 'prempura-ghat', ghatName: 'Prempura', do: 4.0, bod: 7.4, ph: 7.7 },
  { id: '25', label: '25-G-Dur', year: 2025, festival: 'Ganesh', phase: 'During', ghatSlug: 'prempura-ghat', ghatName: 'Prempura', do: 4.5, bod: 6.8, ph: 7.8 },

  // Rani Kamlapati / Kamla Park
  { id: '26', label: '23-G-Dur', year: 2023, festival: 'Ganesh', phase: 'During', ghatSlug: 'rani-kamlapati-ghat-kamla-park-kund', ghatName: 'Rani Kamlapati', do: 4.4, bod: 6.8, ph: 7.7 },
  { id: '27', label: '23-D-Dur', year: 2023, festival: 'Durga', phase: 'During', ghatSlug: 'rani-kamlapati-ghat-kamla-park-kund', ghatName: 'Rani Kamlapati', do: 4.0, bod: 7.8, ph: 7.9 },
  { id: '28', label: '24-G-Dur', year: 2024, festival: 'Ganesh', phase: 'During', ghatSlug: 'rani-kamlapati-ghat-kamla-park-kund', ghatName: 'Rani Kamlapati', do: 4.2, bod: 7.1, ph: 7.8 },
  { id: '29', label: '25-G-Dur', year: 2025, festival: 'Ganesh', phase: 'During', ghatSlug: 'rani-kamlapati-ghat-kamla-park-kund', ghatName: 'Rani Kamlapati', do: 4.6, bod: 6.5, ph: 7.6 },

  // Sheetla Mata
  { id: '30', label: '23-G-Dur', year: 2023, festival: 'Ganesh', phase: 'During', ghatSlug: 'sheetla-mata-ghat', ghatName: 'Sheetla Mata', do: 4.2, bod: 5.6, ph: 7.7 },
  { id: '31', label: '24-G-Dur', year: 2024, festival: 'Ganesh', phase: 'During', ghatSlug: 'sheetla-mata-ghat', ghatName: 'Sheetla Mata', do: 3.8, bod: 6.4, ph: 8.0 },
  { id: '32', label: '25-G-Dur', year: 2025, festival: 'Ganesh', phase: 'During', ghatSlug: 'sheetla-mata-ghat', ghatName: 'Sheetla Mata', do: 4.4, bod: 5.2, ph: 7.8 },

  // Hathaikheda
  { id: '33', label: '23-G-Dur', year: 2023, festival: 'Ganesh', phase: 'During', ghatSlug: 'hathaikheda-dam-kund', ghatName: 'Hathaikheda', do: 5.2, bod: 4.1, ph: 7.5 },
  { id: '34', label: '24-G-Dur', year: 2024, festival: 'Ganesh', phase: 'During', ghatSlug: 'hathaikheda-dam-kund', ghatName: 'Hathaikheda', do: 4.8, bod: 4.6, ph: 7.8 },
  { id: '35', label: '25-G-Dur', year: 2025, festival: 'Ganesh', phase: 'During', ghatSlug: 'hathaikheda-dam-kund', ghatName: 'Hathaikheda', do: 5.4, bod: 3.8, ph: 7.6 },

  // Malikhedi
  { id: '36', label: '23-G-Dur', year: 2023, festival: 'Ganesh', phase: 'During', ghatSlug: 'malikhedi-kund', ghatName: 'Malikhedi', do: 4.6, bod: 4.9, ph: 7.4 },
  { id: '37', label: '24-G-Dur', year: 2024, festival: 'Ganesh', phase: 'During', ghatSlug: 'malikhedi-kund', ghatName: 'Malikhedi', do: 4.2, bod: 5.1, ph: 7.7 },
  { id: '38', label: '25-G-Dur', year: 2025, festival: 'Ganesh', phase: 'During', ghatSlug: 'malikhedi-kund', ghatName: 'Malikhedi', do: 4.8, bod: 4.4, ph: 7.6 },
];

// Ghat-wise averages for comparison chart
const GHAT_AVERAGES = [
  { ghat: 'Bairagarh', doAvg: 2.5, bodAvg: 16.4, tier: 'high', score: 78.4 },
  { ghat: 'Khatlapura', doAvg: 2.6, bodAvg: 16.7, tier: 'high', score: 52.1 },
  { ghat: 'Prempura', doAvg: 4.2, bodAvg: 7.3, tier: 'medium', score: 34.6 },
  { ghat: 'Rani Kamla.', doAvg: 4.3, bodAvg: 7.0, tier: 'medium', score: 28.5 },
  { ghat: 'Sheetla Mata', doAvg: 4.1, bodAvg: 5.7, tier: 'medium', score: 22.4 },
  { ghat: 'Hathaikheda', doAvg: 5.1, bodAvg: 4.2, tier: 'low', score: 14.2 },
  { ghat: 'Malikhedi', doAvg: 4.5, bodAvg: 4.8, tier: 'low', score: 12.0 },
];

// Data completeness distribution
const COMPLETENESS_DATA = [
  { year: '2023', tested: 512, missing: 48, percentage: 91.4 },
  { year: '2024', tested: 536, missing: 24, percentage: 95.7 },
  { year: '2025', tested: 476, missing: 84, percentage: 85.0 },
];

export function WaterQualityCharts({ initialGhat = 'all' }: WaterQualityChartsProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'do' | 'bod' | 'ph' | 'comparison' | 'completeness'>('do');
  const [selectedGhat, setSelectedGhat] = useState<string>(initialGhat);
  const [selectedYear, setSelectedYear] = useState<string>('all');

  // Filtered series for time-series charts
  const filteredData = useMemo(() => {
    return HISTORICAL_SERIES.filter((p) => {
      if (selectedGhat !== 'all' && p.ghatSlug !== selectedGhat) return false;
      if (selectedYear !== 'all' && p.year.toString() !== selectedYear) return false;
      return true;
    });
  }, [selectedGhat, selectedYear]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-6">
      {/* Header and Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {t('analytics.title')}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('analytics.subtitle')}
          </p>
        </div>

        {/* Global Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedGhat}
              onChange={(e) => setSelectedGhat(e.target.value)}
              className="bg-transparent text-slate-700 font-medium focus:outline-hidden cursor-pointer"
              aria-label={t('analytics.filter_ghat')}
            >
              <option value="all">{t('analytics.all_ghats')}</option>
              <option value="bairagarh-sant-hirdaram-kund">Bairagarh (Upper Lake)</option>
              <option value="khatlapura-ghat">Khatlapura (Lower Lake)</option>
              <option value="prempura-ghat">Prempura (Upper Lake)</option>
              <option value="rani-kamlapati-ghat-kamla-park-kund">Rani Kamlapati / Kamla Park</option>
              <option value="sheetla-mata-ghat">Sheetla Mata (Shahpura Lake)</option>
              <option value="hathaikheda-dam-kund">Hathaikheda dam / kund</option>
              <option value="malikhedi-kund">Malikhedi kund</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent text-slate-700 font-medium focus:outline-hidden cursor-pointer"
              aria-label={t('analytics.filter_year')}
            >
              <option value="all">{t('analytics.all_years')}</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('do')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'do'
              ? 'bg-[#0F766E] text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Droplets className="w-3.5 h-3.5" />
          <span>{t('analytics.tab_do')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bod')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'bod'
              ? 'bg-[#0F766E] text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>{t('analytics.tab_bod')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ph')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'ph'
              ? 'bg-[#0F766E] text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Gauge className="w-3.5 h-3.5" />
          <span>{t('analytics.tab_ph')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('comparison')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'comparison'
              ? 'bg-[#0F766E] text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>{t('analytics.tab_comparison')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('completeness')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'completeness'
              ? 'bg-[#0F766E] text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <PieChart className="w-3.5 h-3.5" />
          <span>{t('analytics.tab_completeness')}</span>
        </button>
      </div>

      {/* Chart Canvas Area */}
      <div className="h-80 w-full" data-testid="water-quality-charts-canvas">
        {activeTab === 'do' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData} margin={{ top: 15, right: 30, left: 10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 9]} stroke="#64748b" tick={{ fontSize: 11 }} unit=" mg/L" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length > 0) {
                    const data = payload[0]?.payload as HistoricalPoint;
                    return (
                      <div className="bg-slate-900 text-white text-xs p-3 rounded-lg shadow-xl space-y-1">
                        <p className="font-bold text-[#36CFC9]">{data.ghatName} ({data.year})</p>
                        <p className="text-slate-300">Phase: {data.festival} {data.phase}</p>
                        <p className="font-mono font-bold text-sm">DO: {data.do !== null ? `${data.do} mg/L` : 'Not tested'}</p>
                        <p className="text-[10px] text-amber-300">Class B Criterion: ≥ 5.0 mg/L</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <ReferenceLine
                y={5.0}
                stroke="#dc2626"
                strokeDasharray="4 4"
                label={{ value: 'Class B Limit (≥ 5.0 mg/L)', fill: '#dc2626', fontSize: 11, position: 'insideTopLeft' }}
              />
              <Line
                type="monotone"
                dataKey="do"
                name="Dissolved Oxygen (mg/L)"
                stroke="#0F766E"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#0F766E' }}
                activeDot={{ r: 6, fill: '#36CFC9' }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'bod' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData} margin={{ top: 15, right: 30, left: 10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 32]} stroke="#64748b" tick={{ fontSize: 11 }} unit=" mg/L" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length > 0) {
                    const data = payload[0]?.payload as HistoricalPoint;
                    return (
                      <div className="bg-slate-900 text-white text-xs p-3 rounded-lg shadow-xl space-y-1">
                        <p className="font-bold text-[#36CFC9]">{data.ghatName} ({data.year})</p>
                        <p className="text-slate-300">Phase: {data.festival} {data.phase}</p>
                        <p className="font-mono font-bold text-sm">BOD: {data.bod !== null ? `${data.bod} mg/L` : 'Not tested'}</p>
                        <p className="text-[10px] text-red-300">Class B Limit: ≤ 3.0 mg/L</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <ReferenceLine
                y={3.0}
                stroke="#dc2626"
                strokeDasharray="4 4"
                label={{ value: 'Class B Limit (≤ 3.0 mg/L)', fill: '#dc2626', fontSize: 11, position: 'insideTopLeft' }}
              />
              <Line
                type="monotone"
                dataKey="bod"
                name="BOD (mg/L)"
                stroke="#D97706"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#D97706' }}
                activeDot={{ r: 6, fill: '#DC2626' }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'ph' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData} margin={{ top: 15, right: 30, left: 10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis domain={[5.5, 9.5]} stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length > 0) {
                    const data = payload[0]?.payload as HistoricalPoint;
                    return (
                      <div className="bg-slate-900 text-white text-xs p-3 rounded-lg shadow-xl space-y-1">
                        <p className="font-bold text-[#36CFC9]">{data.ghatName} ({data.year})</p>
                        <p className="font-mono font-bold text-sm">pH: {data.ph}</p>
                        <p className="text-[10px] text-emerald-300">Class B Acceptable Interval: 6.5 – 8.5</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <ReferenceArea y1={6.5} y2={8.5} fill="#E8F7F5" fillOpacity={0.6} />
              <ReferenceLine y={6.5} stroke="#059669" strokeDasharray="3 3" />
              <ReferenceLine y={8.5} stroke="#059669" strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="ph"
                name="pH Level"
                stroke="#12243A"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#12243A' }}
                activeDot={{ r: 6, fill: '#36CFC9' }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'comparison' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={GHAT_AVERAGES} margin={{ top: 15, right: 30, left: 10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="ghat" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 20]} stroke="#64748b" tick={{ fontSize: 11 }} unit=" mg/L" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length > 0) {
                    const data = payload[0]?.payload as (typeof GHAT_AVERAGES)[0];
                    return (
                      <div className="bg-slate-900 text-white text-xs p-3 rounded-lg shadow-xl space-y-1">
                        <p className="font-bold text-[#36CFC9]">{data.ghat}</p>
                        <p className="font-mono">Average DO: {data.doAvg} mg/L</p>
                        <p className="font-mono">Average BOD: {data.bodAvg} mg/L</p>
                        <p className="text-slate-400">Deterministic Risk Score: {data.score}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="doAvg" name="Average DO (mg/L)" fill="#0F766E" radius={[4, 4, 0, 0]} />
              <Bar dataKey="bodAvg" name="Average BOD (mg/L)" fill="#D97706" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'completeness' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={COMPLETENESS_DATA} margin={{ top: 15, right: 30, left: 10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length > 0) {
                    const data = payload[0]?.payload as (typeof COMPLETENESS_DATA)[0];
                    return (
                      <div className="bg-slate-900 text-white text-xs p-3 rounded-lg shadow-xl space-y-1">
                        <p className="font-bold text-[#36CFC9]">Year {data.year}</p>
                        <p className="font-mono text-emerald-400">Tested: {data.tested} samples</p>
                        <p className="font-mono text-slate-400">Not Tested: {data.missing} samples</p>
                        <p className="font-bold">Completeness: {data.percentage}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="tested" name="Sampled & Measured" fill="#0F766E" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="missing" name="Not Sampled / Gap" fill="#cbd5e1" stackId="a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Footnote on null handling */}
      <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
        <Info className="w-4 h-4 text-slate-400 shrink-0" />
        <span>{t('analytics.footnote_gaps')}</span>
      </div>
    </div>
  );
}
