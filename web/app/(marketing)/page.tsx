import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Search,
  Briefcase,
  Users,
  Award,
  CheckCircle,
  ArrowRight,
  UserPlus,
  FileText,
  Send,
  Star,
  Building2,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Connecting Exceptional Talent with Exceptional Companies',
  description:
    'NEXIORA Talent Solutions — premier staffing and IT consulting. Permanent Placement, Contract Staffing, Executive Search and more. Find your next opportunity today.',
};

// --- Service Cards (static, safe per spec - describes platform mechanics) ---
const SERVICES = [
  {
    icon: <Briefcase size={32} strokeWidth={1.5} />,
    title: 'Permanent Placement',
    description:
      'Full-time direct hire placements matched to your role requirements and culture.',
  },
  {
    icon: <Clock size={32} strokeWidth={1.5} />,
    title: 'Contract Staffing',
    description:
      'Skilled professionals for project-based or short-to-mid term engagements.',
  },
  {
    icon: <ArrowRight size={32} strokeWidth={1.5} />,
    title: 'Contract-to-Hire',
    description:
      'Evaluate candidates on the job before converting to permanent employment.',
  },
  {
    icon: <Star size={32} strokeWidth={1.5} />,
    title: 'Executive Search',
    description:
      'Senior and C-suite talent acquisition with a confidential, retained approach.',
  },
  {
    icon: <Award size={32} strokeWidth={1.5} />,
    title: 'IT & HR Consulting',
    description:
      'Advisory services for IT workforce planning and HR process optimisation.',
  },
];

// --- How It Works steps (static — describes platform mechanics, not unverified claims) ---
const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Create Your Account',
    description: 'Sign up in minutes. No lengthy forms — just the essentials to get started.',
    icon: <UserPlus size={24} strokeWidth={1.5} />,
  },
  {
    step: '02',
    title: 'Search & Filter Roles',
    description: 'Browse curated job listings filtered by location, type, and experience level.',
    icon: <Search size={24} strokeWidth={1.5} />,
  },
  {
    step: '03',
    title: 'Apply With Ease',
    description: 'One-click apply using your uploaded resume. Add a cover letter if you wish.',
    icon: <Send size={24} strokeWidth={1.5} />,
  },
  {
    step: '04',
    title: 'Get Hired',
    description: 'Track your application status in real time from your personal dashboard.',
    icon: <FileText size={24} strokeWidth={1.5} />,
  },
];

// --- Value Props (truthful, tied to what is actually built) ---
const VALUE_PROPS = [
  {
    icon: <CheckCircle size={40} strokeWidth={1.5} />,
    title: 'Verified Job Postings',
    description:
      'Every listing is placed by a vetted recruiter. No ghost jobs — only real opportunities from real hiring mandates.',
  },
  {
    icon: <FileText size={40} strokeWidth={1.5} />,
    title: 'Direct Application Tracking',
    description:
      'Your personal dashboard shows every application status in real time — no chasing emails.',
  },
  {
    icon: <Users size={40} strokeWidth={1.5} />,
    title: 'Dedicated Recruiter Support',
    description:
      'Our team reviews every application personally. You are a candidate, not a keyword.',
  },
];

