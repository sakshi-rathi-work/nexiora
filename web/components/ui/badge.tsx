import * as React from 'react';
import { clsx } from 'clsx';

export type BadgeVariant =
  | 'success'
  | 'warning'
  | 'info'
  | 'error'
  | 'neutral'
  | 'gold'
  | 'gold-dark'
  | 'navy';

const variantStyles: Record<BadgeVariant, { bg: string; text: string; border: string }> = {
  success: { bg: 'rgba(46, 125, 91, 0.15)', text: '#1e543d', border: 'rgba(46, 125, 91, 0.35)' },
  warning: { bg: 'rgba(184, 134, 46, 0.15)', text: '#7c591c', border: 'rgba(184, 134, 46, 0.35)' },
  info: { bg: 'rgba(46, 107, 184, 0.15)', text: '#1d487d', border: 'rgba(46, 107, 184, 0.35)' },
  error: { bg: 'rgba(184, 66, 46, 0.15)', text: '#7d2b1d', border: 'rgba(184, 66, 46, 0.35)' },
  neutral: { bg: 'rgba(91, 100, 114, 0.15)', text: '#2d333c', border: 'rgba(91, 100, 114, 0.35)' },
  gold: { bg: 'rgba(207, 168, 76, 0.15)', text: '#8c6512', border: 'rgba(207, 168, 76, 0.45)' },
  'gold-dark': { bg: 'rgba(227, 188, 87, 0.2)', text: '#FCE8A6', border: 'rgba(227, 188, 87, 0.5)' },
  navy: { bg: 'rgba(11, 25, 44, 0.1)', text: '#0B192C', border: 'rgba(11, 25, 44, 0.25)' },
};

// Map application status strings to badge variants
export function getApplicationStatusVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    SUBMITTED: 'neutral',
    UNDER_REVIEW: 'warning',
    SHORTLISTED: 'info',
    INTERVIEW: 'info',
    OFFERED: 'success',
    REJECTED: 'error',
    WITHDRAWN: 'neutral',
  };
  return map[status] ?? 'neutral';
}

export function getJobStatusVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    PUBLISHED: 'success',
    DRAFT: 'neutral',
    CLOSED: 'neutral',
  };
  return map[status] ?? 'neutral';
}

interface BadgeProps {
  variant?: BadgeVariant | string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Badge({ variant = 'neutral', children, className, style }: BadgeProps) {
  const defaultStyle = variantStyles[variant as BadgeVariant] ?? variantStyles['neutral'];

  return (
    <span
      className={clsx(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border shadow-xs',
        className,
      )}
      style={{
        backgroundColor: defaultStyle.bg,
        color: defaultStyle.text,
        borderColor: defaultStyle.border,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
