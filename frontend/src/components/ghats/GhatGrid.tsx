import { GhatCard } from './GhatCard';
import type { GhatRecord } from '../../types';

interface GhatGridProps {
  ghats: GhatRecord[];
  onSelectGhat: (ghat: GhatRecord) => void;
  isLoading?: boolean;
  language?: 'en' | 'hi';
}

export function GhatGrid({ ghats, onSelectGhat, isLoading = false, language = 'en' }: GhatGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 animate-pulse">
            <div className="h-44 bg-slate-200 rounded-lg" />
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-3 bg-slate-200 rounded w-1/2" />
            <div className="grid grid-cols-2 gap-2">
              <div className="h-10 bg-slate-100 rounded" />
              <div className="h-10 bg-slate-100 rounded" />
            </div>
            <div className="h-8 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (ghats.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
        <span className="text-3xl">🌊</span>
        <h3 className="text-sm font-bold text-slate-800">No immersion ghats match the selected criteria</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Try clearing your search query or selecting a different risk tier filter to inspect more locations.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" data-testid="ghat-grid">
      {ghats.map((ghat) => (
        <GhatCard
          key={ghat.id}
          ghat={ghat}
          onSelect={onSelectGhat}
          language={language}
        />
      ))}
    </div>
  );
}
