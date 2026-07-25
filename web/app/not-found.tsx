import Link from 'next/link';
import { SearchX } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { EmptyState } from '@/components/ui/empty-state';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-24 px-6">
        <div className="text-center">
          <p
            className="text-8xl font-bold text-gold-gradient mb-4"
            style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}
          >
            404
          </p>
          <EmptyState
            icon={<SearchX size={48} strokeWidth={1.5} />}
            heading="Page not found"
            description="The page you are looking for does not exist or has been moved. Let us get you back on track."
            ctaLabel="Back to Home"
            ctaHref="/"
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
