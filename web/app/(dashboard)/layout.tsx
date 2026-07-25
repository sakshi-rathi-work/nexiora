import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your NEXIORA candidate and application dashboard.',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[var(--nexiora-off-white)] py-10">
        <div className="container-nexiora">{children}</div>
      </main>
      <Footer />
    </>
  );
}
