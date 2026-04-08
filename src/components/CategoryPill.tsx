import { Category, CATEGORY_CONFIG } from '@/types'

interface Props {
  category: Category
  size?: 'sm' | 'md'
}

export default function CategoryPill({ category, size = 'md' }: Props) {
  const cfg = CATEGORY_CONFIG[category]
  return (
    <span className="category-pill" style={{
      backgroundColor: cfg.accentColor + '22',
      borderColor: cfg.color + '44',
      color: cfg.color,
      fontSize: size === 'sm' ? 10 : 11,
      padding: size === 'sm' ? '2px 7px' : '3px 9px',
    }}>
      {cfg.label}
    </span>
  )
}
