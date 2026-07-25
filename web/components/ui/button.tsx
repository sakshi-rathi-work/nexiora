import * as React from 'react';
import { clsx } from 'clsx';

// Button variants: primary (gold gradient + navy text), secondary (navy bg + white text), ghost (transparent)
// Sizes: sm, md, lg

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const base =
      'inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nexiora-navy)] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap select-none';

    const variants = {
      primary:
        'bg-gold-gradient text-[var(--nexiora-navy)] hover:brightness-95 active:brightness-90 shadow-sm',
      secondary:
        'bg-[var(--nexiora-navy)] text-white hover:bg-[var(--nexiora-navy-dark)] active:bg-[var(--nexiora-navy-dark)]',
      ghost:
        'bg-transparent text-[var(--nexiora-navy)] border border-[var(--nexiora-border)] hover:bg-[var(--nexiora-off-white)] active:bg-[var(--nexiora-border)]',
      danger:
        'bg-[var(--status-error)] text-white hover:brightness-90 active:brightness-80',
    };

    const sizes = {
      sm: 'h-8 px-3 text-sm rounded-[var(--radius-btn)]',
      md: 'h-10 px-5 text-sm rounded-[var(--radius-btn)]',
      lg: 'h-12 px-7 text-base rounded-[var(--radius-btn)]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span>Loading…</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';

// Link-styled button (renders as <a>) with same variants
interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nexiora-navy)] whitespace-nowrap select-none cursor-pointer';

    const variants = {
      primary:
        'bg-gold-gradient text-[var(--nexiora-navy)] hover:brightness-95 shadow-sm',
      secondary:
        'bg-[var(--nexiora-navy)] text-white hover:bg-[var(--nexiora-navy-dark)]',
      ghost:
        'bg-transparent text-[var(--nexiora-navy)] border border-[var(--nexiora-border)] hover:bg-[var(--nexiora-off-white)]',
    };

    const sizes = {
      sm: 'h-8 px-3 text-sm rounded-[var(--radius-btn)]',
      md: 'h-10 px-5 text-sm rounded-[var(--radius-btn)]',
      lg: 'h-12 px-7 text-base rounded-[var(--radius-btn)]',
    };

    return (
      <a
        ref={ref}
        className={clsx(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </a>
    );
  },
);

LinkButton.displayName = 'LinkButton';
