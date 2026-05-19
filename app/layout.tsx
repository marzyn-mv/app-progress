import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import { ReactGrep } from '@/components/dev/react-grep';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'KCC Apps Status Dashboard',
  description: 'Council project status dashboard.',
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
          <div className="text-base font-extrabold text-foreground">KCC Apps Status Dashboard</div>
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
