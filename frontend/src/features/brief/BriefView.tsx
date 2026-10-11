import { useTranslation } from 'react-i18next';
import { AlertTriangle, CheckSquare, HelpCircle, FileText } from 'lucide-react';
import type { components } from '../../api/schema';

type BriefResponse = components['schemas']['BriefResponse'];

type Props = {
  brief: BriefResponse;
};

export function BriefView({ brief }: Props) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 print-page" data-testid="brief-view">
      {/* Print only header */}
      <div className="hidden print-only pb-4 border-b border-slate-300">
        <h1 className="text-xl font-bold">{t('brief.print_header_title')}</h1>
        <p className="text-xs text-slate-600 mt-0.5">
          {t('brief.print_date', { date: '11 Oct 2026' })} · Durga Visarjan: 20 Oct 2026
        </p>
      </div>

      {/* Side-by-side Columns: Hindi and English */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
        {/* Hindi Section (Administrative first) */}
        <div
          data-glow-card
          data-glow="cyan"
          className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:shadow-xl hover:border-slate-300 transition-all space-y-5 print:shadow-none print:border-slate-300 cursor-pointer select-none"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              {t('brief.hindi_version')}
            </span>
            <span className="text-[11px] text-slate-400">हिंदी</span>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-snug">
              {brief.hi.headline}
            </h2>
          </div>

          {/* Top Risks */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              <span>{t('brief.section_risks')}</span>
            </h3>
            <ul className="space-y-2">
              {brief.hi.top_risks.map((risk, i) => (
                <li key={i} className="text-xs text-slate-800 flex items-start gap-2">
                  <span className="font-bold text-slate-400 mt-0.5">{i + 1}.</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
              <span>{t('brief.section_actions')}</span>
            </h3>
            <ul className="space-y-2">
              {brief.hi.actions.map((act, i) => (
                <li key={i} className="text-xs text-slate-800 flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Data Gaps */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>{t('brief.section_gaps')}</span>
            </h3>
            <ul className="space-y-1.5">
              {brief.hi.data_gaps.map((gap, i) => (
                <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                  <span className="text-amber-500">-</span>
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Source */}
          <div className="pt-3 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500 italic">
            <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span>{brief.hi.source_line}</span>
          </div>
        </div>

        {/* English Section */}
        <div
          data-glow-card
          data-glow="cyan"
          className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:shadow-xl hover:border-slate-300 transition-all space-y-5 print:shadow-none print:border-slate-300 cursor-pointer select-none"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              {t('brief.english_version')}
            </span>
            <span className="text-[11px] text-slate-400">English</span>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-snug">
              {brief.en.headline}
            </h2>
          </div>

          {/* Top Risks */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              <span>{t('brief.section_risks')}</span>
            </h3>
            <ul className="space-y-2">
              {brief.en.top_risks.map((risk, i) => (
                <li key={i} className="text-xs text-slate-800 flex items-start gap-2">
                  <span className="font-bold text-slate-400 mt-0.5">{i + 1}.</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
              <span>{t('brief.section_actions')}</span>
            </h3>
            <ul className="space-y-2">
              {brief.en.actions.map((act, i) => (
                <li key={i} className="text-xs text-slate-800 flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Data Gaps */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>{t('brief.section_gaps')}</span>
            </h3>
            <ul className="space-y-1.5">
              {brief.en.data_gaps.map((gap, i) => (
                <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                  <span className="text-amber-500">-</span>
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Source */}
          <div className="pt-3 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500 italic">
            <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span>{brief.en.source_line}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
