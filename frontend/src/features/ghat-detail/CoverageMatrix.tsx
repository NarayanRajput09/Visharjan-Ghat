import { useTranslation } from 'react-i18next';
import type { components } from '../../api/schema';

type CoverageCell = components['schemas']['CoverageCell'];

type Props = {
  coverage: CoverageCell[];
  className?: string;
};

export function CoverageMatrix({ coverage, className = '' }: Props) {
  const { t } = useTranslation();

  const years = [2023, 2024, 2025];
  const festivals: ('Ganesh' | 'Durga')[] = ['Ganesh', 'Durga'];
  const phases: ('pre' | 'during' | 'after')[] = ['pre', 'during', 'after'];

  // Helper to find cell
  const getCell = (year: number, festival: 'Ganesh' | 'Durga', phase: 'pre' | 'during' | 'after') => {
    return coverage.find((c) => c.year === year && c.festival === festival && c.phase === phase);
  };

  return (
    <div className={`overflow-x-auto ${className}`} data-testid="coverage-matrix">
      <table className="w-full text-xs text-left border-collapse">
        <thead>
          <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
            <th className="py-2.5 px-3 font-semibold">{t('reading.table_year')}</th>
            <th className="py-2.5 px-3 font-semibold">{t('reading.table_festival')}</th>
            {phases.map((ph) => (
              <th key={ph} className="py-2.5 px-3 font-semibold text-center">
                {t(`reading.phase.${ph}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {years.flatMap((year) =>
            festivals.map((fest) => {
              return (
                <tr key={`${year}-${fest}`} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-medium text-slate-800">{year}</td>
                  <td className="py-2.5 px-3 text-slate-700">
                    {t(`reading.festival.${fest}`)}
                  </td>
                  {phases.map((ph) => {
                    const cell = getCell(year, fest, ph);
                    const isMissing = !cell || cell.sampled === 0 || cell.status === 'not_sampled';

                    return (
                      <td
                        key={ph}
                        className={`py-2 px-3 text-center border-l border-slate-200 ${
                          isMissing
                            ? 'bg-status-missing text-slate-600 font-medium italic'
                            : 'bg-emerald-50 text-emerald-800 font-semibold'
                        }`}
                      >
                        {isMissing ? (
                          <span className="inline-block px-1.5 py-0.5 rounded text-[11px] bg-white/70 border border-slate-300">
                            {t('reading.status.not_sampled')}
                          </span>
                        ) : (
                          <span className="inline-block px-1.5 py-0.5 rounded text-[11px]">
                            {cell.sampled} {t('ghat_detail.coverage_legend_sampled')}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Legend */}
      <div className="mt-3 flex items-center gap-4 text-xs text-slate-600 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-emerald-50 border border-emerald-300" />
          <span>{t('ghat_detail.coverage_legend_sampled')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-status-missing border border-slate-300" />
          <span>{t('ghat_detail.coverage_legend_missing')}</span>
        </div>
      </div>
    </div>
  );
}

export const SamplingCoverageMatrix = CoverageMatrix;
