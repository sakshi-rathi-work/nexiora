'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Briefcase,
  FileText,
  User as UserIcon,
  CheckCircle2,
  ArrowRight,
  Building2,
  Users,
  PlusCircle,
  Loader2,
} from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import { apiClient } from '@/lib/api-client';
import { StatCard } from '@/components/ui/stat-card';
import { Button } from '@/components/ui/button';
import { Badge, getApplicationStatusVariant } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const isRecruiter = user?.role === 'RECRUITER';

  const [applications, setApplications] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Fetch applications to update dashboard counters dynamically
  React.useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const endpoint = isRecruiter ? '/applications/recruiter' : '/applications/me';
        const { data } = await apiClient.get(endpoint);
        setApplications(Array.isArray(data) ? data : []);
      } catch {
        setApplications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [isRecruiter]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Recruiter Portal View
  if (isRecruiter) {
    const totalApplicants = applications.length;
    const uniqueMandatesCount = new Set(applications.map((a) => a.jobId)).size;

    return (
      <div className="flex flex-col gap-8">
        {/* Recruiter Header Banner */}
        <div className="bg-white p-8 rounded-[var(--radius-card)] border border-[var(--nexiora-border)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1
                className="text-2xl md:text-3xl font-bold text-[var(--nexiora-navy)]"
                style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}
              >
                Welcome back, {user?.firstName ?? 'Recruiter'}!
              </h1>
              <Badge variant="info">Employer / Recruiter</Badge>
            </div>
            <p className="text-sm text-[var(--nexiora-slate)]">
              Employer Portal — manage your hiring mandates and candidate applications.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/contact">
              <Button variant="secondary" size="md">
                <PlusCircle size={16} className="mr-1.5" /> Post Job Requirement
              </Button>
            </Link>
            <Link href="/dashboard/profile">
              <Button variant="ghost" size="md">
                <UserIcon size={16} className="mr-1.5" /> Company Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* Recruiter Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard
            label="Active Job Mandates"
            value={isLoading ? '…' : String(uniqueMandatesCount)}
            icon={<Briefcase size={24} />}
            description="Open hiring roles managed by NEXIORA"
          />
          <StatCard
            label="Candidate Applicants"
            value={isLoading ? '…' : String(totalApplicants)}
            icon={<Users size={24} />}
            description="Total applicants received"
          />
          <StatCard
            label="Account Status"
            value={user?.isEmailVerified ? 'Verified' : 'Pending Verification'}
            icon={<CheckCircle2 size={24} />}
            description={user?.isEmailVerified ? 'Email confirmed' : 'Check inbox for link'}
          />
        </div>

        {/* Recruiter Job Mandates & Applications Section */}
        <div className="bg-white p-8 rounded-[var(--radius-card)] border border-[var(--nexiora-border)] shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-[var(--nexiora-navy)]">
                Active Candidate Applications
              </h2>
              <p className="text-xs text-[var(--nexiora-slate)] mt-0.5">
                Review and update candidate status for your assigned job mandates.
              </p>
            </div>
            <Link
              href="/dashboard/applications"
              className="text-xs font-semibold text-[var(--nexiora-navy)] hover:underline"
            >
              Manage All Applications →
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 size={32} className="animate-spin text-[var(--nexiora-navy)]" />
            </div>
          ) : applications.length === 0 ? (
            <EmptyState
              icon={<Building2 size={48} strokeWidth={1.5} />}
              heading="No candidate applications received yet"
              description="NEXIORA account managers manage your hiring mandates. When candidates apply to your roles, they will appear here."
              ctaLabel="Contact Account Team"
              ctaHref="/contact"
            />
          ) : (
            <div className="flex flex-col gap-3">
              {applications.slice(0, 5).map((app) => (
                <div
                  key={app.id}
                  className="p-4 rounded-[var(--radius-btn)] border border-[var(--nexiora-border)] bg-[var(--nexiora-off-white)] flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[var(--nexiora-navy)] text-white flex items-center justify-center font-bold text-xs">
                      {app.candidate?.firstName?.[0]}
                      {app.candidate?.lastName?.[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[var(--nexiora-navy)]">
                        {app.candidate?.firstName} {app.candidate?.lastName}
                      </p>
                      <p className="text-xs text-[var(--nexiora-slate)]">
                        Applied for: <span className="font-semibold">{app.job?.title}</span>
                      </p>
                    </div>
                  </div>

                  <Badge variant={getApplicationStatusVariant(app.status)}>
                    {app.status.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Candidate / Job Seeker Portal View
  const totalSubmitted = applications.length;
  const activeReviews = applications.filter(
    (a) => a.status !== 'WITHDRAWN' && a.status !== 'REJECTED',
  ).length;

  return (
    <div className="flex flex-col gap-8">
      {/* Candidate Header Banner */}
      <div className="bg-white p-8 rounded-[var(--radius-card)] border border-[var(--nexiora-border)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1
              className="text-2xl md:text-3xl font-bold text-[var(--nexiora-navy)]"
              style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}
            >
              Welcome back, {user?.firstName ?? 'User'}!
            </h1>
            <Badge variant="gold">Job Seeker</Badge>
          </div>
          <p className="text-sm text-[var(--nexiora-slate)]">
            Candidate Portal — manage your applications, profile, and job search.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link href="/dashboard/profile">
            <Button variant="ghost" size="md">
              <UserIcon size={16} className="mr-1.5" /> Edit Profile
            </Button>
          </Link>
          <Link href="/jobs">
            <Button variant="primary" size="md">
              Browse Jobs <ArrowRight size={16} className="ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Candidate Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          label="Applications Submitted"
          value={isLoading ? '…' : String(totalSubmitted)}
          icon={<FileText size={24} />}
          description="Total jobs applied for"
        />
        <StatCard
          label="Active Reviews"
          value={isLoading ? '…' : String(activeReviews)}
          icon={<Briefcase size={24} />}
          description="Applications under review or interview"
        />
        <StatCard
          label="Account Status"
          value={user?.isEmailVerified ? 'Verified' : 'Pending Verification'}
          icon={<CheckCircle2 size={24} />}
          description={user?.isEmailVerified ? 'Email confirmed' : 'Check inbox for link'}
        />
      </div>

      {/* Candidate Recent Applications Section */}
      <div className="bg-white p-8 rounded-[var(--radius-card)] border border-[var(--nexiora-border)] shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[var(--nexiora-navy)]">
            Recent Applications
          </h2>
          <Link
            href="/dashboard/applications"
            className="text-xs font-semibold text-[var(--nexiora-navy)] hover:underline"
          >
            View All Applications →
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 size={32} className="animate-spin text-[var(--nexiora-navy)]" />
          </div>
        ) : applications.length === 0 ? (
          <EmptyState
            icon={<FileText size={48} strokeWidth={1.5} />}
            heading="No applications submitted yet"
            description="When you apply for jobs on NEXIORA, your application progress and status updates will appear here."
            ctaLabel="Explore Openings"
            ctaHref="/jobs"
          />
        ) : (
          <div className="flex flex-col gap-3">
            {applications.slice(0, 5).map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-[var(--radius-btn)] border border-[var(--nexiora-border)] bg-[var(--nexiora-off-white)] flex items-center justify-between gap-4"
              >
                <div className="flex flex-col gap-0.5">
                  <Link
                    href={`/jobs/${app.job?.slug || app.job?.id}`}
                    className="text-sm font-bold text-[var(--nexiora-navy)] hover:underline"
                  >
                    {app.job?.title}
                  </Link>
                  <p className="text-xs text-[var(--nexiora-slate)]">
                    {app.job?.company?.name} • Applied on {formatDate(app.appliedAt)}
                  </p>
                </div>

                <Badge variant={getApplicationStatusVariant(app.status)}>
                  {app.status.replace('_', ' ')}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
