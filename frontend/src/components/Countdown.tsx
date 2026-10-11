import { useTranslation } from 'react-i18next';
import { Calendar } from 'lucide-react';

export function Countdown() {
  const { t } = useTranslation();

  // Target: 20 October 2026
  const targetDate = new Date('2026-10-20T00:00:00Z');
  // Local or mocked current date
  const now = new Date('2026-10-11T12:00:00Z');

  const diffTime = targetDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let message = '';
  if (diffDays > 0) {
    message = t('countdown.durga_visarjan_in', { days: diffDays });
  } else if (diffDays === 0) {
    message = t('countdown.today');
  } else {
    message = t('countdown.passed');
  }

  return (
    <div
      data-testid="countdown-banner"
      className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-full text-xs font-semibold shadow-xs"
    >
      <Calendar className="w-3.5 h-3.5 text-amber-700 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
