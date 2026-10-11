import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ChevronRight, MapPin } from 'lucide-react';
import { TierBadge } from '../../components/TierBadge';
import { ConfidenceBadge } from '../../components/ConfidenceBadge';
import { SourceChip } from '../ghat-detail/SourceChip';
import { ImageWithFallback } from '../../components/ImageWithFallback';
import { GHAT_IMAGES } from '../../components/ghats/GhatCardsGrid';
import type { components } from '../../api/schema';

type RankedGhat = components['schemas']['RankedGhat'];

type Props = {
  ghat: RankedGhat;
  cpcbClass: string;
};

export function GhatRow({ ghat, cpcbClass }: Props) {
  const { t, i18n } = useTranslation();

  const primaryName = i18n.language === 'hi' ? ghat.name_hi : ghat.name_en;
  const secondaryName = i18n.language === 'hi' ? ghat.name_en : ghat.name_hi;

  const firstReason = ghat.reasons[0];
  const reasonText = firstReason
    ? t(`reasons.${firstReason.kind}`, firstReason.params)
    : t('common.no_data');

  const imageSrc = GHAT_IMAGES[ghat.slug] ?? '/images/ghats/ghat-steps-immersion.webp';

  return (
    <tr
      data-testid={`ghat-row-${ghat.rank}`}
      className="hover:bg-slate-50/80 transition-colors group cursor-pointer border-b border-slate-100"
    >
      {/* Rank # */}
      <td className="py-3.5 px-4 text-center">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-800 font-bold font-mono text-xs border border-slate-200">
          {ghat.rank}
        </span>
      </td>

      {/* Ghat Name with 64–88px Photographic Thumbnail */}
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3.5">
          {/* Photographic Thumbnail */}
          <Link
            to={`/ghat/${ghat.slug}?class=${cpcbClass}`}
            className="relative w-16 sm:w-20 aspect-4/3 rounded-lg overflow-hidden border border-slate-200 bg-slate-900 shrink-0 group-hover:border-[#0F766E] transition-all shadow-2xs"
          >
            <ImageWithFallback
              src={imageSrc}
              alt={`${primaryName} preview thumbnail`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          <div>
            <Link
              to={`/ghat/${ghat.slug}?class=${cpcbClass}`}
              className="font-bold text-slate-900 group-hover:text-[#0F766E] transition-colors text-sm block leading-snug"
            >
              {primaryName}
            </Link>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
              <span className="text-[11px] text-slate-400">{secondaryName}</span>
              <span>·</span>
              <span className="text-slate-600 flex items-center gap-1 font-medium">
                <MapPin className="w-3 h-3 text-[#0F766E]" />
                {ghat.water_body}
              </span>
            </div>
          </div>
        </div>
      </td>

      {/* Tier & Score */}
      <td className="py-3.5 px-4 whitespace-nowrap">
        <div className="space-y-1">
          <TierBadge tier={ghat.tier} />
          <div className="text-[10px] text-slate-400 font-mono">
            Score: <span className="font-bold text-slate-700">{ghat.score.toFixed(1)}</span>
          </div>
        </div>
      </td>

      {/* Confidence */}
      <td className="py-3.5 px-4 whitespace-nowrap">
        <ConfidenceBadge confidence={ghat.confidence} />
      </td>

      {/* Main Reason with Source Chip */}
      <td className="py-3.5 px-4 text-xs text-slate-700 max-w-md">
        <div className="leading-relaxed">
          <span>{reasonText}</span>
          {firstReason && firstReason.reading_ids && firstReason.reading_ids.length > 0 && (
            <span className="inline-block ml-2 align-middle">
              <SourceChip readingId={firstReason.reading_ids[0]} />
            </span>
          )}
        </div>
      </td>

      {/* Action / Detail Link */}
      <td className="py-3.5 px-4 text-right whitespace-nowrap">
        <Link
          to={`/ghat/${ghat.slug}?class=${cpcbClass}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F766E] hover:text-[#0B1220] transition-colors group-hover:translate-x-0.5"
          aria-label={`${t('ranking.view_detail')} for ${primaryName}`}
        >
          <span>{t('ranking.view_detail')}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </td>
    </tr>
  );
}
