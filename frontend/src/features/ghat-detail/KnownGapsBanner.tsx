import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, ChevronDown, ChevronUp, Info, HelpCircle } from 'lucide-react';

type Props = {
  gaps: string[];
  className?: string;
};

export function KnownGapsBanner({ gaps, className = '' }: Props) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const hasSpecificGaps = gaps && gaps.length > 0;

  return (
    <div className={`border border-amber-200 bg-amber-50/70 rounded-xl overflow-hidden shadow-2xs ${className}`} data-testid="data-limitations-accordion">
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full px-4 py-3 flex items-center justify-between text-left cursor-pointer hover:bg-amber-100/50 transition-colors"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
          <div>
            <span className="text-xs font-bold text-amber-900 block leading-tight">
              {t('about.gaps_heading')}
            </span>
            <span className="text-[11px] text-amber-700">
              {hasSpecificGaps
                ? `${gaps.length} site-specific monitoring notice(s). Click to inspect scientific limitations.`
                : 'General MPPCB report sampling intervals and historical dataset limitations.'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800">
          <span className="hidden sm:inline">{isExpanded ? 'Collapse' : 'Expand'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 pt-1 border-t border-amber-200/60 space-y-2.5 text-xs text-amber-900 leading-relaxed bg-white/60">
          {hasSpecificGaps && (
            <div className="space-y-1.5">
              <span className="font-bold text-amber-950 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-amber-600" />
                Location-Specific Observations:
              </span>
              <ul className="list-disc pl-5 space-y-1">
                {gaps.map((gapKey, idx) => (
                  <li key={idx} className="text-amber-800 font-medium">
                    {t(`gaps.${gapKey}`, gapKey)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-2 border-t border-amber-200/40 text-[11px] text-slate-600 space-y-1">
            <span className="font-semibold text-slate-700 flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-slate-400" />
              General Dataset Provenance Limitations:
            </span>
            <p>
              • Historical MPPCB tests reflect snapshot measurements during pre, during, and post-visarjan dates (2023–2025) and do not represent continuous live telemetry.
            </p>
            <p>
              • Unmeasured parameters marked as &quot;not tested&quot; are completely excluded from scoring to avoid penalizing or artificially rewarding ghats.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export const DataLimitationsAccordion = KnownGapsBanner;
