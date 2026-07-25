import * as React from 'react';
import { clsx } from 'clsx';

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        'card-base p-6 flex flex-col gap-4',
        className,
      )}
      aria-hidden="true"
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-lg skeleton-shimmer shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-4 rounded skeleton-shimmer w-3/4" />
          <div className="h-3 rounded skeleton-shimmer w-1/2" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-3 rounded skeleton-shimmer w-full" />
        <div className="h-3 rounded skeleton-shimmer w-5/6" />
      </div>
      <div className="flex gap-2 mt-auto pt-2">
        <div className="h-6 rounded-full skeleton-shimmer w-20" />
        <div className="h-6 rounded-full skeleton-shimmer w-16" />
      </div>
    </div>
  );
}

export function SkeletonRow({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        'flex items-center gap-4 p-4 border-b border-[var(--nexiora-border)]',
        className,
      )}
      aria-hidden="true"
    >
      <div className="w-10 h-10 rounded-lg skeleton-shimmer shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-3.5 rounded skeleton-shimmer w-2/5" />
        <div className="h-3 rounded skeleton-shimmer w-1/3" />
      </div>
      <div className="h-6 rounded-full skeleton-shimmer w-20 shrink-0" />
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="flex flex-col gap-2" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={clsx('h-3 rounded skeleton-shimmer', i === lines - 1 ? 'w-2/3' : 'w-full')}
        />
      ))}
    </div>
  );
}
