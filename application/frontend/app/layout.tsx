import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Outty',
  description: 'Responsive mobile-first demo built with Next.js and TypeScript',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <div className="mobile-frame">{children}</div>
        </div>
      </body>
    </html>
  );
}
