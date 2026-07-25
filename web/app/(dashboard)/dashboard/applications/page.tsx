'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FileText,
  Building2,
  MapPin,
  Clock,
  Download,
  ExternalLink,
  Loader2,
  XCircle,
  CheckCircle2,
  User as UserIcon,
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/lib/auth-store';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Badge, getApplicationStatusVariant } from '@/components/ui/badge';
import { Select } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

const RECRUITER_STATUS_OPTIONS = [
  { value: 'SUBMITTED', label: 'Submitted' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'SHORTLISTED', label: 'Shortlisted' },
  { value: 'INTERVIEW', label: 'Invite to Interview' },
  { value: 'OFFERED', label: 'Job Offered' },
  { value: 'REJECTED', label: 'Rejected' },
];

export default function ApplicationsPage() {
  const { user } = useAuthStore();
  const { addToast } = useToast();

  const isRecruiter = user?.role === 'RECRUITER';
  const [applications, setApplications] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

  // Fetch applications list
  const fetchApplications = React.useCallback(async () => {
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
  }, [isRecruiter]);

  React.useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Candidate: Withdraw Application
  const handleWithdraw = async (applicationId: string) => {
    setUpdatingId(applicationId);
    try {
      await apiClient.patch(`/applications/${applicationId}/withdraw`);
      addToast({
        type: 'success',
        title: 'Application Withdrawn',
        message: 'Your application status has been set to Withdrawn.',
      });
      fetchApplications();
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Withdraw Failed',
        message: err.response?.data?.message || 'Failed to withdraw application.',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  // Recruiter: Update Application Status
  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    setUpdatingId(applicationId);
    try {
      await apiClient.patch(`/applications/${applicationId}/status`, {
        status: newStatus,
      });
      addToast({
        type: 'success',
        title: 'Status Updated',
        message: `Candidate application status updated to ${newStatus.replace('_', ' ')}.`,
      });
      fetchApplications();
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: err.response?.data?.message || 'Failed to update status.',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 size={36} className="animate-spin text-[var(--nexiora-navy)]" />
        <p className="text-sm font-medium text-[var(--nexiora-slate)]">
          Loading applications…
        </p>
      </div>
    );
  }

  // Recruiter View
  if (isRecruiter) {
    return (
      <div className="flex flex-col gap-8">
        <div className="bg-white p-8 rounded-[var(--radius-card)] border border-[var(--nexiora-border)] shadow-xs flex items-center justify-between">
          <div>
            <h1
              className="text-2xl font-bold text-[var(--nexiora-navy)]"
              style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}
            >
              Candidate Applications & Mandate Matching
            </h1>
            <p className="text-sm text-[var(--nexiora-slate)] mt-1">
              Review candidates who applied for your hiring mandates and update their status.
            </p>
          </div>
          <Badge variant="info">Employer / Recruiter</Badge>
        </div>

        <div className="bg-white rounded-[var(--radius-card)] border border-[var(--nexiora-border)] shadow-xs overflow-hidden">
          {applications.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={<FileText size={48} strokeWidth={1.5} />}
                heading="No candidate applications received yet"
                description="When candidates submit applications for your job mandates, their profile details and resumes will appear here."
                ctaLabel="View Open Jobs"
                ctaHref="/jobs"
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[var(--nexiora-navy)] border-collapse">
                <thead className="bg-[var(--nexiora-off-white)] border-b border-[var(--nexiora-border)] uppercase tracking-wider text-[var(--nexiora-slate)] font-bold">
                  <tr>
                    <th className="py-4 px-6">Candidate</th>
                    <th className="py-4 px-6">Applied Role</th>
                    <th className="py-4 px-6">Applied Date</th>
                    <th className="py-4 px-6">Resume</th>
                    <th className="py-4 px-6">Status Updater</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--nexiora-border)]">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Candidate Details */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full border border-[var(--nexiora-border)] overflow-hidden bg-[var(--nexiora-off-white)] flex items-center justify-center font-bold text-sm shrink-0">
                            {app.candidate?.avatarUrl ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={`${API_BASE_URL}${app.candidate.avatarUrl}`}
                                alt="Candidate Avatar"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span>
                                {app.candidate?.firstName?.[0]}
                                {app.candidate?.lastName?.[0]}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-[var(--nexiora-navy)]">
                              {app.candidate?.firstName} {app.candidate?.lastName}
                            </p>
                            <p className="text-[11px] text-[var(--nexiora-slate)]">
                              {app.candidate?.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Applied Role */}
                      <td className="py-4 px-6 font-semibold text-sm">
                        {app.job?.title || 'Job Opening'}
                      </td>

                      {/* Applied Date */}
                      <td className="py-4 px-6 text-[var(--nexiora-slate)]">
                        {formatDate(app.appliedAt)}
                      </td>

                      {/* Resume Link */}
                      <td className="py-4 px-6">
                        <a
                          href={`${API_BASE_URL}${app.resumeUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-[var(--nexiora-navy)] hover:underline"
                        >
                          <Download size={14} /> Resume PDF
                        </a>
                      </td>

                      {/* Status Selector */}
                      <td className="py-4 px-6">
                        <div className="w-44">
                          <Select
                            options={RECRUITER_STATUS_OPTIONS}
                            value={app.status}
                            disabled={updatingId === app.id}
                            onChange={(e) => handleStatusChange(app.id, e.target.value)}
                            className="text-xs h-9"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Candidate View
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-8 rounded-[var(--radius-card)] border border-[var(--nexiora-border)] shadow-xs flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-[var(--nexiora-navy)]"
            style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}
          >
            My Submitted Applications
          </h1>
          <p className="text-sm text-[var(--nexiora-slate)] mt-1">
            Track your job application progress, review status updates, or withdraw submissions.
          </p>
        </div>
        <Badge variant="gold">Job Seeker</Badge>
      </div>

      <div className="bg-white rounded-[var(--radius-card)] border border-[var(--nexiora-border)] shadow-xs overflow-hidden">
        {applications.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={<FileText size={48} strokeWidth={1.5} />}
              heading="No applications submitted yet"
              description="When you apply for jobs on NEXIORA, your active applications and employer review progress will appear here."
              ctaLabel="Explore Openings"
              ctaHref="/jobs"
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[var(--nexiora-navy)] border-collapse">
              <thead className="bg-[var(--nexiora-off-white)] border-b border-[var(--nexiora-border)] uppercase tracking-wider text-[var(--nexiora-slate)] font-bold">
                <tr>
                  <th className="py-4 px-6">Role & Company</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6">Applied Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--nexiora-border)]">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Role & Company */}
                    <td className="py-4 px-6">
                      <div>
                        <Link
                          href={`/jobs/${app.job?.slug || app.job?.id}`}
                          className="font-bold text-sm text-[var(--nexiora-navy)] hover:underline"
                        >
                          {app.job?.title}
                        </Link>
                        <p className="text-[11px] text-[var(--nexiora-slate)] flex items-center gap-1 mt-0.5">
                          <Building2 size={12} /> {app.job?.company?.name}
                        </p>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-4 px-6 text-[var(--nexiora-slate)]">
                      {app.job?.location || 'Location'}
                    </td>

                    {/* Applied Date */}
                    <td className="py-4 px-6 text-[var(--nexiora-slate)]">
                      {formatDate(app.appliedAt)}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      <Badge variant={getApplicationStatusVariant(app.status)}>
                        {app.status.replace('_', ' ')}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      {app.status !== 'WITHDRAWN' ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          isLoading={updatingId === app.id}
                          onClick={() => handleWithdraw(app.id)}
                          className="text-[var(--status-error)] hover:bg-red-50"
                        >
                          Withdraw
                        </Button>
                      ) : (
                        <span className="text-[11px] text-[var(--nexiora-slate-light)] italic">
                          Withdrawn
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
