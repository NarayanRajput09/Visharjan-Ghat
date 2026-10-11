import { useTranslation } from 'react-i18next';
import { AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';
import type { components } from '../api/schema';

type Confidence = components['schemas']['Confidence'];

type Props = {
  confidence: Confidence;
  className?: string;
};

export function ConfidenceBadge({ confidence, className = '' }: Props) {
  const { t } = useTranslation();

  const config: Record<Confidence, { style: string; icon: typeof CheckCircle }> = {
    good: {
      style: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: CheckCircle,
    },
    limited: {
      style: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: AlertTriangle,
    },
    poor: {
      style: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: HelpCircle,
    },
  };

  const current = config[confidence];
  const Icon = current.icon;

  return (
    <span
      data-testid="confidence-badge"
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border ${current.style} ${className}`}
      title={`${t('ranking.table_confidence')}: ${t(`ranking.confidence.${confidence}`)}`}
    >
      <Icon className="w-3 h-3 shrink-0" aria-hidden="true" />
      <span>{t(`ranking.confidence.${confidence}`)}</span>
    </span>
  );
}
