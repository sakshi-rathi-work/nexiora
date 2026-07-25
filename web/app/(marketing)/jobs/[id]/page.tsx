'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Building2,
  MapPin,
  IndianRupee,
  ExternalLink,
  ArrowLeft,
  Loader2,
  FileCheck,
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/lib/auth-store';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ApplyModal } from '@/components/jobs/apply-modal';

interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  industry?: string;
  website?: string;
  description?: string;
  isVerified?: boolean;
}

interface JobDetails {
  id: string;
  slug: string;
  title: string;
  location: string;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  experienceLevel: 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD';
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  description: string;
  skills: string[];
  createdAt: string;
  company: Company;
  relatedJobs?: JobDetails[];
}

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idOrSlug = params.id as string;

  const { isAuthenticated, user } = useAuthStore();
  const { addToast } = useToast();

  const [job, setJob] = React.useState<JobDetails | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasApplied, setHasApplied] = React.useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (!idOrSlug) return;

    const fetchJobDetails = async () => {
      setIsLoading(true);
      try {
        const { data } = await apiClient.get(`/jobs/${idOrSlug}`);
        setJob(data);
      } catch {
        setJob(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [idOrSlug]);

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      addToast({
        type: 'info',
        title: 'Sign in required',
        message: 'Please sign in to your NEXIORA candidate account to submit your application.',
      });
      router.push(`/login?returnUrl=/jobs/${idOrSlug}`);
      return;
    }

    if (user?.role === 'RECRUITER') {
      addToast({
        type: 'error',
        title: 'Candidate action only',
        message: 'Employer / Recruiter accounts cannot apply for job postings.',
      });
      return;
    }

    setIsApplyModalOpen(true);
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Salary Undisclosed';
    const formatNum = (num: number) =>
      num >= 100000 ? `₹${(num / 100000).toFixed(1)}L` : `₹${num.toLocaleString('en-IN')}`;
    if (min && max) return `${formatNum(min)} - ${formatNum(max)} / yr`;
    if (min) return `From ${formatNum(min)} / yr`;
    return `Up to ${formatNum(max!)} / yr`;
  };

  const formatBadgeLabel = (str: string) =>
    str.replace('_', ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--nexiora-off-white)] py-20 flex flex-col items-center justify-center gap-3">
        <Loader2 size={36} className="animate-spin text-[var(--nexiora-navy)]" />
        <p className="text-sm font-medium text-[var(--nexiora-slate)]">
          Loading job details…
        </p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[var(--nexiora-off-white)] py-20 flex flex-col items-center justify-center gap-4 text-center">
        <h1
          className="text-2xl font-bold text-[var(--nexiora-navy)]"
          style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}
        >
          Job Opening Not Found
        </h1>
        <p className="text-sm text-[var(--nexiora-slate)] max-w-md">
          The job listing you are looking for may have been closed or removed by the employer.
        </p>
        <Link href="/jobs">
          <Button variant="primary" size="md">
            <ArrowLeft size={16} className="mr-1.5" /> Back to All Jobs
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--nexiora-off-white)] py-10">
      <div className="container-nexiora flex flex-col gap-8">
        {/* Back Link */}
        <div>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--nexiora-slate)] hover:text-[var(--nexiora-navy)] transition-colors"
          >
            <ArrowLeft size={14} /> Back to Job Search
          </Link>
        </div>

        {/* Job Header Card */}
        <div className="bg-white p-8 rounded-[var(--radius-card)] border border-[var(--nexiora-border)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="navy">{formatBadgeLabel(job.employmentType)}</Badge>
              <Badge variant="gold">{formatBadgeLabel(job.experienceLevel)}</Badge>
            </div>

            <h1
              className="text-2xl md:text-3xl font-bold text-[var(--nexiora-navy)]"
              style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}
            >
              {job.title}
            </h1>

            <div className="flex items-center gap-5 text-sm text-[var(--nexiora-slate)] flex-wrap">
              <span className="font-semibold text-[var(--nexiora-navy)] flex items-center gap-1.5">
                <Building2 size={16} className="text-[var(--nexiora-slate-light)]" />
                {job.company.name}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={16} className="text-[var(--nexiora-slate-light)]" />
                {job.location}
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-[var(--status-success)]">
                <IndianRupee size={16} />
                {formatSalary(job.salaryMin, job.salaryMax)}
              </span>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            {hasApplied ? (
              <Button variant="secondary" size="lg" disabled className="text-[var(--status-success)] border-[var(--status-success)]">
                <FileCheck size={18} className="mr-1.5 text-[var(--status-success)]" /> Application Submitted
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={handleApplyClick}
              >
                Apply Now
              </Button>
            )}
          </div>
        </div>

        {/* Two-Column Grid (Job Body + Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Description Column */}
          <main className="lg:col-span-8 flex flex-col gap-8">
            {/* Job Description Card */}
            <div className="bg-white p-8 rounded-[var(--radius-card)] border border-[var(--nexiora-border)] shadow-xs flex flex-col gap-6">
              <h2 className="text-xl font-bold text-[var(--nexiora-navy)] border-b border-[var(--nexiora-border)] pb-3">
                Job Description
              </h2>

              <div className="prose max-w-none text-sm text-[var(--nexiora-slate)] leading-relaxed whitespace-pre-line">
                {job.description}
              </div>

              {/* Skills Tags */}
              <div className="mt-4 pt-4 border-t border-[var(--nexiora-border)]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--nexiora-navy)] mb-3">
                  Required Skills & Technologies
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--nexiora-off-white)] border border-[var(--nexiora-border)] text-[var(--nexiora-navy)]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </main>

          {/* Sidebar (Company Info + Related Jobs) */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            {/* Company Card */}
            <div className="bg-white p-6 rounded-[var(--radius-card)] border border-[var(--nexiora-border)] shadow-xs flex flex-col gap-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--nexiora-navy)] border-b border-[var(--nexiora-border)] pb-2">
                About The Employer
              </h3>

              <div>
                <h4 className="text-base font-bold text-[var(--nexiora-navy)]">
                  {job.company.name}
                </h4>
                {job.company.industry && (
                  <p className="text-xs text-[var(--nexiora-slate)] mt-0.5">
                    {job.company.industry}
                  </p>
                )}
              </div>

              {job.company.description && (
                <p className="text-xs text-[var(--nexiora-slate)] leading-relaxed line-clamp-4">
                  {job.company.description}
                </p>
              )}

              {job.company.website && (
                <a
                  href={job.company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--nexiora-navy)] hover:underline mt-1"
                >
                  Visit Website <ExternalLink size={12} />
                </a>
              )}
            </div>

            {/* Related Jobs */}
            {job.relatedJobs && job.relatedJobs.length > 0 && (
              <div className="bg-white p-6 rounded-[var(--radius-card)] border border-[var(--nexiora-border)] shadow-xs flex flex-col gap-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--nexiora-navy)] border-b border-[var(--nexiora-border)] pb-2">
                  More Openings at {job.company.name}
                </h3>

                <div className="flex flex-col gap-3">
                  {job.relatedJobs.map((relJob) => (
                    <Link
                      key={relJob.id}
                      href={`/jobs/${relJob.slug || relJob.id}`}
                      className="group p-3 rounded-[var(--radius-btn)] border border-[var(--nexiora-border)] hover:border-[var(--nexiora-navy)] transition-colors flex flex-col gap-1"
                    >
                      <p className="text-xs font-bold text-[var(--nexiora-navy)] group-hover:text-[var(--nexiora-gold-solid)] transition-colors">
                        {relJob.title}
                      </p>
                      <p className="text-[11px] text-[var(--nexiora-slate)]">
                        {relJob.location}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Apply Modal */}
      {job && (
        <ApplyModal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          jobId={job.id}
          jobTitle={job.title}
          companyName={job.company.name}
          onSuccess={() => setHasApplied(true)}
        />
      )}
    </div>
  );
}
