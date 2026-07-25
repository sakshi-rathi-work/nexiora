import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'NEXIORA Talent Solutions Terms of Service.',
  robots: { index: false },
};

export default function TermsPage() {
  return (
    <>
      <section
        className="py-16"
        style={{ background: 'linear-gradient(160deg, var(--nexiora-navy) 0%, var(--nexiora-navy-dark) 100%)' }}
      >
        <div className="container-nexiora">
          <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
          <p className="text-white/60 mt-3">Last updated: [PLACEHOLDER — date pending]</p>
        </div>
      </section>

      <section className="section-padding" aria-label="Terms of service content">
        <div className="container-nexiora">
          <div className="max-w-[720px] mx-auto">
            <div className="bg-[var(--nexiora-off-white)] border border-[var(--nexiora-border)] rounded-[var(--radius-card)] p-8 mb-8">
              <p className="text-sm font-mono text-[var(--nexiora-slate-light)] uppercase tracking-wide mb-3">
                ⚠ Placeholder — Legal copy pending review
              </p>
              <p className="text-[var(--nexiora-slate)] leading-relaxed">
                These Terms of Service are a placeholder. The final, legally-reviewed
                Terms of Service for NEXIORA Talent Solutions Pvt. Ltd. will be
                provided by legal counsel before the platform launches publicly.
                Do not rely on this page as a binding legal document.
              </p>
            </div>

            <div className="text-[var(--nexiora-slate)] text-sm leading-relaxed">
              <h2 className="text-xl font-bold text-[var(--nexiora-navy)] mb-4">
                What this page will cover
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Acceptance of Terms</li>
                <li>Use of the Platform</li>
                <li>User Accounts and Responsibilities</li>
                <li>Job Applications and Candidate Conduct</li>
                <li>Content and Intellectual Property</li>
                <li>Limitation of Liability</li>
                <li>Governing Law (India)</li>
                <li>Changes to Terms</li>
                <li>Contact Information</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
