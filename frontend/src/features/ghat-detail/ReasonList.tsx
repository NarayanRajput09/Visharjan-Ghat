import { useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';
import { SourceChip } from './SourceChip';
import type { components } from '../../api/schema';

type Reason = components['schemas']['Reason'];

type Props = {
  reasons: Reason[];
  limit?: number;
  className?: string;
};

export function ReasonList({ reasons, limit, className = '' }: Props) {
  const { t } = useTranslation();

  const displayedReasons = limit ? reasons.slice(0, limit) : reasons;

  if (!displayedReasons.length) {
    return <span className="text-slate-400 text-xs italic">{t('common.no_data')}</span>;
  }

  return (
    <ul className={`space-y-2.5 ${className}`}>
      {displayedReasons.map((reason, idx) => {
        const text = t(`reasons.${reason.kind}`, reason.params);

        return (
          <li
            key={idx}
            data-testid={`reason-item-${idx}`}
            className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed"
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex-1">
              <span className="font-medium text-slate-800">{text}</span>
              {reason.reading_ids && reason.reading_ids.length > 0 && (
                <div className="inline-flex flex-wrap gap-1.5 ml-2 mt-1">
                  {reason.reading_ids.map((id) => (
                    <SourceChip key={id} readingId={id} />
                  ))}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
