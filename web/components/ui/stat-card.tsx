import * as React from 'react';
import { clsx } from 'clsx';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  className?: string;
}

export function StatCard({ label, value, icon, description, className }: StatCardProps) {
  return (
    <div className={clsx('card-base p-5 flex flex-col gap-3', className)}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium text-[var(--nexiora-slate-light)] uppercase tracking-wide">
            {label}
          </p>
          <p
            className="text-2xl font-bold text-[var(--nexiora-navy)] mt-1"
            style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}
          >
            {value}
          </p>
        </div>
        {icon && (
          <div className="text-[var(--nexiora-gold-solid)] shrink-0">{icon}</div>
        )}
      </div>
      {description && (
        <p className="text-xs text-[var(--nexiora-slate)]">{description}</p>
      )}
    </div>
  );
}
