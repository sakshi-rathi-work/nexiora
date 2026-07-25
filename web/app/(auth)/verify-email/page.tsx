'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = React.useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const hasCalled = React.useRef(false);

  React.useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('Verification token is missing from the link.');
      return;
    }

    if (hasCalled.current) return;
    hasCalled.current = true;

    const verify = async () => {
      try {
        await apiClient.get(`/auth/verify-email?token=${token}`);
        setStatus('success');
      } catch (err: any) {
        setStatus('error');
        setErrorMessage(
          err.response?.data?.message || 'Invalid or expired verification token.',
        );
      }
    };

    verify();
  }, [token]);

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-8">
        <Loader2 size={40} className="animate-spin text-[var(--nexiora-navy)]" />
        <h1
          className="text-xl font-bold text-[var(--nexiora-navy)]"
          style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}
        >
          Verifying Your Email…
        </h1>
        <p className="text-sm text-[var(--nexiora-slate)]">
          Please wait while we confirm your email token.
        </p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-4">
        <div className="w-12 h-12 rounded-full bg-[rgba(184,66,46,0.1)] flex items-center justify-center text-[var(--status-error)]">
          <XCircle size={32} />
        </div>
        <h1
          className="text-2xl font-bold text-[var(--nexiora-navy)]"
          style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}
        >
          Verification Failed
        </h1>
        <p className="text-sm text-[var(--nexiora-slate)] max-w-sm">
          {errorMessage}
        </p>
        <div className="mt-4 flex flex-col gap-2 w-full">
          <Link href="/signup">
            <Button variant="primary" size="md" className="w-full">
              Create New Account
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="ghost" size="md" className="w-full">
              Back to Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center gap-4 py-4">
      <div className="w-12 h-12 rounded-full bg-[rgba(46,125,91,0.1)] flex items-center justify-center text-[var(--status-success)]">
        <CheckCircle2 size={32} />
      </div>
      <h1
        className="text-2xl font-bold text-[var(--nexiora-navy)]"
        style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}
      >
        Email Verified!
      </h1>
      <p className="text-sm text-[var(--nexiora-slate)] max-w-sm">
        Your email address has been successfully verified. You can now log in to
        access your dashboard.
      </p>
      <div className="mt-4 w-full">
        <Link href="/login">
          <Button variant="primary" size="lg" className="w-full">
            Proceed to Sign In
          </Button>
        </Link>
      </div>
    </div>
  );
}