export default function LandingPage() {
  return (
    <>
      {/* ===================================================
          HERO SECTION
          =================================================== */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, var(--nexiora-navy) 0%, var(--nexiora-navy-dark) 100%)' }}
      >
        {/* Decorative gold accent */}
        <div
          className="absolute top-0 right-0 w-96 h-96 opacity-10 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'var(--nexiora-gold-end)', transform: 'translate(30%, -30%)' }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 opacity-5 rounded-full blur-2xl pointer-events-none"
          style={{ background: 'var(--nexiora-gold-start)', transform: 'translate(-30%, 30%)' }}
          aria-hidden="true"
        />

        <div className="container-nexiora section-padding relative z-10">
          <div className="max-w-3xl">
            <div className="mb-4">
              <Badge variant="gold-dark">NEXIORA Talent Solutions</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}>
              Connecting{' '}
              <span className="text-gold-gradient">Exceptional Talent</span>{' '}
              with Exceptional Companies.
            </h1>
            <p className="text-lg text-white/75 mb-10 max-w-xl leading-relaxed">
              Premium staffing and IT consulting — permanent placement, contract
              staffing, executive search, and more.
            </p>

            {/* Search bar */}
            <form
              action="/jobs"
              method="GET"
              className="flex flex-col sm:flex-row gap-3 max-w-xl"
              role="search"
              aria-label="Job search"
            >
              <div className="flex-1 relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--nexiora-slate-light)] pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  name="search"
                  placeholder="Role, skill, or keyword"
                  aria-label="Search by role, skill, or keyword"
                  className="w-full h-12 pl-10 pr-4 bg-white text-[var(--nexiora-navy)] text-sm rounded-[var(--radius-btn)] border-0 focus:outline-2 focus:outline-[var(--nexiora-gold-solid)] focus:outline-offset-0 placeholder:text-[var(--nexiora-slate-light)]"
                />
              </div>
              <Link href="/jobs">
                <Button variant="primary" size="lg" className="w-full sm:w-auto h-12">
                  Search Jobs
                </Button>
              </Link>
            </form>

            {/* Live stats row — real values, currently 0 at launch */}
            <div className="flex flex-wrap gap-8 mt-10">
              {[
                { label: 'Active Jobs', value: '0' },
                { label: 'Partner Companies', value: '0' },
                { label: 'Candidates Registered', value: '0' },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col gap-0.5">
                  <span
                    className="text-2xl font-bold text-white"
                    style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}
                  >
                    {stat.value}
                  </span>
                  <span className="text-xs text-white/55 font-medium">{stat.label}</span>
                </div>
              ))}
              <div className="flex flex-col gap-0.5 justify-center">
                <span className="text-xs text-white/40 italic">
                  New platform — be among the first
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          SERVICES GRID
          =================================================== */}
      <section className="section-padding bg-[var(--nexiora-off-white)]" aria-label="Our services">
        <div className="container-nexiora">
          <div className="text-center mb-12">
            <div className="mb-3 flex justify-center">
              <Badge variant="gold">What We Do</Badge>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--nexiora-navy)]">
              Our Staffing Services
            </h2>
            <p className="text-[var(--nexiora-slate)] mt-3 max-w-xl mx-auto">
              From permanent placements to executive search — we match the right talent
              to the right opportunity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="card-base p-6 flex flex-col gap-4 group"
              >
                <div className="text-[var(--nexiora-gold-solid)] group-hover:scale-110 transition-transform duration-200">
                  {service.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--nexiora-navy)] mb-1 text-base">
                    {service.title}
                  </h3>
                  <p className="text-sm text-[var(--nexiora-slate)] leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/about">
              <Button variant="secondary" size="md">
                Learn More About Us <ArrowRight size={16} className="ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===================================================
          FEATURED JOBS
          =================================================== */}
      <section className="section-padding" aria-label="Featured job listings">
        <div className="container-nexiora">
          <div className="text-center mb-12">
            <div className="mb-3 flex justify-center">
              <Badge variant="gold">Latest Openings</Badge>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--nexiora-navy)]">
              Featured Jobs
            </h2>
          </div>

          {/* EmptyState — will be replaced with live API data in M5 */}
          <EmptyState
            icon={<Briefcase size={48} strokeWidth={1.5} />}
            heading="No open roles right now"
            description="New positions are posted as clients confirm hiring needs. Check back soon — or register to be notified."
            ctaLabel="Browse All Jobs"
            ctaHref="/jobs"
          />
        </div>
      </section>

      {/* ===================================================
          HIRING COMPANIES
          =================================================== */}
      <section className="section-padding bg-[var(--nexiora-off-white)]" aria-label="Partner companies">
        <div className="container-nexiora">
          <div className="text-center mb-12">
            <div className="mb-3 flex justify-center">
              <Badge variant="gold">Our Partners</Badge>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--nexiora-navy)]">
              Hiring Companies
            </h2>
          </div>

          {/* EmptyState — will be replaced with live API data in M5 */}
          <EmptyState
            icon={<Building2 size={48} strokeWidth={1.5} />}
            heading="Partner companies coming soon"
            description="We are onboarding our first hiring partners. Interested in staffing your team? Get in touch."
            ctaLabel="Contact Us"
            ctaHref="/contact"
          />
        </div>
      </section>

      {/* ===================================================
          HOW IT WORKS
          =================================================== */}
      <section className="section-padding" aria-label="How NEXIORA works">
        <div className="container-nexiora">
          <div className="text-center mb-14">
            <div className="mb-3 flex justify-center">
              <Badge variant="gold">Simple Process</Badge>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--nexiora-navy)]">
              How It Works
            </h2>
            <p className="text-[var(--nexiora-slate)] mt-3 max-w-xl mx-auto">
              From registration to hired — four steps to your next opportunity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((step, idx) => (
              <div key={step.step} className="flex flex-col items-center text-center gap-4 relative">
                {/* Connector line */}
                {idx < HOW_IT_WORKS.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-8 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] h-0.5"
                    style={{ background: 'var(--nexiora-border)' }}
                    aria-hidden="true"
                  />
                )}

                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center relative z-10"
                  style={{ background: 'linear-gradient(135deg, var(--nexiora-gold-start), var(--nexiora-gold-end))' }}
                >
                  <span className="text-[var(--nexiora-navy)]">{step.icon}</span>
                </div>

                <div>
                  <p className="text-xs font-bold text-[var(--nexiora-gold-solid)] mb-1">{step.step}</p>
                  <h3 className="font-semibold text-[var(--nexiora-navy)] mb-1">{step.title}</h3>
                  <p className="text-sm text-[var(--nexiora-slate)]">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          WHY NEXIORA (Value Props)
          =================================================== */}
      <section className="section-padding bg-[var(--nexiora-navy)]" aria-label="Why choose NEXIORA">
        <div className="container-nexiora">
          <div className="text-center mb-14">
            <div className="mb-3 flex justify-center">
              <Badge variant="gold-dark">Why NEXIORA</Badge>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              A Better Way to Hire and Get Hired
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {VALUE_PROPS.map((prop) => (
              <div
                key={prop.title}
                className="flex flex-col gap-4 p-8 rounded-[var(--radius-card)] border border-white/10 bg-white/5 backdrop-blur-sm"
              >
                <div className="text-[var(--nexiora-gold-solid)]">{prop.icon}</div>
                <h3 className="text-xl font-semibold text-white">{prop.title}</h3>
                <p className="text-sm text-white/65 leading-relaxed">{prop.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          TESTIMONIALS
          =================================================== */}
      <section className="section-padding bg-[var(--nexiora-off-white)]" aria-label="Testimonials">
        <div className="container-nexiora">
          <div className="text-center mb-12">
            <div className="mb-3 flex justify-center">
              <Badge variant="gold">What People Say</Badge>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--nexiora-navy)]">
              Testimonials
            </h2>
          </div>

          {/* EmptyState — will be replaced with live API data in M7 */}
          <EmptyState
            icon={<Star size={48} strokeWidth={1.5} />}
            heading="No testimonials yet"
            description="We are just getting started. Testimonials from our candidates and clients will appear here as we grow."
          />
        </div>
      </section>

      {/* ===================================================
          CLOSING CTA
          =================================================== */}
      <section className="section-padding" aria-label="Call to action">
        <div className="container-nexiora text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--nexiora-navy)] mb-4">
            Ready to Take the Next Step?
          </h2>
          <p className="text-[var(--nexiora-slate)] mb-8 max-w-lg mx-auto">
            Whether you are looking for your next role or your next great hire — NEXIORA is here to help.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/jobs">
              <Button variant="primary" size="lg">
                Browse Jobs <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary" size="lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===================================================
          CONTACT TEASER
          =================================================== */}
      <section
        className="py-16"
        style={{ background: 'linear-gradient(135deg, var(--nexiora-navy-dark) 0%, var(--nexiora-navy) 100%)' }}
        aria-label="Contact information"
      >
        <div className="container-nexiora flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Looking to hire top talent?
            </h2>
            <p className="text-white/65 max-w-md">
              Get in touch with our team to discuss your staffing requirements.
              We respond within one business day.
            </p>
          </div>
          <Link href="/contact" className="shrink-0">
            <Button variant="primary" size="lg">
              Get In Touch <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
