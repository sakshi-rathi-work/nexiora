'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/lib/auth-store';
import { loginSchema, type LoginFormValues } from '@/lib/validators/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/dashboard';

  const setAuth = useAuthStore((state) => state.setAuth);

  const [formData, setFormData] = React.useState<LoginFormValues>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = React.useState<Partial<Record<keyof LoginFormValues, string>>>({});
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name as keyof LoginFormValues]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setServerError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Validate with Zod
    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginFormValues, string>> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as keyof LoginFormValues] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await apiClient.post('/auth/login', {
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      setAuth(data.user, data.accessToken);
      router.push(from);
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        'Invalid email or password. Please check your credentials.';
      setServerError(typeof message === 'string' ? message : message[0]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1
          className="text-2xl font-bold text-[var(--nexiora-navy)]"
          style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}
        >
          Welcome Back
        </h1>
        <p className="text-sm text-[var(--nexiora-slate)] mt-1">
          Sign in to access your NEXIORA account
        </p>
      </div>

      {serverError && (
        <div className="p-3 bg-[rgba(184,66,46,0.1)] border border-[var(--status-error)] rounded-[var(--radius-btn)] text-xs text-[var(--status-error)]">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          leftIcon={<Mail size={18} />}
          required
        />

        <Input
          label="Password"
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
          required
        />

        <div className="flex items-center justify-between text-xs mt-1">
          <label className="flex items-center gap-2 text-[var(--nexiora-slate)] cursor-pointer">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="rounded border-[var(--nexiora-border)] text-[var(--nexiora-navy)] focus:ring-[var(--nexiora-navy)]"
            />
            <span>Remember me for 30 days</span>
          </label>

          <Link
            href="/forgot-password"
            className="font-medium text-[var(--nexiora-navy)] hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full mt-2"
        >
          Sign In
        </Button>
      </form>

      <div className="text-center text-xs text-[var(--nexiora-slate)] border-t border-[var(--nexiora-border)] pt-4">
        Don&apos;t have an account?{' '}
        <Link
          href="/signup"
          className="font-semibold text-[var(--nexiora-navy)] hover:underline"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}
