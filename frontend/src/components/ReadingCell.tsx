import { useTranslation } from 'react-i18next';
import type { components } from '../api/schema';

type Reading = components['schemas']['Reading'];

type Props = {
  reading: Reading;
  className?: string;
};

export function formatReadingValue(value: number | null, unit: string | null, lang: string): string {
  if (value === null) return '-';
  const formatter = new Intl.NumberFormat(lang === 'hi' ? 'hi-IN' : 'en-IN', {
    maximumFractionDigits: 2,
  });
  const formattedNumber = formatter.format(value);
  return unit ? `${formattedNumber} ${unit}` : formattedNumber;
}

export function ReadingCell({ reading, className = '' }: Props) {
  const { t, i18n } = useTranslation();

  switch (reading.status) {
    case 'measured': {
      return (
        <span
          data-testid="reading-cell-measured"
          className={`font-mono text-sm font-semibold text-slate-800 ${className}`}
        >
          {formatReadingValue(reading.value, reading.unit_assumed, i18n.language)}
        </span>
      );
    }
    case 'bdl': {
      return (
        <span
          data-testid="reading-cell-bdl"
          className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 ${className}`}
          title={t('reading.status.bdl')}
        >
          {t('reading.status.bdl')}
        </span>
      );
    }
    case 'nd': {
      return (
        <span
          data-testid="reading-cell-nd"
          className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 ${className}`}
          title={t('reading.status.nd')}
        >
          {t('reading.status.nd')}
        </span>
      );
    }
    case 'not_sampled':
    default: {
      return (
        <span
          data-testid="reading-cell-not-sampled"
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-status-missing text-slate-600 border border-slate-300 italic ${className}`}
          title={t('reading.status.not_sampled')}
        >
          {t('reading.status.not_sampled')}
        </span>
      );
    }
  }
}
