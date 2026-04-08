'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from './ThemeProvider'

export default function Nav() {
  const path = usePathname()
  const { theme, mounted, toggle } = useTheme()

  const links = [
    { href: '/', label: 'Home' },
    { href: '/rankings', label: 'Rankings' },
    { href: '/admin', label: '⚙' },
  ]

  return (
    <nav className="nav-glass" style={{
      position: 'sticky', top: 0, zIndex: 50,
      padding: '0 24px',
      display: 'flex', alignItems: 'center',
      height: 56,
    }}>
      <Link href="/" style={{
        fontFamily: 'var(--font-display)',
        fontSize: 15,
        color: 'var(--text-primary)',
        textDecoration: 'none',
        letterSpacing: '0.06em',
        fontStyle: 'italic',
        marginRight: 'auto',
      }}>
        Christianly Reviewed
      </Link>

      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {links.map(({ href, label }) => {
          const active = path === href || (href !== '/' && path.startsWith(href))
          const isAdmin = href === '/admin'
          return (
            <Link key={href} href={href} style={{
              fontSize: isAdmin ? 16 : 13,
              padding: isAdmin ? '6px 10px' : '6px 14px',
              borderRadius: 99,
              border: '0.5px solid',
              borderColor: active ? 'var(--border-strong)' : 'transparent',
              background: active ? 'var(--surface)' : 'transparent',
              color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
              textDecoration: 'none',
            }}>
              {label}
            </Link>
          )
        })}

        {/* Theme toggle — hanya render icon setelah mounted untuk hindari hydration mismatch */}
        <button
          onClick={toggle}
          aria-label="Toggle theme"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{
            width: 34, height: 34,
            borderRadius: 99,
            border: '0.5px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: 15,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {/* Render placeholder dulu saat SSR, baru tampil icon setelah mounted */}
          {mounted ? (theme === 'dark' ? '☀️' : '🌙') : '　'}
        </button>
      </div>
    </nav>
  )
}
