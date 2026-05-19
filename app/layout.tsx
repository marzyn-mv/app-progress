import type { Metadata } from 'next';
import Link from 'next/link';
import { Geist } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import { ReactGrep } from '@/components/dev/react-grep';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'KCC Status Editor',
  description: 'Edit project fields for the Council status dashboard.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn('font-sans', geist.variable)}>
      <body className="min-h-screen bg-gradient-to-b from-indigo-50 to-background">
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>

        <header
          className="sticky top-0 z-20 flex items-center justify-between gap-6 border-b border-border/25 bg-white/82 px-6 py-4 backdrop-blur-sm"
          role="banner"
        >
          <div className="text-base font-extrabold text-foreground">KCC Status</div>
          <nav aria-label="Main navigation" className="flex gap-2">
            <Link
              href="/"
              className="rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-indigo-500/10 hover:text-indigo-700 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              Editor
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-indigo-500/10 hover:text-indigo-700 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              Dashboard
            </Link>
            <Link
              href="/settings"
              className="rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-indigo-500/10 hover:text-indigo-700 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              Settings
            </Link>
          </nav>
        </header>

        <main id="main-content" role="main">
          {children}
        </main>

        <Toaster position="bottom-right" />
        <ReactGrep />
      </body>
    </html>
  );
}
