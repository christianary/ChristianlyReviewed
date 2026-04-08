import { scoreColor } from '@/lib/data'

interface Props {
  name: string
  score: number
  weight: number
  description?: string
}

export default function AspectBar({ name, score, weight, description }: Props) {
  const color = scoreColor(score)
  const pct = (score / 10) * 100

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <div>
          <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{name}</span>
          <span style={{ fontSize: 11, color: 'var(--text-tertiary)', marginLeft: 6 }}>{weight}%</span>
        </div>
        <span style={{ fontSize: 15, fontWeight: 500, color }}>{score.toFixed(1)}</span>
      </div>
      <div style={{
        height: 3, background: 'rgba(0,0,0,0.07)', borderRadius: 99, overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: color, borderRadius: 99,
          transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }} />
      </div>
      {description && (
        <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4, lineHeight: 1.5 }}>{description}</p>
      )}
    </div>
  )
}
