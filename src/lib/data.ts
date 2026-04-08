import { Review, Category } from '@/types'

export function calcWeightedScore(aspects: { score: number; weight: number }[]): number {
  const total = aspects.reduce((sum, a) => sum + (a.score * a.weight) / 100, 0)
  return Math.round(total * 10) / 10
}

export function calcAvgScore(scores: number[]): number {
  if (!scores.length) return 0
  return Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
}

export function scoreColor(score: number): string {
  if (score >= 9) return '#1D9E75'
  if (score >= 7) return '#378ADD'
  if (score >= 5) return '#BA7517'
  return '#D4537E'
}

export function scoreLabel(score: number): string {
  if (score >= 9.5) return 'Masterpiece'
  if (score >= 9)   return 'Exceptional'
  if (score >= 8)   return 'Great'
  if (score >= 7)   return 'Good'
  if (score >= 6)   return 'Decent'
  if (score >= 5)   return 'Average'
  return 'Below Average'
}

export const SAMPLE_REVIEWS: Review[] = [
]

export function getReviews(category?: Category, status?: string): Review[] {
  return SAMPLE_REVIEWS.filter(r => {
    if (category && r.category !== category) return false
    if (status && r.status !== status) return false
    return true
  })
}

export function getReview(id: string): Review | undefined {
  return SAMPLE_REVIEWS.find(r => r.id === id)
}

export function getRankings(category: Category): Review[] {
  return SAMPLE_REVIEWS
    .filter(r => r.category === category && r.status === 'completed' && r.score > 0)
    .sort((a, b) => b.score - a.score)
}
