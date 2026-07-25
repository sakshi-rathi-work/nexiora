'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  User as UserIcon,
  Upload,
  FileText,
  CheckCircle,
  Plus,
  X,
  Loader2,
  Download,
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/lib/auth-store';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Input, TextArea } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const { addToast } = useToast();

  const avatarInputRef = React.useRef<HTMLInputElement>(null);
  const resumeInputRef = React.useRef<HTMLInputElement>(null);

  // Personal Info Form State
  const [personalInfo, setPersonalInfo] = React.useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    phone: '',
  });
  const [isSavingPersonal, setIsSavingPersonal] = React.useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = React.useState(false);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(
    user?.avatarUrl ? `${API_BASE_URL}${user.avatarUrl}` : null,
  );

  // Candidate Profile Form State
  const [candidateProfile, setCandidateProfile] = React.useState({
    headline: '',
    bio: '',
    experienceYears: 0,
    location: '',
    skills: [] as string[],
    resumeUrl: null as string | null,
    resumeOriginalName: null as string | null,
  });
  const [skillInput, setSkillInput] = React.useState('');
  const [isSavingCandidate, setIsSavingCandidate] = React.useState(false);
  const [isUploadingResume, setIsUploadingResume] = React.useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = React.useState(true);

  // Fetch full user and candidate profile on mount
  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: userData } = await apiClient.get('/users/me');
        setUser(userData);
        setPersonalInfo({
          firstName: userData.firstName ?? '',
          lastName: userData.lastName ?? '',
          phone: userData.phone ?? '',
        });
        if (userData.avatarUrl) {
          setAvatarPreview(`${API_BASE_URL}${userData.avatarUrl}`);
        }

        if (userData.role === 'CANDIDATE') {
          const { data: candData } = await apiClient.get('/users/me/candidate-profile');
          setCandidateProfile({
            headline: candData.headline ?? '',
            bio: candData.summary ?? candData.bio ?? '',
            experienceYears: candData.experienceYears ?? 0,
            location: candData.location ?? '',
            skills: Array.isArray(candData.skills) ? candData.skills : [],
            resumeUrl: candData.resumeUrl ? `${API_BASE_URL}${candData.resumeUrl}` : null,
            resumeOriginalName: candData.resumeOriginalName ?? null,
          });
        }
      } catch {
        addToast({
          type: 'error',
          title: 'Failed to load profile',
          message: 'Could not retrieve your profile details from the server.',
        });
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [setUser, addToast]);

  // Handle Avatar File Upload
  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      addToast({
        type: 'error',
        title: 'File too large',
        message: 'Avatar image size cannot exceed 2MB.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsUploadingAvatar(true);

    try {
      const { data } = await apiClient.post('/uploads/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const fullUrl = `${API_BASE_URL}${data.avatarUrl}`;
      setAvatarPreview(fullUrl);
      if (user) {
        setUser({ ...user, avatarUrl: data.avatarUrl });
      }

      addToast({
        type: 'success',
        title: 'Avatar updated',
        message: 'Your profile picture has been updated successfully.',
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Upload failed',
        message: err.response?.data?.message || 'Failed to upload avatar image.',
      });
    } finally {
      setIsUploadingAvatar(false);
      // Reset input value so re-selecting same file fires onChange
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  // Handle Resume File Upload
  const handleResumeFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      addToast({
        type: 'error',
        title: 'File too large',
        message: 'Resume file size cannot exceed 5MB.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsUploadingResume(true);

    try {
      const { data } = await apiClient.post('/uploads/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const fullUrl = `${API_BASE_URL}${data.resumeUrl}`;
      setCandidateProfile((prev) => ({
        ...prev,
        resumeUrl: fullUrl,
        resumeOriginalName: data.resumeOriginalName || file.name,
      }));

      addToast({
        type: 'success',
        title: 'Resume uploaded',
        message: 'Your resume document has been saved successfully.',
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Upload failed',
        message: err.response?.data?.message || 'Failed to upload resume file.',
      });
    } finally {
      setIsUploadingResume(false);
      // Reset input value so re-selecting same file fires onChange
      if (resumeInputRef.current) resumeInputRef.current.value = '';
    }
  };

  // Save Personal Info
  const handleSavePersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPersonal(true);

    try {
      const { data } = await apiClient.patch('/users/me', personalInfo);
      setUser(data);
      addToast({
        type: 'success',
        title: 'Personal info saved',
        message: 'Your personal details have been updated.',
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Save failed',
        message: err.response?.data?.message || 'Failed to update personal details.',
      });
    } finally {
      setIsSavingPersonal(false);
    }
  };

  // Save Candidate Profile
  const handleSaveCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingCandidate(true);

    try {
      const { data } = await apiClient.patch('/users/me/candidate-profile', {
        headline: candidateProfile.headline,
        bio: candidateProfile.bio,
        experienceYears: Number(candidateProfile.experienceYears),
        location: candidateProfile.location,
        skills: candidateProfile.skills,
      });

      setCandidateProfile((prev) => ({
        ...prev,
        headline: data.headline ?? '',
        bio: data.summary ?? data.bio ?? '',
        experienceYears: data.experienceYears ?? 0,
        location: data.location ?? '',
        skills: Array.isArray(data.skills) ? data.skills : [],
      }));

      addToast({
        type: 'success',
        title: 'Candidate profile saved',
        message: 'Your professional details have been updated.',
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Save failed',
        message: err.response?.data?.message || 'Failed to update candidate profile.',
      });
    } finally {
      setIsSavingCandidate(false);
    }
  };

  // Add Skill Tag
  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (candidateProfile.skills.includes(trimmed)) {
      setSkillInput('');
      return;
    }
    setCandidateProfile((prev) => ({
      ...prev,
      skills: [...prev.skills, trimmed],
    }));
    setSkillInput('');
  };

  // Remove Skill Tag
  const handleRemoveSkill = (skillToRemove: string) => {
    setCandidateProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  if (isLoadingProfile) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 size={36} className="animate-spin text-[var(--nexiora-navy)]" />
        <p className="text-sm font-medium text-[var(--nexiora-slate)]">
          Loading profile details…
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      {/* Header Banner */}
      <div className="bg-white p-8 rounded-[var(--radius-card)] border border-[var(--nexiora-border)] shadow-xs flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-[var(--nexiora-navy)]"
            style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}
          >
            My Profile & Preferences
          </h1>
          <p className="text-sm text-[var(--nexiora-slate)] mt-1">
            Update your personal details, professional experience, and resume.
          </p>
        </div>
        <Badge variant={user?.role === 'RECRUITER' ? 'info' : 'gold'}>
          {user?.role === 'RECRUITER' ? 'Employer / Recruiter' : 'Job Seeker'}
        </Badge>
      </div>

      {/* 1. Personal Information Section */}
      <div className="bg-white p-8 rounded-[var(--radius-card)] border border-[var(--nexiora-border)] shadow-xs flex flex-col gap-6">
        <h2 className="text-lg font-bold text-[var(--nexiora-navy)] border-b border-[var(--nexiora-border)] pb-3">
          Personal Information
        </h2>

        {/* Avatar Upload */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-2 border-[var(--nexiora-border)] overflow-hidden bg-[var(--nexiora-off-white)] flex items-center justify-center text-[var(--nexiora-navy)] font-bold text-xl">
              {avatarPreview ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={avatarPreview}
                  alt="Profile Avatar"
                  className="w-full h-full object-cover"
                  onError={() => setAvatarPreview(null)}
                />
              ) : (
                <span>
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </span>
              )}
            </div>
            {isUploadingAvatar && (
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white">
                <Loader2 size={20} className="animate-spin" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => avatarInputRef.current?.click()}
                isLoading={isUploadingAvatar}
              >
                <Upload size={14} className="mr-1.5" /> Upload Photo
              </Button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAvatarFileChange}
                disabled={isUploadingAvatar}
                className="hidden"
              />
            </div>
            <p className="text-xs text-[var(--nexiora-slate-light)]">
              JPEG, PNG, or WebP. Max size 2MB.
            </p>
          </div>
        </div>

        {/* Personal Details Form */}
        <form onSubmit={handleSavePersonal} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              type="text"
              name="firstName"
              value={personalInfo.firstName}
              onChange={(e) =>
                setPersonalInfo((prev) => ({ ...prev, firstName: e.target.value }))
              }
              required
            />

            <Input
              label="Last Name"
              type="text"
              name="lastName"
              value={personalInfo.lastName}
              onChange={(e) =>
                setPersonalInfo((prev) => ({ ...prev, lastName: e.target.value }))
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              value={user?.email ?? ''}
              disabled
              hint="Email address cannot be changed"
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="+91 98765 43210"
              value={personalInfo.phone}
              onChange={(e) =>
                setPersonalInfo((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
          </div>

          <div className="flex justify-end mt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSavingPersonal}
            >
              Save Personal Info
            </Button>
          </div>
        </form>
      </div>

      {/* 2. Candidate Profile & Resume Section (For Candidates) */}
      {user?.role === 'CANDIDATE' && (
        <>
          {/* Resume Upload Box */}
          <div className="bg-white p-8 rounded-[var(--radius-card)] border border-[var(--nexiora-border)] shadow-xs flex flex-col gap-4">
            <h2 className="text-lg font-bold text-[var(--nexiora-navy)] border-b border-[var(--nexiora-border)] pb-3">
              Resume / CV Document
            </h2>

            {candidateProfile.resumeUrl ? (
              <div className="flex items-center justify-between p-4 bg-[var(--nexiora-off-white)] border border-[var(--nexiora-border)] rounded-[var(--radius-btn)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[rgba(46,125,91,0.1)] flex items-center justify-center text-[var(--status-success)] shrink-0">
                    <FileText size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--nexiora-navy)] truncate max-w-md">
                      {candidateProfile.resumeOriginalName || 'Uploaded Resume Document'}
                    </p>
                    <p className="text-xs text-[var(--status-success)] flex items-center gap-1 mt-0.5">
                      <CheckCircle size={12} /> Active Resume Document
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={candidateProfile.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="ghost" size="sm">
                      <Download size={14} className="mr-1" /> View / Download
                    </Button>
                  </a>

                  <div>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => resumeInputRef.current?.click()}
                      isLoading={isUploadingResume}
                    >
                      Replace Resume
                    </Button>
                    <input
                      ref={resumeInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleResumeFileChange}
                      disabled={isUploadingResume}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-[var(--nexiora-border)] rounded-[var(--radius-card)] bg-[var(--nexiora-off-white)] text-center gap-3">
                <FileText size={40} className="text-[var(--nexiora-slate-light)]" />
                <div>
                  <p className="text-sm font-semibold text-[var(--nexiora-navy)]">
                    No resume uploaded yet
                  </p>
                  <p className="text-xs text-[var(--nexiora-slate)] mt-0.5">
                    Upload your PDF or DOCX resume to apply for jobs with a single click.
                  </p>
                </div>

                <div className="mt-1">
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    onClick={() => resumeInputRef.current?.click()}
                    isLoading={isUploadingResume}
                  >
                    <Upload size={16} className="mr-1.5" /> Upload Resume (PDF / DOCX)
                  </Button>
                  <input
                    ref={resumeInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleResumeFileChange}
                    disabled={isUploadingResume}
                    className="hidden"
                  />
                </div>
                <p className="text-[11px] text-[var(--nexiora-slate-light)]">
                  Maximum file size: 5MB
                </p>
              </div>
            )}
          </div>

          {/* Candidate Professional Details Form */}
          <div className="bg-white p-8 rounded-[var(--radius-card)] border border-[var(--nexiora-border)] shadow-xs flex flex-col gap-6">
            <h2 className="text-lg font-bold text-[var(--nexiora-navy)] border-b border-[var(--nexiora-border)] pb-3">
              Professional Profile
            </h2>

            <form onSubmit={handleSaveCandidate} className="flex flex-col gap-4">
              <Input
                label="Professional Headline"
                type="text"
                placeholder="e.g. Senior Full Stack Engineer | React & Node.js Specialist"
                value={candidateProfile.headline}
                onChange={(e) =>
                  setCandidateProfile((prev) => ({ ...prev, headline: e.target.value }))
                }
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Years of Experience"
                  type="number"
                  min={0}
                  max={50}
                  value={candidateProfile.experienceYears}
                  onChange={(e) =>
                    setCandidateProfile((prev) => ({
                      ...prev,
                      experienceYears: Number(e.target.value),
                    }))
                  }
                />

                <Input
                  label="Current Location"
                  type="text"
                  placeholder="e.g. Bengaluru, India"
                  value={candidateProfile.location}
                  onChange={(e) =>
                    setCandidateProfile((prev) => ({ ...prev, location: e.target.value }))
                  }
                />
              </div>

              <TextArea
                label="Professional Summary / Bio"
                rows={4}
                placeholder="Summarize your technical background, key accomplishments, and career interests..."
                value={candidateProfile.bio}
                onChange={(e) =>
                  setCandidateProfile((prev) => ({ ...prev, bio: e.target.value }))
                }
              />

              {/* Skills Tag Input */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[var(--nexiora-navy)]">
                  Technical Skills & Expertise
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Add a skill (e.g. TypeScript, React, PostgreSQL)"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button type="button" variant="secondary" onClick={handleAddSkill}>
                    <Plus size={16} className="mr-1" /> Add Skill
                  </Button>
                </div>

                {/* Skill Pills List */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {candidateProfile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[var(--nexiora-off-white)] border border-[var(--nexiora-border)] text-[var(--nexiora-navy)]"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-[var(--nexiora-slate-light)] hover:text-[var(--status-error)] transition-colors"
                        aria-label={`Remove skill ${skill}`}
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                  {candidateProfile.skills.length === 0 && (
                    <p className="text-xs text-[var(--nexiora-slate-light)] italic">
                      No skills added yet. Add your core technical competencies above.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSavingCandidate}
                >
                  Save Candidate Profile
                </Button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
