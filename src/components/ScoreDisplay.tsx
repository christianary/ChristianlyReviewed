import { scoreColor, scoreLabel } from '@/lib/data'

interface Props {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export default function ScoreDisplay({ score, size = 'md', showLabel = false }: Props) {
  const color = scoreColor(score)
  const sizes = { sm: 28, md: 40, lg: 64 }
  const fonts = { sm: 12, md: 16, lg: 26 }
  const strokes = { sm: 2, md: 3, lg: 4 }
  const r = sizes[size] / 2 - strokes[size]
  const circ = 2 * Math.PI * r
  const pct = score / 10
  const dash = circ * pct

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={{ position: 'relative', width: sizes[size], height: sizes[size] }}>
        <svg width={sizes[size]} height={sizes[size]} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={sizes[size]/2} cy={sizes[size]/2} r={r}
            fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth={strokes[size]} />
          <circle cx={sizes[size]/2} cy={sizes[size]/2} r={r}
            fill="none" stroke={color} strokeWidth={strokes[size]}
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.6s ease' }}
          />
        </svg>
        <span style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: fonts[size], fontWeight: 500,
          color: 'var(--text-primary)',
        }}>
          {score > 0 ? score.toFixed(1) : '—'}
        </span>
      </div>
      {showLabel && score > 0 && (
        <span style={{ fontSize: 11, color, fontWeight: 500 }}>{scoreLabel(score)}</span>
      )}
    </div>
  )
}
