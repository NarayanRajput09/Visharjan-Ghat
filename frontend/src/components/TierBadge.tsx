import { useTranslation } from 'react-i18next';
import type { components } from '../api/schema';

type Tier = components['schemas']['Tier'];

type Props = {
  tier: Tier;
  className?: string;
};

export function TierBadge({ tier, className = '' }: Props) {
  const { t } = useTranslation();

  const tierStyles: Record<Tier, string> = {
    high: 'bg-red-100 text-red-800 border-red-300 font-bold',
    medium: 'bg-amber-100 text-amber-800 border-amber-300 font-semibold',
    low: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-medium',
  };

  return (
    <span
      data-testid="tier-badge"
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border uppercase tracking-wider ${tierStyles[tier]} ${className}`}
      aria-label={`Tier: ${t(`ranking.tier.${tier}`)}`}
    >
      {t(`ranking.tier.${tier}`)}
    </span>
  );
}

export const RiskBadge = TierBadge;
