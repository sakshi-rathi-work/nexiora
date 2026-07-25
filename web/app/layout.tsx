import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/ui/toast';
import { AuthProvider } from '@/components/providers/auth-provider';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  display: 'swap',
  axes: ['SOFT', 'WONK'],
});

export const metadata: Metadata = {
  title: {
    default: 'NEXIORA Talent Solutions — Connecting Exceptional Talent with Exceptional Companies',
    template: '%s | NEXIORA Talent Solutions',
  },
  description:
    'NEXIORA Talent Solutions Pvt. Ltd. — a premier staffing and IT consulting agency connecting top talent with leading companies. Permanent Placement, Contract Staffing, Executive Search and more.',
  keywords: [
    'staffing agency',
    'IT consulting',
    'recruitment',
    'talent acquisition',
    'permanent placement',
    'contract staffing',
    'executive search',
    'HR solutions',
    'NEXIORA',
  ],
  openGraph: {
    type: 'website',
    siteName: 'NEXIORA Talent Solutions',
    title: 'NEXIORA Talent Solutions — Connecting Exceptional Talent with Exceptional Companies',
    description:
      'Premier staffing and IT consulting agency. Find your next opportunity or your next great hire.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <ToastProvider>
          <AuthProvider>{children}</AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
