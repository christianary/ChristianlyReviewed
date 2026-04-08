'use client'
import { Review } from '@/types'
import { SAMPLE_REVIEWS } from './data'
import { db } from './firebase'
import {
  collection, doc,
  getDocs, setDoc, deleteDoc
} from 'firebase/firestore'

const COL = 'reviews'

// ── Seed Firestore dengan sample data kalau kosong ────────────────────────────
export async function seedIfEmpty(): Promise<void> {
  const snap = await getDocs(collection(db, COL))
  if (!snap.empty) return
  for (const review of SAMPLE_REVIEWS) {
    await setDoc(doc(db, COL, review.id), review)
  }
}

// ── Read ──────────────────────────────────────────────────────────────────────
export async function getStoredReviews(): Promise<Review[]> {
  const snap = await getDocs(collection(db, COL))
  if (snap.empty) {
    await seedIfEmpty()
    return SAMPLE_REVIEWS
  }
  return snap.docs.map(d => d.data() as Review)
}

// ── Write ─────────────────────────────────────────────────────────────────────
export async function addReview(review: Review): Promise<void> {
  await setDoc(doc(db, COL, review.id), review)
}

export async function updateReview(review: Review): Promise<void> {
  await setDoc(doc(db, COL, review.id), review)
}

export async function deleteReview(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id))
}

// ── Export / Import ───────────────────────────────────────────────────────────
export async function exportData(): Promise<string> {
  const reviews = await getStoredReviews()
  return JSON.stringify(reviews, null, 2)
}

export async function importData(json: string): Promise<boolean> {
  try {
    const data = JSON.parse(json) as Review[]
    if (!Array.isArray(data)) return false
    for (const review of data) {
      await setDoc(doc(db, COL, review.id), review)
    }
    return true
  } catch {
    return false
  }
}

// ── Utils ─────────────────────────────────────────────────────────────────────
export function generateId(title: string): string {
  return title.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    + '-' + Date.now().toString(36)
}