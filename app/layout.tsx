import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/components/app-provider';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export const metadata: Metadata = {
  title: 'Aircraft Identification QUIZ',
  description: '항공기 맞추기 QUIZ - aircraft identification platform'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <AppProvider>
          <div className="bg-radar">
            <SiteHeader />
            <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">{children}</main>
            <SiteFooter />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
