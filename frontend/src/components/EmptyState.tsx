import { Inbox, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title = 'No records found',
  description = 'No water quality measurements or ghat records match the selected filters.',
  actionText,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`p-8 text-center bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3 ${className}`}>
      <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
        <Inbox className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
          {description}
        </p>
      </div>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3 h-3 text-slate-500" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
}
