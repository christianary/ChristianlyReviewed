import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '96px 24px', textAlign: 'center' }}>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 48,
        fontWeight: 400,
        fontStyle: 'italic',
        color: 'var(--text-primary)',
        marginBottom: 16,
      }}>
        404
      </h1>
      <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 32 }}>
        This review doesn&apos;t exist yet.
      </p>
      <Link href="/" style={{
        fontSize: 14,
        color: 'var(--text-secondary)',
        textDecoration: 'none',
        padding: '10px 20px',
        border: '0.5px solid var(--border)',
        borderRadius: 99,
        transition: 'all 0.2s',
      }}>
        ← Back home
      </Link>
    </div>
  )
}
