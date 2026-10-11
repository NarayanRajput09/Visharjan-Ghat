import { X, ExternalLink, ShieldCheck, FileCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSourcePanel } from './SourceContext';
import { ImageWithFallback } from '../../components/ImageWithFallback';
import { api } from '../../api/client';

export function SourcePanel() {
  const { selectedReading, isOpen, closeSource } = useSourcePanel();
  const { t } = useTranslation();

  if (!isOpen || !selectedReading) return null;

  const pdfUrl = api.getReportPdfUrl(selectedReading.year, selectedReading.source_page);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="source-panel-title"
      data-testid="source-panel"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={closeSource}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 bg-[#0B1220] text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#36CFC9]" aria-hidden="true" />
              <div>
                <h2 id="source-panel-title" className="text-base font-bold text-white leading-tight">
                  {t('source_panel.title', 'Official Report Traceability')}
                </h2>
                <span className="text-[11px] text-slate-400 block">
                  Madhya Pradesh Pollution Control Board
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={closeSource}
              className="text-slate-400 hover:text-white rounded-lg p-1 transition-colors cursor-pointer"
              aria-label={t('source_panel.close', 'Close drawer')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Context Visual Box with Water Sampling Image & Verified Notice */}
            <div className="bg-[#E8F7F5] border border-[#36CFC9]/40 rounded-xl p-4 flex items-start gap-3.5">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-teal-200">
                <ImageWithFallback
                  src="/images/water-quality/water-sample-bottles.webp"
                  alt="Chain of custody bottles"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F766E]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Direct Government Evidence</span>
                </div>
                <p className="text-[11px] text-slate-700 leading-relaxed">
                  {t('source_panel.source_note', 'This reading is cited verbatim from the MPPCB annual water quality monitoring publication.')}
                </p>
              </div>
            </div>

            {/* Official Report Document Preview Banner */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
              <div className="relative h-24 bg-[#0B1220] overflow-hidden">
                <ImageWithFallback
                  src="/images/methodology/mppcb-official-report-cover.webp"
                  alt="Official MPPCB report cover preview"
                  className="w-full h-full object-cover opacity-40 filter brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220] via-[#0B1220]/80 to-transparent" />
                <div className="absolute bottom-2.5 left-3 text-white">
                  <span className="text-[10px] font-mono text-[#36CFC9] uppercase font-bold block">
                    Annual Immersion Report
                  </span>
                  <span className="text-xs font-bold block">
                    MPPCB {selectedReading.year} Ganesh & Durga Publication
                  </span>
                </div>
              </div>
              <div className="p-3 flex items-center justify-between text-xs border-t border-slate-200">
                <span className="text-slate-500 font-medium">Verified Page Reference:</span>
                <span className="font-mono font-bold text-[#0F766E] bg-white px-2 py-0.5 rounded border border-slate-200">
                  Page {selectedReading.source_page}
                </span>
              </div>
            </div>

            <div className="space-y-3.5">
              {/* Value as printed */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  {t('source_panel.value_as_printed', 'Value as Printed in Report')}
                </span>
                <span className="text-2xl font-mono font-extrabold text-[#0B1220] mt-1 block">
                  {(selectedReading.value_as_printed || selectedReading.value) ?? '-'}
                </span>
                {selectedReading.unit_assumed && (
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Reported unit: {selectedReading.unit_assumed}
                  </span>
                )}
              </div>

              {/* Parameter as printed */}
              <div className="border border-slate-200 rounded-xl p-3.5">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  {t('source_panel.parameter_as_printed', 'Parameter as Printed')}
                </span>
                <span className="text-sm font-bold text-slate-800 mt-0.5 block">
                  {selectedReading.parameter_as_printed || selectedReading.parameter}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  Standardized metric: {selectedReading.parameter}
                </span>
              </div>

              {/* Site as printed */}
              <div className="border border-slate-200 rounded-xl p-3.5">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  {t('source_panel.site_as_printed', 'Sampling Site as Printed')}
                </span>
                <span className="text-sm font-bold text-slate-800 mt-0.5 block">
                  {selectedReading.site_as_printed || selectedReading.site_slug}
                </span>
              </div>

              {/* Festival, Phase, Year */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="border border-slate-200 rounded-xl p-2.5 bg-slate-50 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">{t('reading.table_year', 'Year')}</span>
                  <span className="text-sm font-black font-mono text-slate-800 mt-0.5 block">
                    {selectedReading.year}
                  </span>
                </div>
                <div className="border border-slate-200 rounded-xl p-2.5 bg-slate-50 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">{t('reading.table_festival', 'Festival')}</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block line-clamp-1">
                    {t(`reading.festival.${selectedReading.festival}`, selectedReading.festival)}
                  </span>
                </div>
                <div className="border border-slate-200 rounded-xl p-2.5 bg-slate-50 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">{t('reading.table_phase', 'Phase')}</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block line-clamp-1 capitalize">
                    {t(`reading.phase.${selectedReading.phase}`, selectedReading.phase)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer action */}
          <div className="p-5 bg-slate-50 border-t border-slate-200">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              data-testid="view-in-report-btn"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#0F766E] hover:bg-[#0F766E]/90 text-white rounded-xl font-semibold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{t('source_panel.view_in_report', { page: selectedReading.source_page })} (Official PDF)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export const EvidenceDrawer = SourcePanel;
