import { useTranslation } from 'react-i18next';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { components } from '../../api/schema';

type Reading = components['schemas']['Reading'];

type Props = {
  readings: Reading[];
  className?: string;
};

interface ChartPoint {
  stage: string;
  year: number;
  festival: string;
  phase: string;
  do_value: number | null;
  bod_value: number | null;
}

export function TrendChart({ readings, className = '' }: Props) {
  const { t } = useTranslation();

  // Extract distinct stages chronologically: 2023, 2024, 2025
  const years = [2023, 2024, 2025];
  const festivals = ['Ganesh', 'Durga'];
  const phases = ['pre', 'during', 'after'];

  const chartData: ChartPoint[] = [];

  for (const y of years) {
    for (const fest of festivals) {
      for (const ph of phases) {
        const stageLabel = `${y} ${fest.slice(0, 3)} ${ph}`;

        const doReading = readings.find(
          (r) =>
            r.year === y &&
            r.festival === fest &&
            r.phase === ph &&
            r.parameter === 'Dissolved oxygen' &&
            r.status === 'measured'
        );

        const bodReading = readings.find(
          (r) =>
            r.year === y &&
            r.festival === fest &&
            r.phase === ph &&
            r.parameter === 'BOD' &&
            r.status === 'measured'
        );

        // Missing points are passed as null, NEVER 0!
        chartData.push({
          stage: stageLabel,
          year: y,
          festival: fest,
          phase: ph,
          do_value: doReading?.value ?? null,
          bod_value: bodReading?.value ?? null,
        });
      }
    }
  }

  // Filter out stages with no readings at all to keep chart readable if empty
  const hasAnyData = chartData.some((p) => p.do_value !== null || p.bod_value !== null);

  if (!hasAnyData) {
    return (
      <div className="py-12 text-center text-slate-400 text-sm">
        {t('common.no_data')}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`} data-testid="trend-chart">
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="stage"
              angle={-35}
              textAnchor="end"
              interval={0}
              height={50}
              tick={{ fontSize: 10, fill: '#64748b' }}
            />
            <YAxis
              unit=" mg/l"
              tick={{ fontSize: 11, fill: '#64748b' }}
              domain={[0, 'auto']}
            />
            <Tooltip
              formatter={(value: unknown, name: string) => {
                if (value === null || value === undefined) return ['Not tested', name];
                return [`${value} mg/l`, name];
              }}
              labelFormatter={(label) => `Stage: ${label}`}
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#cbd5e1',
                borderRadius: '0.5rem',
                fontSize: '12px',
              }}
            />
            <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />

            {/* CPCB Class B reference limit lines */}
            <ReferenceLine
              y={5}
              stroke="#059669"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: t('ghat_detail.trend_limit_do'),
                position: 'insideTopRight',
                fill: '#059669',
                fontSize: 10,
              }}
            />
            <ReferenceLine
              y={3}
              stroke="#dc2626"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: t('ghat_detail.trend_limit_bod'),
                position: 'insideBottomRight',
                fill: '#dc2626',
                fontSize: 10,
              }}
            />

            {/* DO Line: connectNulls={false} to ensure gaps for missing values */}
            <Line
              type="monotone"
              dataKey="do_value"
              name="Dissolved Oxygen (DO)"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 3, fill: '#2563eb' }}
              activeDot={{ r: 5 }}
              connectNulls={false}
            />

            {/* BOD Line: connectNulls={false} */}
            <Line
              type="monotone"
              dataKey="bod_value"
              name="BOD"
              stroke="#d97706"
              strokeWidth={2}
              dot={{ r: 3, fill: '#d97706' }}
              activeDot={{ r: 5 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
        <span>{t('ghat_detail.trend_gap_note')}</span>
        <span>{t('ghat_detail.unit_assumed_note')}</span>
      </div>
    </div>
  );
}

export const WaterQualityChart = TrendChart;
