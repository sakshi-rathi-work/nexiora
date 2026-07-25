import type { Metadata } from 'next';
import Link from 'next/link';
import { Target, Heart, Users, ArrowRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about NEXIORA Talent Solutions — our mission, values, and what drives us to connect exceptional talent with exceptional companies.',
};

const VALUES = [
  {
    icon: <Target size={32} strokeWidth={1.5} />,
    title: 'Precision Matching',
    description:
      'We take time to understand both sides of every placement — the role requirements and the candidate profile — before making an introduction.',
  },
  {
    icon: <Shield size={32} strokeWidth={1.5} />,
    title: 'Trust & Transparency',
    description:
      'Honest communication at every step. We never overpromise and we keep all parties informed throughout the hiring process.',
  },
  {
    icon: <Heart size={32} strokeWidth={1.5} />,
    title: 'Candidate-First',
    description:
      'Candidates are not commodities. We advocate for fair compensation, clear role expectations, and a positive hiring experience.',
  },
  {
    icon: <Users size={32} strokeWidth={1.5} />,
    title: 'Long-Term Partnerships',
    description:
      'We measure success by retention and satisfaction — not just filled seats. Our relationships are built to last.',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Page Header */}
      <section
        className="py-20"
        style={{ background: 'linear-gradient(160deg, var(--nexiora-navy) 0%, var(--nexiora-navy-dark) 100%)' }}
      >
        <div className="container-nexiora">
          <div className="mb-3">
            <Badge variant="gold-dark">About NEXIORA</Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white max-w-2xl leading-tight">
            Who We Are
          </h1>
          <p className="text-white/65 mt-4 max-w-xl text-lg">
            A premium staffing and IT consulting agency — built on the belief that
            the right match changes everything.
          </p>
        </div>
      </section>

      {/* Mission / Story */}
      <section className="section-padding" aria-labelledby="mission-heading">
        <div className="container-nexiora">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="mb-3">
                <Badge variant="gold">Our Mission</Badge>
              </div>
              <h2 id="mission-heading" className="text-3xl font-bold text-[var(--nexiora-navy)] mb-6">
                Connecting Exceptional Talent with Exceptional Companies
              </h2>

              {/* PLACEHOLDER — company story pending business input */}
              <div className="bg-[var(--nexiora-off-white)] border border-[var(--nexiora-border)] rounded-[var(--radius-card)] p-6 mb-6">
                <p className="text-xs font-mono text-[var(--nexiora-slate-light)] mb-2 uppercase tracking-wide">
                  [PLACEHOLDER — Company story pending business input]
                </p>
                <p className="text-[var(--nexiora-slate)] text-sm leading-relaxed">
                  This section will contain the founding story, mission statement, and
                  what makes NEXIORA different. Content to be provided by the business
                  before launch.
                </p>
              </div>

              <Link href="/contact">
                <Button variant="secondary" size="md">
                  Get In Touch <ArrowRight size={16} className="ml-1" />
                </Button>
              </Link>
            </div>

            {/* Stats / credibility panel */}
            <div className="grid grid-cols-2 gap-5">
              {[
                { label: 'Active Job Listings', value: '0', note: 'Growing' },
                { label: 'Partner Companies', value: '0', note: 'Onboarding' },
                { label: 'Registered Candidates', value: '0', note: 'And counting' },
                { label: 'Years of Expertise', value: '[PLACEHOLDER]', note: 'Pending' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="card-base p-6 flex flex-col gap-2"
                >
                  <span
                    className="text-2xl font-bold text-[var(--nexiora-navy)]"
                    style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}
                  >
                    {item.value}
                  </span>
                  <span className="text-sm font-medium text-[var(--nexiora-navy)]">
                    {item.label}
                  </span>
                  <span className="text-xs text-[var(--nexiora-slate-light)]">
                    {item.note}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section
        id="services"
        className="section-padding bg-[var(--nexiora-off-white)]"
        aria-labelledby="services-heading"
      >
        <div className="container-nexiora">
          <div className="text-center mb-12">
            <div className="mb-3 flex justify-center">
              <Badge variant="gold">What We Offer</Badge>
            </div>
            <h2 id="services-heading" className="text-3xl font-bold text-[var(--nexiora-navy)]">
              Our Services
            </h2>
            <p className="text-[var(--nexiora-slate)] mt-3 max-w-lg mx-auto">
              From individual contributor roles to executive search — NEXIORA covers the
              full talent acquisition spectrum.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Permanent Placement', description: 'Direct hire for long-term roles.' },
              { title: 'Contract Staffing', description: 'Skilled professionals for defined project timelines.' },
              { title: 'Contract-to-Hire', description: 'Trial-to-permanent evaluation model.' },
              { title: 'Executive Search', description: 'Confidential senior and C-suite recruitment.' },
              { title: 'IT Consulting', description: 'Technology workforce advisory and augmentation.' },
              { title: 'HR Advisory', description: 'Process improvement and HR function consulting.' },
            ].map((s) => (
              <div key={s.title} className="card-base p-6">
                <h3 className="font-semibold text-[var(--nexiora-navy)] mb-2">{s.title}</h3>
                <p className="text-sm text-[var(--nexiora-slate)]">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding" aria-labelledby="values-heading">
        <div className="container-nexiora">
          <div className="text-center mb-12">
            <div className="mb-3 flex justify-center">
              <Badge variant="gold">What Guides Us</Badge>
            </div>
            <h2 id="values-heading" className="text-3xl font-bold text-[var(--nexiora-navy)]">
              Our Values
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {VALUES.map((value) => (
              <div key={value.title} className="flex gap-5">
                <div className="text-[var(--nexiora-gold-solid)] shrink-0 mt-1">{value.icon}</div>
                <div>
                  <h3 className="font-semibold text-[var(--nexiora-navy)] mb-1">{value.title}</h3>
                  <p className="text-sm text-[var(--nexiora-slate)] leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership — omitted until real team info provided */}
      <section className="section-padding bg-[var(--nexiora-off-white)]" aria-labelledby="team-heading">
        <div className="container-nexiora text-center">
          <h2 id="team-heading" className="text-3xl font-bold text-[var(--nexiora-navy)] mb-4">
            Our Team
          </h2>
          <div className="bg-white border border-[var(--nexiora-border)] rounded-[var(--radius-card)] p-8 max-w-xl mx-auto">
            <p className="text-xs font-mono text-[var(--nexiora-slate-light)] mb-3 uppercase tracking-wide">
              [PLACEHOLDER — Team profiles pending]
            </p>
            <p className="text-[var(--nexiora-slate)] text-sm leading-relaxed">
              Leadership and team member profiles will be added once information is
              confirmed with the business. We do not publish team details without
              verified, real information.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding" aria-label="Call to action">
        <div className="container-nexiora text-center">
          <h2 className="text-3xl font-bold text-[var(--nexiora-navy)] mb-4">
            Ready to work with us?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            <Link href="/jobs">
              <Button variant="primary" size="lg">Browse Jobs</Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary" size="lg">Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
