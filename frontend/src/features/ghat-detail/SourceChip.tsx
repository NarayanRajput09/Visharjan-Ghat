import React from 'react';
import { FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSourcePanel } from './SourceContext';
import type { components } from '../../api/schema';
import { MOCK_READINGS_BY_ID } from '../../api/mockData';

type Reading = components['schemas']['Reading'];

type Props = {
  readingId?: number;
  reading?: Reading;
  year?: number;
  festival?: string;
  phase?: string;
  page?: number;
  className?: string;
};

export function SourceChip({
  readingId,
  reading,
  year,
  festival,
  phase,
  page,
  className = '',
}: Props) {
  const { t } = useTranslation();
  const { openSource } = useSourcePanel();

  // Resolve reading if readingId is supplied
  const effectiveReading = reading ?? (readingId ? MOCK_READINGS_BY_ID[readingId] : undefined);

  const displayYear = year ?? effectiveReading?.year ?? 2023;
  const displayFestival = festival ?? effectiveReading?.festival ?? 'Durga';
  const displayPhase = phase ?? effectiveReading?.phase ?? 'during';
  const displayPage = page ?? effectiveReading?.source_page ?? 60;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (effectiveReading) {
      void openSource(effectiveReading);
    } else if (readingId) {
      void openSource(readingId);
    } else {
      // Create synthetic reading for source view
      void openSource({
        id: 0,
        reading_id: 0,
        site_slug: '',
        parameter: 'Water Quality Parameter',
        year: displayYear,
        festival: displayFestival as 'Durga' | 'Ganesh',
        phase: displayPhase as 'during' | 'pre' | 'after',
        status: 'measured',
        value: null,
        unit_assumed: 'mg/l',
        value_as_printed: 'Report figure',
        parameter_as_printed: 'Parameter as recorded',
        site_as_printed: 'Immersion site in report',
        source_page: displayPage,
      });
    }
  };

  return (
    <button
      type="button"
      data-testid="source-chip"
      onClick={handleClick}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-900 border border-blue-200 transition-colors cursor-pointer shadow-2xs ${className}`}
      aria-label={`View evidence in MPPCB report page ${displayPage}`}
      title={`MPPCB report ${displayYear} page ${displayPage}`}
    >
      <FileText className="w-3 h-3 text-blue-600 shrink-0" aria-hidden="true" />
      <span>
        {displayYear} · {t(`reading.festival.${displayFestival}`, displayFestival)} · {t(`reading.phase.${displayPhase}`, displayPhase)} · {t('common.page')} {displayPage}
      </span>
    </button>
  );
}
