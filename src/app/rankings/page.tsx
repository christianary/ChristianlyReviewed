'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Category, CATEGORY_CONFIG } from '@/types'
import { scoreColor } from '@/lib/data'
import { getStoredReviews } from '@/lib/store'
import CoverArt from '@/components/CoverArt'
import { Review } from '@/types'

const CATEGORIES: Category[] = ['album', 'film', 'series', 'anime', 'game', 'book']

export default function RankingsPage() {
  const [active, setActive] = useState<Category | 'all'>('all')
  const [yearFilter, setYearFilter] = useState<number | 'all'>('all')
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    async function load() {
      const reviews = await getStoredReviews()
      setReviews(reviews)
    }
    load()
  }, [])

  const completed = reviews.filter(r => r.status === 'completed' && r.score > 0)
  const years = Array.from(new Set(completed.map(r => r.year))).sort((a, b) => b - a)

  const filtered = completed
    .filter(r => {
      if (active !== 'all' && r.category !== active) return false
      if (yearFilter !== 'all' && r.year !== yearFilter) return false
      return true
    })
    .sort((a, b) => b.score - a.score)

  const topScore = filtered[0]?.score || 10

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 96px' }}>
      <div className="animate-fade-up" style={{ marginBottom: 40 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 400, fontStyle: 'italic', color: 'var(--text-primary)', marginBottom: 8 }}>
          Rankings
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Every completed review, ranked by weighted score.</p>
      </div>

      {/* Category Filter */}
      <div className="animate-fade-up stagger-1" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
        <button onClick={() => setActive('all')} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '7px 14px', borderRadius: 99, border: '0.5px solid',
          borderColor: active === 'all' ? 'rgba(255,255,255,0.35)' : 'var(--border)',
          background: active === 'all' ? 'rgba(255,255,255,0.08)' : 'transparent',
          color: active === 'all' ? 'var(--text-primary)' : 'var(--text-secondary)',
          fontSize: 13, fontFamily: 'var(--font-body)', cursor: 'pointer', transition: 'all 0.2s',
        }}>✦ All</button>

        {CATEGORIES.map(cat => {
          const c = CATEGORY_CONFIG[cat]
          const isActive = cat === active
          return (
            <button key={cat} onClick={() => setActive(cat)} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 99, border: '0.5px solid',
              borderColor: isActive ? c.color + '88' : 'var(--border)',
              background: isActive ? c.color + '22' : 'transparent',
              color: isActive ? c.color : 'var(--text-secondary)',
              fontSize: 13, fontFamily: 'var(--font-body)', cursor: 'pointer', transition: 'all 0.2s',
            }}>
              <span style={{ fontSize: 14 }}>{c.emoji}</span>{c.label}
            </button>
          )
        })}
      </div>

      {/* Year Filter */}
      {years.length > 0 && (
        <div className="animate-fade-up stagger-2" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 32, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginRight: 4 }}>Year:</span>
          <button onClick={() => setYearFilter('all')} style={{
            padding: '4px 12px', borderRadius: 99, fontSize: 12, fontFamily: 'var(--font-body)', cursor: 'pointer', transition: 'all 0.2s',
            background: yearFilter === 'all' ? 'rgba(255,255,255,0.08)' : 'transparent',
            border: `0.5px solid ${yearFilter === 'all' ? 'rgba(255,255,255,0.25)' : 'var(--border)'}`,
            color: yearFilter === 'all' ? 'var(--text-primary)' : 'var(--text-tertiary)',
          }}>All</button>
          {years.map(y => (
            <button key={y} onClick={() => setYearFilter(y)} style={{
              padding: '4px 12px', borderRadius: 99, fontSize: 12, fontFamily: 'var(--font-mono)', cursor: 'pointer', transition: 'all 0.2s',
              background: yearFilter === y ? 'rgba(186,117,23,0.18)' : 'transparent',
              border: `0.5px solid ${yearFilter === y ? 'rgba(186,117,23,0.5)' : 'var(--border)'}`,
              color: yearFilter === y ? '#BA7517' : 'var(--text-tertiary)',
            }}>{y}</button>
          ))}
        </div>
      )}

      {filtered.length > 0 && (
        <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 16, letterSpacing: '0.04em' }}>
          {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}
          {yearFilter !== 'all' ? ` · ${yearFilter}` : ''}
          {active !== 'all' ? ` · ${CATEGORY_CONFIG[active as Category].label}` : ' · All Categories'}
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="glass" style={{ padding: 40, textAlign: 'center' }}>
          <p style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>No completed reviews found for this filter.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map((r, i) => {
            const color = scoreColor(r.score)
            const barW = (r.score / topScore) * 100
            const cfg = CATEGORY_CONFIG[r.category]
            return (
              <Link key={r.id} href={`/review/${r.id}`} style={{ textDecoration: 'none' }}>
                <div className={`glass animate-fade-up stagger-${Math.min(i+1,6)}`}
                  style={{ padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, transition: 'transform 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'translateX(4px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'translateX(0)')}
                >
                  <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', width: 20, textAlign: 'right', flexShrink: 0 }}>
                    {i + 1}
                  </span>
                  <CoverArt {...r} size={44} radius={8} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {r.title}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      {active === 'all' && (
                        <span style={{ fontSize: 10, color: cfg.color, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', flexShrink: 0 }}>
                          {cfg.emoji} {cfg.label}
                        </span>
                      )}
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.subtitle}</p>
                      <span style={{ fontSize: 11, color: 'var(--text-tertiary)', flexShrink: 0 }}>· {r.year}</span>
                    </div>
                    <div style={{ height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${barW}%`, background: color, borderRadius: 99, transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)' }} />
                    </div>
                  </div>
                  <span style={{ fontSize: 18, fontWeight: 500, color, flexShrink: 0, fontFamily: 'var(--font-mono)' }}>
                    {r.score.toFixed(1)}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
