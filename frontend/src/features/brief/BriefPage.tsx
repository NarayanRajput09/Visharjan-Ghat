import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { useBrief } from '../../api/hooks';
import { BriefView } from './BriefView';
import { ExportButtons } from './ExportButtons';
import { Skeleton } from '../../components/Skeleton';
import { Banner } from '../../components/Banner';

export function BriefPage() {
  const { id } = useParams<{ id: string }>();
  const briefId = id ? Number(id) : 1;
  const { t } = useTranslation();

  const { data: brief, isLoading, isError, refetch } = useBrief(briefId);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-16 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !brief) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Banner
          variant="error"
          title={t('common.error_title')}
          action={
            <button
              onClick={() => void refetch()}
              className="px-3 py-1 bg-red-700 text-white rounded text-xs"
            >
              {t('common.retry')}
            </button>
          }
        >
          {t('common.error_title')}
        </Banner>
      </div>
    );
  }

  const isAiGenerated = brief.source === 'claude';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6" data-testid="brief-page">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('brief.back_to_ranking')}</span>
        </Link>

        {/* Source indicator badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-white border-slate-200 shadow-2xs">
          {isAiGenerated ? (
            <>
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-indigo-900 font-semibold">{t('brief.source_ai')}</span>
            </>
          ) : (
            <>
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-700 font-semibold">{t('brief.source_template')}</span>
            </>
          )}
          {brief.validation.ok && (
            <span title="Validator checked">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </span>
          )}
        </div>
      </div>

      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('brief.title')}</h1>
          <p className="text-xs text-slate-500 mt-0.5">{t('brief.subtitle')}</p>
        </div>

        <ExportButtons brief={brief} />
      </div>

      {/* Main Content */}
      <BriefView brief={brief} />
    </div>
  );
}
