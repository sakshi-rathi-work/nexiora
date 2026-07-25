import * as React from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { Button } from './button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  heading: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  className?: string;
}

/**
 * EmptyState — rendered for any list view with zero items.
 * Per spec: Lucide icon (48px, slate-light), heading, supporting copy, optional CTA.
 * Copy must be honest — never fake urgency or invented stats.
 */
export function EmptyState({
  icon,
  heading,
  description,
  ctaLabel,
  ctaHref,
  onCtaClick,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center text-center py-16 px-6 gap-4',
        className,
      )}
    >
      {icon && (
        <div
          className="text-[var(--nexiora-slate-light)] mb-2"
          style={{ width: 48, height: 48 }}
          aria-hidden="true"
        >
          {icon}
        </div>
      )}
      <h3
        className="text-xl font-semibold text-[var(--nexiora-navy)]"
        style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}
      >
        {heading}
      </h3>
      {description && (
        <p className="text-sm text-[var(--nexiora-slate)] max-w-md">{description}</p>
      )}
      {ctaLabel && (ctaHref || onCtaClick) && (
        <div className="mt-2">
          {ctaHref ? (
            <Link href={ctaHref}>
              <Button variant="secondary" size="md">
                {ctaLabel}
              </Button>
            </Link>
          ) : (
            <Button variant="secondary" size="md" onClick={onCtaClick}>
              {ctaLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
