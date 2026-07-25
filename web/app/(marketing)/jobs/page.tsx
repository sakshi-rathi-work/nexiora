'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Search,
  MapPin,
  Briefcase,
  Building2,
  Filter,
  X,
  ChevronRight,
  Loader2,
  IndianRupee,
  Calendar,
  DollarSign,
  Clock,
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';
import { EmptyState } from '@/components/ui/empty-state';

interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  industry?: string;
  website?: string;
}

interface Job {
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
}

const EMPLOYMENT_TYPES = [
  { value: 'FULL_TIME', label: 'Full-Time' },
  { value: 'PART_TIME', label: 'Part-Time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'INTERNSHIP', label: 'Internship' },
];

const EXPERIENCE_LEVELS = [
  { value: 'ENTRY', label: 'Entry Level (0-2 yrs)' },
  { value: 'MID', label: 'Mid Level (2-5 yrs)' },
  { value: 'SENIOR', label: 'Senior Level (5+ yrs)' },
  { value: 'LEAD', label: 'Lead / Executive' },
];

const SALARY_RANGES = [
  { value: '0', label: 'All Salary Ranges' },
  { value: '1000000', label: '₹10 Lakhs+ / year' },
  { value: '2000000', label: '₹20 Lakhs+ / year' },
  { value: '3000000', label: '₹30 Lakhs+ / year' },
];

const DATE_POSTED_OPTIONS = [
  { value: '', label: 'Anytime' },
  { value: '24h', label: 'Past 24 Hours' },
  { value: '7d', label: 'Past 7 Days' },
  { value: '30d', label: 'Past 30 Days' },
];

export default function JobsPage() {
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [meta, setMeta] = React.useState({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
  });

  // Filter States
  const [searchQuery, setSearchQuery] = React.useState('');
  const [locationQuery, setLocationQuery] = React.useState('');
  const [selectedEmploymentTypes, setSelectedEmploymentTypes] = React.useState<string[]>([]);
  const [selectedExperienceLevels, setSelectedExperienceLevels] = React.useState<string[]>([]);
  const [selectedMinSalary, setSelectedMinSalary] = React.useState<string>('0');
  const [selectedDatePosted, setSelectedDatePosted] = React.useState<string>('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);

  // Fetch jobs with active filter set
  const fetchJobs = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (locationQuery) params.append('location', locationQuery);
      if (selectedEmploymentTypes.length > 0) {
        params.append('employmentType', selectedEmploymentTypes.join(','));
      }
      if (selectedExperienceLevels.length > 0) {
        params.append('experienceLevel', selectedExperienceLevels.join(','));
      }
      if (selectedMinSalary && selectedMinSalary !== '0') {
        params.append('minSalary', selectedMinSalary);
      }
      if (selectedDatePosted) {
        params.append('datePosted', selectedDatePosted);
      }
      params.append('page', String(currentPage));
      params.append('limit', '12');

      const { data } = await apiClient.get(`/jobs?${params.toString()}`);
      setJobs(data.jobs ?? []);
      setMeta(data.meta ?? { total: 0, page: 1, limit: 12, totalPages: 1 });
    } catch {
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  }, [
    searchQuery,
    locationQuery,
    selectedEmploymentTypes,
    selectedExperienceLevels,
    selectedMinSalary,
    selectedDatePosted,
    currentPage,
  ]);

  React.useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchJobs();
  };

  const toggleEmploymentType = (type: string) => {
    setSelectedEmploymentTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
    setCurrentPage(1);
  };

  const toggleExperienceLevel = (level: string) => {
    setSelectedExperienceLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level],
    );
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setLocationQuery('');
    setSelectedEmploymentTypes([]);
    setSelectedExperienceLevels([]);
    setSelectedMinSalary('0');
    setSelectedDatePosted('');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery ||
    locationQuery ||
    selectedEmploymentTypes.length > 0 ||
    selectedExperienceLevels.length > 0 ||
    selectedMinSalary !== '0' ||
    selectedDatePosted !== '';

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

  return (
    <div className="min-h-screen bg-[var(--nexiora-off-white)] pb-16">
      {/* 1. Header Banner - Deep Navy Blue Background */}
      <section className="bg-[var(--nexiora-navy)] text-white pt-12 pb-16 px-4 border-b border-[rgba(255,255,255,0.1)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(ellipse_at_top_right,rgba(235,180,52,0.15),transparent_70%)] pointer-events-none" />
        
        <div className="container-nexiora flex flex-col gap-6 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-[var(--nexiora-gold-solid)] bg-[rgba(235,180,52,0.15)] px-3 py-1 rounded-full mb-3 border border-[rgba(235,180,52,0.3)]">
              Talent Marketplace
            </span>
            <h1
              className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight"
              style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}
            >
              Find Your Next High-Impact Role
            </h1>
            <p className="text-base md:text-lg text-[rgba(255,255,255,0.85)] font-normal leading-relaxed">
              Discover curated tech, design, product, and leadership positions at leading companies.
            </p>
          </div>

          {/* Integrated Search Bar inside Navy Banner */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-4 bg-white p-3 rounded-[var(--radius-card)] shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-3 border border-[rgba(255,255,255,0.2)]"
          >
            <div className="md:col-span-5 flex items-center">
              <Input
                placeholder="Search job title, skills, or keyword…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search size={18} />}
                className="border-0 bg-transparent focus:ring-0 text-[var(--nexiora-navy)] placeholder:text-[var(--nexiora-slate-light)]"
              />
            </div>

            <div className="md:col-span-4 flex items-center border-t md:border-t-0 md:border-l border-[var(--nexiora-border)] md:pl-3 pt-2 md:pt-0">
              <Input
                placeholder="City or Remote location…"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                leftIcon={<MapPin size={18} />}
                className="border-0 bg-transparent focus:ring-0 text-[var(--nexiora-navy)] placeholder:text-[var(--nexiora-slate-light)]"
              />
            </div>

            <div className="md:col-span-3 flex items-center justify-end">
              <Button type="submit" variant="primary" size="md" className="w-full h-11 text-sm font-semibold">
                Search Jobs
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* 2. Main Page Content (Sidebar Filters + Square Job Cards Grid) */}
      <div className="container-nexiora mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Checkbox Filter Sidebar */}
          <aside className="lg:col-span-3 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-[var(--radius-card)] border border-[var(--nexiora-border)] shadow-xs flex flex-col gap-6 sticky top-20">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[var(--nexiora-border)] pb-4">
                <div className="flex items-center gap-2 font-bold text-[var(--nexiora-navy)] text-base">
                  <Filter size={18} />
                  <span>Filter Jobs</span>
                </div>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="text-xs font-semibold text-[var(--status-error)] hover:underline flex items-center gap-1"
                  >
                    <X size={14} /> Clear All
                  </button>
                )}
              </div>

              {/* 1. Employment Type (Checkboxes) */}
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--nexiora-navy)]">
                  Job Type
                </h3>
                <div className="flex flex-col gap-2">
                  {EMPLOYMENT_TYPES.map((type) => {
                    const isChecked = selectedEmploymentTypes.includes(type.value);
                    return (
                      <label
                        key={type.value}
                        className="flex items-center gap-2.5 text-xs text-[var(--nexiora-navy)] font-medium cursor-pointer hover:text-[var(--nexiora-gold-solid)] transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleEmploymentType(type.value)}
                          className="w-4 h-4 rounded border-[var(--nexiora-border)] text-[var(--nexiora-navy)] focus:ring-[var(--nexiora-navy)] cursor-pointer"
                        />
                        <span>{type.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 2. Experience Level (Checkboxes) */}
              <div className="flex flex-col gap-3 border-t border-[var(--nexiora-border)] pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--nexiora-navy)]">
                  Experience Level
                </h3>
                <div className="flex flex-col gap-2">
                  {EXPERIENCE_LEVELS.map((level) => {
                    const isChecked = selectedExperienceLevels.includes(level.value);
                    return (
                      <label
                        key={level.value}
                        className="flex items-center gap-2.5 text-xs text-[var(--nexiora-navy)] font-medium cursor-pointer hover:text-[var(--nexiora-gold-solid)] transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleExperienceLevel(level.value)}
                          className="w-4 h-4 rounded border-[var(--nexiora-border)] text-[var(--nexiora-navy)] focus:ring-[var(--nexiora-navy)] cursor-pointer"
                        />
                        <span>{level.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 3. Salary Filter (Radio/Check Options) */}
              <div className="flex flex-col gap-3 border-t border-[var(--nexiora-border)] pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--nexiora-navy)] flex items-center gap-1">
                  <IndianRupee size={12} /> Minimum Salary
                </h3>
                <div className="flex flex-col gap-2">
                  {SALARY_RANGES.map((range) => {
                    const isSelected = selectedMinSalary === range.value;
                    return (
                      <label
                        key={range.value}
                        className="flex items-center gap-2.5 text-xs text-[var(--nexiora-navy)] font-medium cursor-pointer hover:text-[var(--nexiora-gold-solid)] transition-colors"
                      >
                        <input
                          type="radio"
                          name="minSalary"
                          checked={isSelected}
                          onChange={() => {
                            setSelectedMinSalary(range.value);
                            setCurrentPage(1);
                          }}
                          className="w-4 h-4 border-[var(--nexiora-border)] text-[var(--nexiora-navy)] focus:ring-[var(--nexiora-navy)] cursor-pointer"
                        />
                        <span>{range.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 4. Date Posted Filter */}
              <div className="flex flex-col gap-3 border-t border-[var(--nexiora-border)] pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--nexiora-navy)] flex items-center gap-1">
                  <Clock size={12} /> Date Posted
                </h3>
                <div className="flex flex-col gap-2">
                  {DATE_POSTED_OPTIONS.map((opt) => {
                    const isSelected = selectedDatePosted === opt.value;
                    return (
                      <label
                        key={opt.value}
                        className="flex items-center gap-2.5 text-xs text-[var(--nexiora-navy)] font-medium cursor-pointer hover:text-[var(--nexiora-gold-solid)] transition-colors"
                      >
                        <input
                          type="radio"
                          name="datePosted"
                          checked={isSelected}
                          onChange={() => {
                            setSelectedDatePosted(opt.value);
                            setCurrentPage(1);
                          }}
                          className="w-4 h-4 border-[var(--nexiora-border)] text-[var(--nexiora-navy)] focus:ring-[var(--nexiora-navy)] cursor-pointer"
                        />
                        <span>{opt.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* Right Main Grid (Square Cards Side by Side) */}
          <main className="lg:col-span-9 flex flex-col gap-6">
            {/* Header Status Line */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[var(--nexiora-navy)]">
                Showing{' '}
                <span className="text-[var(--nexiora-navy)] font-bold">{meta.total}</span>{' '}
                {meta.total === 1 ? 'job opening' : 'job openings'}
              </p>
            </div>

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[var(--radius-card)] border border-[var(--nexiora-border)] gap-3">
                <Loader2 size={36} className="animate-spin text-[var(--nexiora-navy)]" />
                <p className="text-sm font-medium text-[var(--nexiora-slate)]">
                  Fetching open job opportunities…
                </p>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && jobs.length === 0 && (
              <div className="bg-white p-8 rounded-[var(--radius-card)] border border-[var(--nexiora-border)]">
                <EmptyState
                  icon={<Briefcase size={48} strokeWidth={1.5} />}
                  heading="No matching jobs found"
                  description="Try unchecking some filter options or clearing your search keywords to view available positions."
                  ctaLabel="Clear All Filters"
                  ctaHref="#"
                  onCtaClick={handleClearFilters}
                />
              </div>
            )}

            {/* Square Job Cards Grid (Side by Side 3 Columns) */}
            {!isLoading && jobs.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white p-6 rounded-[var(--radius-card)] border border-[var(--nexiora-border)] shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between h-full gap-5 group"
                  >
                    {/* Top Section */}
                    <div className="flex flex-col gap-4">
                      {/* Company Badge Header */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[var(--nexiora-off-white)] border border-[var(--nexiora-border)] flex items-center justify-center font-bold text-lg text-[var(--nexiora-navy)] shrink-0">
                          {job.company.name?.[0]}
                        </div>
                        <Badge variant="navy">{formatBadgeLabel(job.employmentType)}</Badge>
                      </div>

                      {/* Job Title & Company */}
                      <div>
                        <h2 className="text-base font-bold text-[var(--nexiora-navy)] group-hover:text-[var(--nexiora-gold-solid)] transition-colors line-clamp-2">
                          <Link href={`/jobs/${job.slug || job.id}`}>{job.title}</Link>
                        </h2>
                        <p className="text-xs font-medium text-[var(--nexiora-slate)] mt-1 flex items-center gap-1">
                          <Building2 size={13} className="text-[var(--nexiora-slate-light)]" />
                          {job.company.name}
                        </p>
                      </div>

                      {/* Location & Salary Info */}
                      <div className="flex flex-col gap-1.5 text-xs text-[var(--nexiora-slate)] pt-2 border-t border-[var(--nexiora-border)]">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-[var(--nexiora-slate-light)] shrink-0" />
                          <span className="truncate">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-semibold text-[var(--status-success)]">
                          <IndianRupee size={14} className="shrink-0" />
                          <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
                        </div>
                      </div>

                      {/* Skill Tag Pills */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge variant="gold">{formatBadgeLabel(job.experienceLevel)}</Badge>
                        {job.skills.slice(0, 2).map((skill) => (
                          <span
                            key={skill}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--nexiora-off-white)] border border-[var(--nexiora-border)] text-[var(--nexiora-slate)]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Card Footer CTA */}
                    <div className="pt-3 border-t border-[var(--nexiora-border)] flex items-center justify-between gap-2 mt-auto">
                      <span className="text-[11px] text-[var(--nexiora-slate-light)]">
                        Active Opening
                      </span>
                      <Link href={`/jobs/${job.slug || job.id}`}>
                        <Button variant="secondary" size="sm" className="text-xs">
                          View Details <ChevronRight size={14} className="ml-0.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {!isLoading && meta.totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination
                  currentPage={meta.page}
                  totalPages={meta.totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
