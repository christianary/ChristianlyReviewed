import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'

export const metadata: Metadata = {
  title: 'Christianly Reviewed',
  description: 'A personal review archive — albums, films, anime, series, games, and books.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var saved = localStorage.getItem('theme');
              var preferred = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
              document.documentElement.setAttribute('data-theme', saved || preferred);
            } catch(e) {}
          })();
        `}} />
      </head>
      <body>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Nav />
          <main>{children}</main>
        </div>
      </body>
    </html>
  )
}
