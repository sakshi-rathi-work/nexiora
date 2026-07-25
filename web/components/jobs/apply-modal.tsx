'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileText, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/lib/auth-store';
import { useToast } from '@/components/ui/toast';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { TextArea } from '@/components/ui/input';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
  companyName: string;
  onSuccess?: () => void;
}

export function ApplyModal({
  isOpen,
  onClose,
  jobId,
  jobTitle,
  companyName,
  onSuccess,
}: ApplyModalProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const { addToast } = useToast();

  const [coverLetter, setCoverLetter] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [resumeUrl, setResumeUrl] = React.useState<string | null>(null);
  const [isLoadingResume, setIsLoadingResume] = React.useState(true);

  // Fetch candidate profile to check resume status
  React.useEffect(() => {
    if (!isOpen || !user || user.role !== 'CANDIDATE') return;

    const fetchCandidateProfile = async () => {
      setIsLoadingResume(true);
      try {
        const { data } = await apiClient.get('/users/me/candidate-profile');
        setResumeUrl(data.resumeUrl || null);
      } catch {
        setResumeUrl(null);
      } finally {
        setIsLoadingResume(false);
      }
    };

    fetchCandidateProfile();
  }, [isOpen, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resumeUrl) {
      addToast({
        type: 'error',
        title: 'Resume missing',
        message: 'Please upload a resume in your profile before submitting an application.',
      });
      router.push('/dashboard/profile');
      onClose();
      return;
    }

    setIsSubmitting(true);

    try {
      await apiClient.post('/applications', {
        jobId,
        coverLetter: coverLetter.trim() || undefined,
      });

      addToast({
        type: 'success',
        title: 'Application Submitted!',
        message: `Your application for ${jobTitle} at ${companyName} has been sent.`,
      });

      onSuccess?.();
      onClose();
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Submission Failed',
        message: err.response?.data?.message || 'Could not submit application.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Apply to ${companyName}`}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-1">
        <div>
          <h3 className="text-base font-bold text-[var(--nexiora-navy)]">{jobTitle}</h3>
          <p className="text-xs text-[var(--nexiora-slate)]">{companyName}</p>
        </div>

        {/* Resume status box */}
        {isLoadingResume ? (
          <div className="p-4 rounded-[var(--radius-btn)] bg-[var(--nexiora-off-white)] border border-[var(--nexiora-border)] text-xs text-[var(--nexiora-slate)] animate-pulse">
            Checking resume availability…
          </div>
        ) : resumeUrl ? (
          <div className="flex items-center gap-3 p-3.5 rounded-[var(--radius-btn)] bg-[rgba(46,125,91,0.08)] border border-[rgba(46,125,91,0.25)]">
            <CheckCircle2 size={20} className="text-[var(--status-success)] shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-[var(--nexiora-navy)]">
                Resume attached from profile
              </p>
              <p className="text-[11px] text-[var(--nexiora-slate)]">
                Your saved resume will be submitted with this application.
              </p>
            </div>
            <Link href="/dashboard/profile" target="_blank" className="text-xs font-bold text-[var(--nexiora-navy)] hover:underline shrink-0">
              Update
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-3.5 rounded-[var(--radius-btn)] bg-[rgba(184,66,46,0.08)] border border-[rgba(184,66,46,0.25)]">
            <AlertCircle size={20} className="text-[var(--status-error)] shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-[var(--status-error)]">
                No resume found in profile
              </p>
              <p className="text-[11px] text-[var(--nexiora-slate)]">
                Upload your resume before applying to jobs.
              </p>
            </div>
            <Link href="/dashboard/profile" onClick={onClose} className="text-xs font-bold text-[var(--nexiora-navy)] hover:underline flex items-center gap-0.5 shrink-0">
              Upload <ArrowRight size={12} />
            </Link>
          </div>
        )}

        {/* Optional Cover Letter */}
        <TextArea
          label="Cover Letter / Note to Hiring Team (Optional)"
          rows={4}
          placeholder="Briefly explain why your skills and experience make you a great fit for this position..."
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
        />

        <div className="flex justify-end items-center gap-3 mt-2">
          <Button type="button" variant="ghost" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            disabled={!resumeUrl}
          >
            Submit Application
          </Button>
        </div>
      </form>
    </Modal>
  );
}
