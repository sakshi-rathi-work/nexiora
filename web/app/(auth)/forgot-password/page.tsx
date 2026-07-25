'use client';

import * as React from 'react';
import Link from 'next/link';
import { Mail, CheckCircle2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/lib/validators/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setIsLoading(true);

    try {
      await apiClient.post('/auth/forgot-password', { email });
      setIsSubmitted(true);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Something went wrong. Please try again later.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-4">
        <div className="w-12 h-12 rounded-full bg-[rgba(46,125,91,0.1)] flex items-center justify-center text-[var(--status-success)]">
          <CheckCircle2 size={32} />
        </div>
        <h1
          className="text-2xl font-bold text-[var(--nexiora-navy)]"
          style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}
        >
          Check Your Inbox
        </h1>
        <p className="text-sm text-[var(--nexiora-slate)] max-w-sm">
          If an account exists for <strong className="text-[var(--nexiora-navy)]">{email}</strong>,
          we have sent password reset instructions.
        </p>

        <div className="mt-4 pt-4 border-t border-[var(--nexiora-border)] w-full text-xs text-[var(--nexiora-slate)]">
          Remember your password?{' '}
          <Link
            href="/login"
            className="font-semibold text-[var(--nexiora-navy)] hover:underline"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1
          className="text-2xl font-bold text-[var(--nexiora-navy)]"
          style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}
        >
          Reset Password
        </h1>
        <p className="text-sm text-[var(--nexiora-slate)] mt-1">
          Enter your email to receive a password reset link
        </p>
      </div>

      {error && (
        <div className="p-3 bg-[rgba(184,66,46,0.1)] border border-[var(--status-error)] rounded-[var(--radius-btn)] text-xs text-[var(--status-error)]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(null);
          }}
          leftIcon={<Mail size={18} />}
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full mt-2"
        >
          Send Reset Link
        </Button>
      </form>

      <div className="text-center text-xs text-[var(--nexiora-slate)] border-t border-[var(--nexiora-border)] pt-4">
        Remembered your password?{' '}
        <Link
          href="/login"
          className="font-semibold text-[var(--nexiora-navy)] hover:underline"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
