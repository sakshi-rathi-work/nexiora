'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, User as UserIcon, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuthStore } from '@/lib/auth-store';
import { apiClient } from '@/lib/api-client';
import { Button } from '../ui/button';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/jobs', label: 'Jobs' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const { user, isAuthenticated, clearAuth } = useAuthStore();

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobile = () => setIsMobileOpen(false);

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    } finally {
      clearAuth();
      setIsDropdownOpen(false);
      router.push('/login');
    }
  };

  return (
    <header
      className={clsx(
        'sticky top-0 z-40 w-full bg-white transition-shadow duration-200',
        isScrolled ? 'shadow-sm border-b border-[var(--nexiora-border)]' : '',
      )}
    >
      <div className="container-nexiora">
        <nav
          className="flex items-center justify-between h-16"
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link href="/" className="shrink-0" onClick={closeMobile}>
            <Image
              src="/assets/nexiora-logo.png"
              alt="NEXIORA Talent Solutions"
              width={150}
              height={45}
              priority
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop nav links */}
          <ul
            className="hidden md:flex items-center gap-8 list-none m-0 p-0"
            role="list"
          >
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-[var(--nexiora-slate)] hover:text-[var(--nexiora-navy)] transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gold-gradient group-hover:w-full transition-all duration-200" />
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA / User Dropdown */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 p-1.5 pl-3 rounded-full border border-[var(--nexiora-border)] hover:border-[var(--nexiora-navy)] transition-colors text-sm font-medium text-[var(--nexiora-navy)] bg-[var(--nexiora-off-white)]"
                >
                  <span className="w-7 h-7 rounded-full bg-[var(--nexiora-navy)] text-white flex items-center justify-center text-xs font-bold overflow-hidden shrink-0">
                    {user.avatarUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={`http://localhost:4000${user.avatarUrl}`}
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </>
                    )}
                  </span>
                  <span>{user.firstName}</span>
                  <ChevronDown size={16} className="text-[var(--nexiora-slate)]" />
                </button>

                {/* User Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-[var(--radius-card)] shadow-xl border border-[var(--nexiora-border)] py-2 z-50">
                    <div className="px-4 py-2 border-b border-[var(--nexiora-border)]">
                      <p className="text-xs font-semibold text-[var(--nexiora-navy)] truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-[10px] text-[var(--nexiora-slate-light)] truncate">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-[var(--nexiora-slate)] hover:bg-[var(--nexiora-off-white)] hover:text-[var(--nexiora-navy)]"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <LayoutDashboard size={14} />
                      Dashboard
                    </Link>

                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-[var(--nexiora-slate)] hover:bg-[var(--nexiora-off-white)] hover:text-[var(--nexiora-navy)]"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <UserIcon size={14} />
                      My Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-[var(--status-error)] hover:bg-[rgba(184,66,46,0.05)] text-left border-t border-[var(--nexiora-border)] mt-1"
                    >
                      <LogOut size={14} />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-[var(--nexiora-navy)] rounded-md"
            onClick={() => setIsMobileOpen((v) => !v)}
            aria-label={isMobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-menu"
          >
            {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      {isMobileOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-[var(--nexiora-border)] bg-white"
        >
          <div className="container-nexiora py-4 flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[var(--nexiora-navy)] py-2.5 border-b border-[var(--nexiora-border)] last:border-0 hover:text-[var(--nexiora-gold-solid)] transition-colors"
                onClick={closeMobile}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated && user ? (
              <div className="pt-3 flex flex-col gap-2 border-t border-[var(--nexiora-border)] mt-2">
                <p className="text-xs font-semibold text-[var(--nexiora-navy)] px-1">
                  Signed in as {user.firstName} {user.lastName}
                </p>
                <Link href="/dashboard" onClick={closeMobile}>
                  <Button variant="secondary" size="md" className="w-full">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => {
                    closeMobile();
                    handleLogout();
                  }}
                  className="w-full text-[var(--status-error)]"
                >
                  Log Out
                </Button>
              </div>
            ) : (
              <div className="flex gap-3 pt-3">
                <Link href="/login" className="flex-1" onClick={closeMobile}>
                  <Button variant="ghost" size="md" className="w-full">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup" className="flex-1" onClick={closeMobile}>
                  <Button variant="primary" size="md" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
