import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mail } from 'lucide-react';

const jobSeekerLinks = [
  { href: '/jobs', label: 'Browse Jobs' },
  { href: '/signup', label: 'Create Account' },
  { href: '/login', label: 'Sign In' },
];

const companyLinks = [
  { href: '/contact', label: 'Contact Us' },
  { href: '/about#services', label: 'Our Services' },
  // Phase 2 items — visually grayed
  { href: '#', label: 'Post a Job (Coming Soon)', disabled: true },
];

const companyInfoLinks = [
  { href: '/about', label: 'About NEXIORA' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="bg-[var(--nexiora-navy-dark)] text-white"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="container-nexiora py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1 flex flex-col gap-5">
            <Link href="/">
              <Image
                src="/assets/nexiora-logo.png"
                alt="NEXIORA Talent Solutions"
                width={140}
                height={42}
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-white/70 leading-relaxed max-w-xs">
              Connecting exceptional talent with exceptional companies. Premium
              staffing and IT consulting across India.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="NEXIORA on LinkedIn"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 hover:bg-[var(--nexiora-gold-solid)] transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.78a1.68 1.68 0 1 0 0 3.36 1.68 1.68 0 0 0 0-3.36Z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="NEXIORA on X"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 hover:bg-[var(--nexiora-gold-solid)] transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="mailto:info@nexiora.in"
                aria-label="Email NEXIORA"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 hover:bg-[var(--nexiora-gold-solid)] transition-colors"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* For Job Seekers */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-widest" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
              For Job Seekers
            </h3>
            <ul className="flex flex-col gap-2 list-none m-0 p-0">
              {jobSeekerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-[var(--nexiora-gold-end)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Employers */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-widest" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
              For Employers
            </h3>
            <ul className="flex flex-col gap-2 list-none m-0 p-0">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  {link.disabled ? (
                    <span className="text-sm text-white/30 cursor-not-allowed">
                      {link.label}
                    </span>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 hover:text-[var(--nexiora-gold-end)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-widest" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
              Company
            </h3>
            <ul className="flex flex-col gap-2 list-none m-0 p-0">
              {companyInfoLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-[var(--nexiora-gold-end)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/50">
            © {year} NEXIORA Talent Solutions Pvt. Ltd. All rights reserved.
          </p>
          <p className="text-xs text-white/40">
            Connecting Exceptional Talent with Exceptional Companies.
          </p>
        </div>
      </div>
    </footer>
  );
}
