import Link from 'next/link'
import { Review } from '@/types'
import { CATEGORY_CONFIG } from '@/types'
import ScoreDisplay from './ScoreDisplay'
import CategoryPill from './CategoryPill'
import CoverArt from './CoverArt'

interface Props {
  review: Review
  variant?: 'row' | 'card'
  index?: number
}

export default function ReviewCard({ review, variant = 'row', index = 0 }: Props) {
  const stagger = Math.min(index + 1, 6)

  if (variant === 'card') {
    return (
      <Link href={`/review/${review.id}`} style={{ textDecoration: 'none' }}>
        <div className={`glass animate-fade-up stagger-${stagger}`} style={{
          padding: 16, cursor: 'pointer', transition: 'transform 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <CoverArt {...review} size={120} radius={10} />
          <div style={{ marginTop: 12 }}>
            <CategoryPill category={review.category} size="sm" />
            <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginTop: 6, marginBottom: 2 }}>
              {review.title}
            </p>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{review.subtitle}</p>
            {review.score > 0 && (
              <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginTop: 8 }}>
                {review.score.toFixed(1)}
              </p>
            )}
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/review/${review.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div className={`glass animate-fade-up stagger-${stagger}`}
        style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, transition: 'transform 0.2s' }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'translateX(4px)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'translateX(0)')}
      >
        <CoverArt {...review} size={48} radius={10} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
            <CategoryPill category={review.category} size="sm" />
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{review.year}</span>
          </div>
          <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {review.title}
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{review.subtitle}</p>
        </div>
        {review.score > 0 && <ScoreDisplay score={review.score} size="sm" />}
      </div>
    </Link>
  )
}
