import * as React from 'react';
import { clsx } from 'clsx';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Build page range with ellipsis
  const getPages = () => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('ellipsis');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }
    return pages;
  };

  const pages = getPages();

  return (
    <nav
      aria-label="Pagination"
      className={clsx('flex items-center justify-center gap-1', className)}
    >
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
        className={clsx(
          'h-9 px-3 text-sm rounded-[var(--radius-btn)] transition-colors border',
          'border-[var(--nexiora-border)] text-[var(--nexiora-navy)]',
          'hover:bg-[var(--nexiora-off-white)] disabled:opacity-40 disabled:cursor-not-allowed',
        )}
      >
        ←
      </button>

      {/* Page numbers */}
      {pages.map((page, idx) =>
        page === 'ellipsis' ? (
          <span
            key={`ellipsis-${idx}`}
            className="h-9 w-9 flex items-center justify-center text-sm text-[var(--nexiora-slate-light)]"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-label={`Go to page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
            className={clsx(
              'h-9 w-9 flex items-center justify-center text-sm rounded-[var(--radius-btn)] transition-colors border font-medium',
              page === currentPage
                ? 'bg-[var(--nexiora-navy)] text-white border-[var(--nexiora-navy)]'
                : 'border-[var(--nexiora-border)] text-[var(--nexiora-navy)] hover:bg-[var(--nexiora-off-white)] hover:border-[var(--nexiora-gold-solid)]',
            )}
          >
            {page}
          </button>
        ),
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
        className={clsx(
          'h-9 px-3 text-sm rounded-[var(--radius-btn)] transition-colors border',
          'border-[var(--nexiora-border)] text-[var(--nexiora-navy)]',
          'hover:bg-[var(--nexiora-off-white)] disabled:opacity-40 disabled:cursor-not-allowed',
        )}
      >
        →
      </button>
    </nav>
  );
}
