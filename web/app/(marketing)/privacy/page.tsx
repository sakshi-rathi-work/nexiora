import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'NEXIORA Talent Solutions Privacy Policy — how we collect, use, and protect your personal information.',
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <>
      <section
        className="py-16"
        style={{ background: 'linear-gradient(160deg, var(--nexiora-navy) 0%, var(--nexiora-navy-dark) 100%)' }}
      >
        <div className="container-nexiora">
          <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
          <p className="text-white/60 mt-3">Last updated: [PLACEHOLDER — date pending]</p>
        </div>
      </section>

      <section className="section-padding" aria-label="Privacy policy content">
        <div className="container-nexiora">
          <div className="max-w-[720px] mx-auto">
            <div className="bg-[var(--nexiora-off-white)] border border-[var(--nexiora-border)] rounded-[var(--radius-card)] p-8 mb-8">
              <p className="text-sm font-mono text-[var(--nexiora-slate-light)] uppercase tracking-wide mb-3">
                ⚠ Placeholder — Legal copy pending review
              </p>
              <p className="text-[var(--nexiora-slate)] leading-relaxed">
                This Privacy Policy is a placeholder. The final, legally-reviewed
                Privacy Policy for NEXIORA Talent Solutions Pvt. Ltd. will be
                provided by legal counsel before the platform launches publicly.
                Do not rely on this page as a binding legal document.
              </p>
            </div>

            <div className="prose prose-slate max-w-none text-[var(--nexiora-slate)]">
              <h2 className="text-xl font-bold text-[var(--nexiora-navy)] mb-4">
                What this page will cover
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
                <li>What personal data we collect (name, email, resume, usage data)</li>
                <li>How we use your data (job matching, account management, communications)</li>
                <li>How we store and protect your data</li>
                <li>Your rights under applicable privacy law (DPDP Act, India)</li>
                <li>Cookie policy</li>
                <li>How to contact us about privacy concerns</li>
                <li>Retention periods</li>
                <li>Third-party services we use</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
