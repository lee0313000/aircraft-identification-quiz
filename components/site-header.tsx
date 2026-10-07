'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Plane, ShieldCheck, Trophy } from 'lucide-react';
import { useApp } from '@/components/app-provider';

export function SiteHeader() {
  const pathname = usePathname();
  const { session, logout } = useApp();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/quiz', label: 'Quiz' },
    { href: '/encyclopedia', label: 'Encyclopedia' },
    { href: '/rankings', label: 'Rankings' },
    { href: '/profile', label: 'My Profile' },
    { href: '/admin', label: 'Admin' }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-sky-500/20 bg-slate-950/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20 text-sky-200">
            <Plane size={20} />
          </div>
          <div>
            <p className="text-lg font-black text-white">Aircraft Identification QUIZ</p>
            <p className="text-[10px] uppercase tracking-[0.24em] text-sky-300">항공기 맞추기 QUIZ</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-5 text-sm text-slate-300 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={pathname === item.href ? 'font-semibold text-sky-300' : 'hover:text-white'}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {session ? (
            <>
              <div className="hidden items-center gap-2 rounded-full border border-sky-500/25 bg-sky-500/10 px-3 py-1 text-sm text-sky-100 md:flex">
                <Trophy size={14} />
                <span>{session.nickname}</span>
              </div>
              <button onClick={logout} className="secondary-btn gap-2 px-3 py-2 text-xs md:text-sm">
                <LogOut size={14} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="secondary-btn px-3 py-2 text-xs md:text-sm">
                Login
              </Link>
              <Link href="/signup" className="primary-btn px-3 py-2 text-xs md:text-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-sky-500/20 bg-slate-950/60">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sky-200">
          <ShieldCheck size={16} />
          <span>Secure aviation quiz platform</span>
        </div>
        <p>© 2026 Aircraft Identification QUIZ</p>
      </div>
    </footer>
  );
}
