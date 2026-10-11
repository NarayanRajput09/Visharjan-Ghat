type Props = {
  className?: string;
  count?: number;
};

export function Skeleton({ className = 'h-4 w-full', count = 1 }: Props) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-slate-200 rounded-md ${className}`}
          aria-hidden="true"
        />
      ))}
    </>
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 items-center">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton
              key={c}
              className={`h-6 ${c === 0 ? 'w-10' : c === 1 ? 'w-48' : 'flex-1'}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export const LoadingSkeleton = Skeleton;
