'use client';

export function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="w-full">
      <div className="flex gap-4 px-6 py-3 border-b border-gray-100">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex gap-4 px-6 py-4 border-b border-gray-50">
          {Array.from({ length: cols }).map((_, colIdx) => (
            <Skeleton
              key={colIdx}
              className={`h-4 flex-1 ${colIdx === 0 ? 'max-w-[2rem]' : ''}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-3">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-3 w-1/4" />
    </div>
  );
}
