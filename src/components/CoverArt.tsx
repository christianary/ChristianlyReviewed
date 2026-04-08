import { Category, CATEGORY_CONFIG } from '@/types'

interface Props {
  coverImage?: string
  coverColor: string
  coverEmoji: string
  category: Category
  size?: number
  radius?: number
}

export default function CoverArt({ coverImage, coverColor, coverEmoji, category, size = 56, radius = 12 }: Props) {
  const cfg = CATEGORY_CONFIG[category]

  if (coverImage) {
    return (
      <img
        src={coverImage}
        alt=""
        style={{
          width: size, height: size,
          borderRadius: radius,
          objectFit: 'cover',
          flexShrink: 0,
          border: '0.5px solid rgba(0,0,0,0.08)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      />
    )
  }

  return (
    <div style={{
      width: size, height: size,
      borderRadius: radius,
      background: `linear-gradient(135deg, ${coverColor}cc, ${coverColor}66)`,
      border: `0.5px solid ${cfg.color}33`,
      boxShadow: `0 2px 8px ${cfg.color}22`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.4,
      flexShrink: 0,
    }}>
      {coverEmoji}
    </div>
  )
}
