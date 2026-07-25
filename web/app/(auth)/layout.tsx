import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Access your NEXIORA account or create a new account.',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8"
      style={{
        background:
          'radial-gradient(ellipse at top, var(--nexiora-navy) 0%, var(--nexiora-navy-dark) 100%)',
      }}
    >
      {/* Top Header */}
      <div className="flex justify-center">
        <Link href="/">
          <Image
            src="/assets/nexiora-logo.png"
            alt="NEXIORA Talent Solutions"
            width={160}
            height={48}
            priority
            className="h-11 w-auto object-contain brightness-0 invert"
          />
        </Link>
      </div>

      {/* Main Card */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md my-8">
        <div className="bg-white py-10 px-6 sm:px-10 shadow-2xl rounded-[var(--radius-card)] border border-[var(--nexiora-border)]">
          {children}
        </div>
      </div>

      {/* Footer copyright */}
      <div className="text-center text-xs text-white/40">
        © {new Date().getFullYear()} NEXIORA Talent Solutions Pvt. Ltd. All rights reserved.
      </div>
    </div>
  );
}
