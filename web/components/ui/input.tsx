import * as React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--nexiora-navy)]"
          >
            {label}
            {props.required && (
              <span className="text-[var(--status-error)] ml-0.5" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-[var(--nexiora-slate-light)] pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            aria-invalid={!!error}
            className={clsx(
              'w-full h-11 px-3 text-sm text-[var(--nexiora-navy)] bg-white',
              'border rounded-[var(--radius-btn)] transition-colors duration-150',
              'placeholder:text-[var(--nexiora-slate-light)]',
              'focus:outline-2 focus:outline-[var(--nexiora-navy)] focus:outline-offset-0',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--nexiora-off-white)]',
              error
                ? 'border-[var(--status-error)]'
                : 'border-[var(--nexiora-border)] focus:border-[var(--nexiora-navy)]',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className,
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 text-[var(--nexiora-slate-light)]">
              {rightIcon}
            </span>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-[var(--status-error)]" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-[var(--nexiora-slate-light)]">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--nexiora-navy)]"
          >
            {label}
            {props.required && (
              <span className="text-[var(--status-error)] ml-0.5" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          aria-invalid={!!error}
          className={clsx(
            'w-full px-3 py-2.5 text-sm text-[var(--nexiora-navy)] bg-white',
            'border rounded-[var(--radius-btn)] transition-colors duration-150',
            'placeholder:text-[var(--nexiora-slate-light)]',
            'focus:outline-2 focus:outline-[var(--nexiora-navy)] focus:outline-offset-0',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--nexiora-off-white)]',
            'resize-y min-h-[100px]',
            error
              ? 'border-[var(--status-error)]'
              : 'border-[var(--nexiora-border)] focus:border-[var(--nexiora-navy)]',
            className,
          )}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-[var(--status-error)]" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-[var(--nexiora-slate-light)]">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

TextArea.displayName = 'TextArea';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, placeholder, className, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--nexiora-navy)]"
          >
            {label}
            {props.required && (
              <span className="text-[var(--status-error)] ml-0.5" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          className={clsx(
            'w-full h-11 px-3 text-sm text-[var(--nexiora-navy)] bg-white',
            'border rounded-[var(--radius-btn)] transition-colors duration-150 cursor-pointer',
            'focus:outline-2 focus:outline-[var(--nexiora-navy)] focus:outline-offset-0',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error
              ? 'border-[var(--status-error)]'
              : 'border-[var(--nexiora-border)] focus:border-[var(--nexiora-navy)]',
            className,
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-xs text-[var(--status-error)]" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-xs text-[var(--nexiora-slate-light)]">{hint}</p>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';
