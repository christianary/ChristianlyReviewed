'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CATEGORY_CONFIG } from '@/types'
import { getStoredReviews } from '@/lib/store'
import { Review } from '@/types'
import ReviewCard from '@/components/ReviewCard'
import CoverArt from '@/components/CoverArt'

export default function HomePage() {
  const [consuming, setConsuming] = useState<Review[]>([])
  const [recent, setRecent] = useState<Review[]>([])

  useEffect(() => {
    const loadReviews = async () => {
      const all = await getStoredReviews()
      setConsuming(all.filter(r => r.status === 'consuming'))
      setRecent(all.filter(r => r.status === 'completed').slice(0, 6))
    }
    loadReviews()
  }, [])

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 96px' }}>

      <div className="animate-fade-up" style={{ marginBottom: 64 }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(32px, 5vw, 48px)',
          fontWeight: 400,
          fontStyle: 'italic',
          color: 'var(--text-primary)',
          lineHeight: 1.15,
          marginBottom: 12,
        }}>
          A personal archive<br />of everything consumed.
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 420, lineHeight: 1.7 }}>
          Albums, films, anime, series, games, and books — rated with intention, reviewed with honesty.
        </p>
      </div>

      {consuming.length > 0 && (
        <section style={{ marginBottom: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
                background: '#1D9E75',
                boxShadow: '0 0 0 3px rgba(29,158,117,0.2)',
                animation: 'pulse 2s ease infinite',
              }} />
              <h2 style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Currently Consuming
              </h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
            {consuming.map((r, i) => {
              const cfg = CATEGORY_CONFIG[r.category]
              return (
                <Link key={r.id} href={`/review/${r.id}`} style={{ textDecoration: 'none' }}>
                  <div className={`glass animate-fade-up stagger-${i+1}`}
                    style={{ padding: 14, cursor: 'pointer', transition: 'transform 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                  >
                    <CoverArt {...r} size={80} radius={10} />
                    <div style={{ marginTop: 10 }}>
                      <span style={{ fontSize: 10, color: cfg.color, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        {cfg.label}
                      </span>
                      <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginTop: 3, marginBottom: 2, lineHeight: 1.3 }}>
                        {r.title}
                      </p>
                      <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{r.subtitle}</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Recent Reviews
          </h2>
          <Link href="/rankings" style={{ fontSize: 12, color: 'var(--text-secondary)', textDecoration: 'none' }}>
            View rankings →
          </Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {recent.map((r, i) => <ReviewCard key={r.id} review={r} index={i} />)}
        </div>
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(29,158,117,0.2); }
          50% { box-shadow: 0 0 0 6px rgba(29,158,117,0.05); }
        }
      `}</style>
    </div>
  )
}
