'use client';

import * as React from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Lock, Mail, User as UserIcon, CheckCircle2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { signupSchema, type SignupFormValues } from '@/lib/validators/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SignupPage() {
  const [formData, setFormData] = React.useState<SignupFormValues>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'CANDIDATE',
  });

  const [errors, setErrors] = React.useState<Partial<Record<keyof SignupFormValues, string>>>({});
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [debugToken, setDebugToken] = React.useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof SignupFormValues]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setServerError(null);
  };

  const handleRoleSelect = (role: 'CANDIDATE' | 'RECRUITER') => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const result = signupSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof SignupFormValues, string>> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as keyof SignupFormValues] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await apiClient.post('/auth/signup', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      setIsSubmitted(true);
      if (data.debugVerificationToken) {
        setDebugToken(data.debugVerificationToken);
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'Registration failed. Please try again.';
      setServerError(typeof message === 'string' ? message : message[0]);
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
          Account Created!
        </h1>
        <p className="text-sm text-[var(--nexiora-slate)] max-w-sm">
          We have sent a verification link to{' '}
          <strong className="text-[var(--nexiora-navy)]">{formData.email}</strong>.
          Please check your inbox to activate your account.
        </p>

        {debugToken && (
          <div className="w-full mt-4 p-4 bg-[var(--nexiora-off-white)] border border-[var(--nexiora-border)] rounded-[var(--radius-card)] text-left">
            <p className="text-xs font-mono font-bold text-[var(--nexiora-navy)] mb-1">
              [DEV MOCK EMAIL LINK]:
            </p>
            <Link
              href={`/verify-email?token=${debugToken}`}
              className="text-xs text-[var(--nexiora-gold-solid)] underline break-all font-mono"
            >
              Verify Email Now →
            </Link>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-[var(--nexiora-border)] w-full text-xs text-[var(--nexiora-slate)]">
          Already verified?{' '}
          <Link
            href="/login"
            className="font-semibold text-[var(--nexiora-navy)] hover:underline"
          >
            Sign In Here
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
          Create Your Account
        </h1>
        <p className="text-sm text-[var(--nexiora-slate)] mt-1">
          Join NEXIORA to access jobs and talent solutions
        </p>
      </div>

      {/* Role Selector */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-[var(--nexiora-off-white)] rounded-[var(--radius-btn)] border border-[var(--nexiora-border)]">
        <button
          type="button"
          onClick={() => handleRoleSelect('CANDIDATE')}
          className={`py-2 text-xs font-medium rounded-md transition-all ${
            formData.role === 'CANDIDATE'
              ? 'bg-[var(--nexiora-navy)] text-white shadow-xs'
              : 'text-[var(--nexiora-slate)] hover:text-[var(--nexiora-navy)]'
          }`}
        >
          Job Seeker
        </button>
        <button
          type="button"
          onClick={() => handleRoleSelect('RECRUITER')}
          className={`py-2 text-xs font-medium rounded-md transition-all ${
            formData.role === 'RECRUITER'
              ? 'bg-[var(--nexiora-navy)] text-white shadow-xs'
              : 'text-[var(--nexiora-slate)] hover:text-[var(--nexiora-navy)]'
          }`}
        >
          Employer / Recruiter
        </button>
      </div>

      {serverError && (
        <div className="p-3 bg-[rgba(184,66,46,0.1)] border border-[var(--status-error)] rounded-[var(--radius-btn)] text-xs text-[var(--status-error)]">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First Name"
            type="text"
            name="firstName"
            placeholder="John"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            leftIcon={<UserIcon size={18} />}
            required
          />

          <Input
            label="Last Name"
            type="text"
            name="lastName"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            required
          />
        </div>

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
          hint="At least 8 chars, 1 uppercase, 1 lowercase, 1 number/symbol"
          required
        />

        <Input
          label="Confirm Password"
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
          Create Account
        </Button>
      </form>

      <div className="text-center text-xs text-[var(--nexiora-slate)] border-t border-[var(--nexiora-border)] pt-4">
        Already have an account?{' '}
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
