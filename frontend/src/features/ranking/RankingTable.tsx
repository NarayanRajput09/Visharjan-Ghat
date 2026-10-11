import { useTranslation } from 'react-i18next';
import { GhatRow } from './GhatRow';
import type { components } from '../../api/schema';

type RankedGhat = components['schemas']['RankedGhat'];

type Props = {
  ghats: RankedGhat[];
  cpcbClass: string;
};

export function RankingTable({ ghats, cpcbClass }: Props) {
  const { t } = useTranslation();

  return (
    <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-xs" data-testid="ranking-table">
      <table className="w-full text-left text-xs divide-y divide-slate-200">
        <thead className="bg-slate-100/80 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
          <tr>
            <th className="py-3.5 px-4 text-center w-12">{t('ranking.table_rank')}</th>
            <th className="py-3.5 px-4">{t('ranking.table_ghat')}</th>
            <th className="py-3.5 px-4">{t('ranking.table_tier')}</th>
            <th className="py-3.5 px-4">{t('ranking.table_confidence')}</th>
            <th className="py-3.5 px-4">{t('ranking.table_reason')}</th>
            <th className="py-3.5 px-4 text-right">{t('ranking.table_actions')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {ghats.map((ghat) => (
            <GhatRow key={ghat.slug} ghat={ghat} cpcbClass={cpcbClass} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const GhatTable = RankingTable;
