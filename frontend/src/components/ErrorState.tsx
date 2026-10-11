import { AlertOctagon, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  description?: string;
  retryText?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Unable to load water quality records',
  description = 'A network error occurred while communicating with the MPPCB monitoring service. Local fallback records may be used.',
  retryText = 'Retry request',
  onRetry,
  className = '',
}: ErrorStateProps) {
  return (
    <div className={`p-8 text-center bg-red-50/50 rounded-xl border border-red-200 shadow-2xs space-y-3 ${className}`}>
      <div className="w-12 h-12 mx-auto rounded-full bg-red-100 flex items-center justify-center text-red-600">
        <AlertOctagon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-red-900">{title}</h3>
        <p className="text-xs text-red-700 max-w-sm mx-auto mt-1 leading-relaxed">
          {description}
        </p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          <span>{retryText}</span>
        </button>
      )}
    </div>
  );
}
