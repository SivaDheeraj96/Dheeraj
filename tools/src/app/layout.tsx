import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'DevTools — Online Utilities',
  description: 'Free online developer utilities: JSON formatter, Base64, URL encoder, JWT decoder, hash generator, and more. All run locally in your browser.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />
          <main
            style={{
              marginLeft: 'var(--sidebar-width)',
              flex: 1,
              minHeight: '100vh',
              background: 'var(--background)',
            }}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
