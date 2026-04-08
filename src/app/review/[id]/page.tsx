'use client'
import { use, useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Review, CATEGORY_CONFIG } from '@/types'
import { scoreColor } from '@/lib/data'
import { getStoredReviews } from '@/lib/store'
import AspectBar from '@/components/AspectBar'
import CoverArt from '@/components/CoverArt'
import CategoryPill from '@/components/CategoryPill'
import ScoreDisplay from '@/components/ScoreDisplay'

interface Props {
  params: Promise<{ id: string }>
}

export default function ReviewPage({ params }: Props) {
  const { id } = use(params)
  const [review, setReview] = useState<Review | null | undefined>(undefined)

  useEffect(() => {
    async function load() {
      const reviews = await getStoredReviews()
      const found = reviews.find(r => r.id === id)
      setReview(found || null)
    }
    load()
  }, [id])

  if (review === undefined) return null
  if (review === null) return notFound()

  const cfg = CATEGORY_CONFIG[review.category]
  const isConsuming = review.status === 'consuming'

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px 96px' }}>
      <Link href="/" style={{ fontSize: 13, color: 'var(--text-tertiary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 32 }}>
        ← back
      </Link>

      <div className="animate-fade-up" style={{ display: 'flex', gap: 24, alignItems: 'flex-start', marginBottom: 40 }}>
        <CoverArt {...review} size={120} radius={16} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <CategoryPill category={review.category} />
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{review.year}</span>
            {isConsuming && (
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: 'rgba(29,158,117,0.15)', color: '#1D9E75', border: '0.5px solid rgba(29,158,117,0.3)' }}>
                In progress
              </span>
            )}
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 400, fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 6 }}>
            {review.title}
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 16 }}>{review.subtitle}</p>

          {review.genre && review.genre.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {review.genre.map(g => (
                <span key={g} style={{ fontSize: 11, padding: '3px 9px', borderRadius: 99, background: 'rgba(255,255,255,0.06)', border: '0.5px solid var(--border)', color: 'var(--text-secondary)' }}>
                  {g}
                </span>
              ))}
            </div>
          )}
        </div>

        {review.score > 0 && (
          <div style={{ flexShrink: 0, textAlign: 'center' }}>
            <ScoreDisplay score={review.score} size="lg" showLabel />
          </div>
        )}
      </div>

      {review.score > 0 && review.aspects && review.aspects.length > 0 && (
        <section className="glass animate-fade-up stagger-2" style={{ padding: '24px 24px 20px', marginBottom: 16 }}>
          <h2 style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 20 }}>
            Score Breakdown
          </h2>
          {review.aspects.map(a => (
            <AspectBar key={a.name} {...a} description={cfg.aspects.find(x => x.name === a.name)?.description} />
          ))}
        </section>
      )}

      {review.reviewText && (
        <section className="glass animate-fade-up stagger-3" style={{ padding: '24px', marginBottom: 16 }}>
          <h2 style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>
            Review
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8, fontFamily: 'var(--font-body)' }}>
            {review.reviewText}
          </p>
          {review.dateReviewed && (
            <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 16 }}>
              Reviewed {new Date(review.dateReviewed).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          )}
        </section>
      )}

      {cfg.hasSubItems && review.subItems && review.subItems.length > 0 && (
        <section className="animate-fade-up stagger-4" style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
            {cfg.subItemLabel}s
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {review.subItems.map((item) => {
              const color = scoreColor(item.score)
              const barW = (item.score / 10) * 100
              return (
                <details key={item.id} className="glass" style={{ padding: '14px 18px', cursor: 'pointer' }}>
                  <summary style={{ display: 'flex', alignItems: 'center', gap: 14, listStyle: 'none', cursor: 'pointer' }}>
                    <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', width: 20, textAlign: 'right', flexShrink: 0 }}>
                      {String(item.number).padStart(2, '0')}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.title}
                      </p>
                      <div style={{ height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${barW}%`, background: color, borderRadius: 99 }} />
                      </div>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 500, color, flexShrink: 0, fontFamily: 'var(--font-mono)' }}>
                      {item.score.toFixed(1)}
                    </span>
                  </summary>

                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: '0.5px solid var(--border)' }}>
                    {item.aspects.map(a => (
                      <AspectBar key={a.name} {...a} />
                    ))}
                    {item.notes && (
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: 8 }}>{item.notes}</p>
                    )}
                  </div>
                </details>
              )
            })}
          </div>
        </section>
      )}

      {review.tags && review.tags.length > 0 && (
        <div className="animate-fade-up stagger-5" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 24 }}>
          {review.tags.map(t => (
            <span key={t} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 99, background: 'rgba(255,255,255,0.05)', border: '0.5px solid var(--border)', color: 'var(--text-tertiary)' }}>
              #{t}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}