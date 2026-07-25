'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Lock, CheckCircle2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { resetPasswordSchema, type ResetPasswordFormValues } from '@/lib/validators/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = React.useState<ResetPasswordFormValues>({
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = React.useState<Partial<Record<keyof ResetPasswordFormValues, string>>>({});
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ResetPasswordFormValues]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setServerError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!token) {
      setServerError('Reset token is missing. Please check your link.');
      return;
    }

    const result = resetPasswordSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ResetPasswordFormValues, string>> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as keyof ResetPasswordFormValues] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      await apiClient.post('/auth/reset-password', {
        token,
        newPassword: formData.password,
      });

      setIsSuccess(true);
    } catch (err: any) {
      setServerError(
        err.response?.data?.message ||
          'Failed to reset password. The link may be expired.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-4">
        <div className="w-12 h-12 rounded-full bg-[rgba(46,125,91,0.1)] flex items-center justify-center text-[var(--status-success)]">
          <CheckCircle2 size={32} />
        </div>
        <h1
          className="text-2xl font-bold text-[var(--nexiora-navy)]"
          style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}
        >
          Password Reset Complete!
        </h1>
        <p className="text-sm text-[var(--nexiora-slate)] max-w-sm">
          Your password has been updated successfully. You can now log in with
          your new password.
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

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1
          className="text-2xl font-bold text-[var(--nexiora-navy)]"
          style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}
        >
          Set New Password
        </h1>
        <p className="text-sm text-[var(--nexiora-slate)] mt-1">
          Enter your new password below
        </p>
      </div>

      {serverError && (
        <div className="p-3 bg-[rgba(184,66,46,0.1)] border border-[var(--status-error)] rounded-[var(--radius-btn)] text-xs text-[var(--status-error)]">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          label="New Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          leftIcon={<Lock size={18} />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="text-[var(--nexiora-slate-light)] hover:text-[var(--nexiora-navy)]"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
          hint="At least 8 chars, 1 uppercase, 1 lowercase, 1 number/symbol"
          required
        />

        <Input
          label="Confirm New Password"
          type={showPassword ? 'text' : 'password'}
          name="confirmPassword"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          leftIcon={<Lock size={18} />}
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full mt-2"
        >
          Reset Password
        </Button>
      </form>
    </div>
  );
}
