'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Review, Category, CATEGORY_CONFIG } from '@/types'
import { getStoredReviews, addReview, updateReview, deleteReview, exportData, importData, generateId } from '@/lib/store'
import { calcWeightedScore, scoreColor } from '@/lib/data'
import CoverArt from '@/components/CoverArt'

const ADMIN_PASSWORD = 'kimiaorganik'

// ─── Password Gate ────────────────────────────────────────────────────────────
function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [val, setVal] = useState('')
  const [err, setErr] = useState(false)

  const tryUnlock = () => {
    if (val === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_unlocked', '1')
      onUnlock()
    } else {
      setErr(true)
      setTimeout(() => setErr(false), 1500)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="glass" style={{ padding: 40, maxWidth: 360, width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 16 }}>🔐</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 24, marginBottom: 8 }}>Admin Panel</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 24 }}>Enter password to continue</p>
        <input
          type="password"
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && tryUnlock()}
          placeholder="Password"
          autoFocus
          style={{
            width: '100%', padding: '10px 14px', borderRadius: 10,
            background: 'rgba(255,255,255,0.85)', border: `1px solid ${err ? '#D4537E' : 'var(--border)'}`,
            color: 'var(--text-primary)', fontSize: 14, fontFamily: 'var(--font-body)',
            outline: 'none', marginBottom: 12, transition: 'border-color 0.2s',
          }}
        />
        <button onClick={tryUnlock} style={{
          width: '100%', padding: '10px 14px', borderRadius: 10,
          background: 'rgba(127,119,221,0.15)', border: '1px solid rgba(127,119,221,0.35)',
          color: '#6c67c9', fontSize: 14, fontFamily: 'var(--font-body)', cursor: 'pointer',
        }}>
          Unlock
        </button>
        {err && <p style={{ color: '#D4537E', fontSize: 12, marginTop: 10 }}>Wrong password</p>}
      </div>
    </div>
  )
}

// ─── Review Form ──────────────────────────────────────────────────────────────
const CATEGORIES: Category[] = ['album', 'film', 'series', 'anime', 'game', 'book']

const COVER_COLORS = [
  { label: 'Purple', value: '#EEEDFE' },
  { label: 'Green', value: '#E1F5EE' },
  { label: 'Blue', value: '#E6F1FB' },
  { label: 'Pink', value: '#FBEAF0' },
  { label: 'Yellow', value: '#FAEEDA' },
  { label: 'Sage', value: '#EAF3DE' },
]

function emptyReview(cat: Category): Review {
  const cfg = CATEGORY_CONFIG[cat]
  return {
    id: '',
    title: '',
    subtitle: '',
    category: cat,
    status: 'consuming',
    coverColor: COVER_COLORS[0].value,
    coverEmoji: cfg.emoji,
    year: new Date().getFullYear(),
    genre: [],
    score: 0,
    aspects: cfg.hasSubItems ? undefined : cfg.aspects.map(a => ({ ...a, score: 0 })),
    subItems: cfg.hasSubItems ? [] : undefined,
    reviewText: '',
    dateReviewed: '',
    tags: [],
  }
}

interface FormProps {
  initial?: Review
  onSave: (r: Review) => void
  onCancel: () => void
}

function ReviewForm({ initial, onSave, onCancel }: FormProps) {
  const [cat, setCat] = useState<Category>(initial?.category || 'album')
  const [form, setForm] = useState<Review>(initial || emptyReview('album'))
  const [genreInput, setGenreInput] = useState((initial?.genre || []).join(', '))
  const [tagsInput, setTagsInput] = useState((initial?.tags || []).join(', '))
  const [subItemTitle, setSubItemTitle] = useState('')
  const [imageError, setImageError] = useState('')

  const isEdit = !!initial

  const cfg = CATEGORY_CONFIG[cat]

  useEffect(() => {
    if (!isEdit) {
      const newForm = emptyReview(cat)
      setForm(newForm)
    }
  }, [cat, isEdit])

  const setField = (key: keyof Review, val: unknown) =>
    setForm(f => ({ ...f, [key]: val }))

  const setAspectScore = (name: string, score: number) => {
    const aspects = (form.aspects || cfg.aspects.map(a => ({ ...a, score: 0 }))).map(a =>
      a.name === name ? { ...a, score } : a
    )
    const weighted = calcWeightedScore(aspects)
    setForm(f => ({ ...f, aspects, score: weighted }))
  }

  const addSubItem = () => {
    if (!subItemTitle.trim()) return
    const newItem = {
      id: generateId(subItemTitle),
      title: subItemTitle,
      number: (form.subItems?.length || 0) + 1,
      score: 0,
      aspects: (cfg.subAspects || cfg.aspects).map(a => ({ ...a, score: 0 })),
    }
    setForm(f => ({ ...f, subItems: [...(f.subItems || []), newItem] }))
    setSubItemTitle('')
  }

  const removeSubItem = (id: string) =>
    setForm(f => {
      const subItems = (f.subItems || []).filter(s => s.id !== id)
      const avgScore = subItems.length > 0
        ? Math.round((subItems.reduce((sum, s) => sum + s.score, 0) / subItems.length) * 10) / 10
        : 0
      return { ...f, subItems, score: avgScore }
    })

  const setSubItemAspect = (subId: string, aspectName: string, score: number) => {
    setForm(f => {
      const subItems = (f.subItems || []).map(s => {
        if (s.id !== subId) return s
        const aspects = s.aspects.map(a => a.name === aspectName ? { ...a, score } : a)
        return { ...s, aspects, score: calcWeightedScore(aspects) }
      })
      const avgScore = subItems.length > 0
        ? Math.round((subItems.reduce((sum, s) => sum + s.score, 0) / subItems.length) * 10) / 10
        : f.score
      return { ...f, subItems, score: avgScore }
    })
  }

  const handleSave = () => {
    const id = isEdit ? form.id : generateId(form.title || 'untitled')
    const genres = genreInput.split(',').map(g => g.trim()).filter(Boolean)
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean)
    const dateReviewed = form.status === 'completed' && !form.dateReviewed
      ? new Date().toISOString().split('T')[0]
      : form.dateReviewed

    const finalScore = !cfg.hasSubItems && form.aspects
      ? calcWeightedScore(form.aspects)
      : form.score

    onSave({ ...form, id, genre: genres, tags, dateReviewed, score: finalScore })
  }

  const inputStyle = {
    width: '100%', padding: '9px 12px', borderRadius: 8,
    background: 'rgba(255,255,255,0.8)', border: '0.5px solid var(--border)',
    color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-body)', outline: 'none',
  }

  const labelStyle = { fontSize: 11, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 6 }

  const sectionStyle = { marginBottom: 20 }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 22 }}>
          {isEdit ? 'Edit Review' : 'Add Review'}
        </h2>
        <button onClick={onCancel} style={{ fontSize: 13, color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}>
          ✕ Cancel
        </button>
      </div>

      {/* Category */}
      {!isEdit && (
        <div style={sectionStyle}>
          <label style={labelStyle}>Category</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {CATEGORIES.map(c => {
              const cc = CATEGORY_CONFIG[c]
              return (
                <button key={c} onClick={() => setCat(c)} style={{
                  padding: '6px 12px', borderRadius: 99, fontSize: 12, cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  background: cat === c ? cc.color + '22' : 'transparent',
                  border: `0.5px solid ${cat === c ? cc.color + '88' : 'var(--border)'}`,
                  color: cat === c ? cc.color : 'var(--text-secondary)',
                }}>
                  {cc.emoji} {cc.label}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Basic Info */}
      <div className="glass" style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div>
            <label style={labelStyle}>Title *</label>
            <input style={inputStyle} value={form.title} onChange={e => setField('title', e.target.value)} placeholder="Title" />
          </div>
          <div>
            <label style={labelStyle}>{cat === 'album' ? 'Artist' : cat === 'film' || cat === 'series' || cat === 'anime' ? 'Director / Studio' : 'Author / Developer'}</label>
            <input style={inputStyle} value={form.subtitle} onChange={e => setField('subtitle', e.target.value)} placeholder="Creator" />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div>
            <label style={labelStyle}>Year</label>
            <input style={inputStyle} type="number" value={form.year} onChange={e => setField('year', parseInt(e.target.value))} />
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <select style={{ ...inputStyle }} value={form.status} onChange={e => setField('status', e.target.value)}>
              <option value="consuming">Consuming</option>
              <option value="completed">Completed</option>
              <option value="dropped">Dropped</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Date Reviewed</label>
            <input style={inputStyle} type="date" value={form.dateReviewed} onChange={e => setField('dateReviewed', e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <label style={labelStyle}>Genre (comma separated)</label>
            <input style={inputStyle} value={genreInput} onChange={e => setGenreInput(e.target.value)} placeholder="e.g. Folk, Indie" />
          </div>
          <div>
            <label style={labelStyle}>Tags (comma separated)</label>
            <input style={inputStyle} value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="e.g. quiet, essential" />
          </div>
        </div>
      </div>

      {/* Cover */}
      <div className="glass" style={{ padding: 20, marginBottom: 16 }}>
        <label style={{ ...labelStyle, marginBottom: 14 }}>Cover Art</label>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Preview */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <CoverArt {...form} size={80} radius={14} />
            {form.coverImage && (
              <button
                onClick={() => setField('coverImage', undefined)}
                title="Remove photo"
                style={{
                  position: 'absolute', top: -6, right: -6, width: 20, height: 20,
                  borderRadius: '50%', background: '#D4537E', border: 'none',
                  color: 'white', fontSize: 11, cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', lineHeight: 1,
                }}
              >✕</button>
            )}
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Upload photo */}
            <div>
              <label style={{ ...labelStyle, marginBottom: 6 }}>Upload Photo</label>
              <label style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 8, cursor: 'pointer',
                background: 'rgba(127,119,221,0.1)', border: '0.5px solid rgba(127,119,221,0.35)',
                color: '#6c67c9', fontSize: 12, fontFamily: 'var(--font-body)',
                transition: 'all 0.15s',
              }}>
                📷 Choose Image
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    if (file.size > 5 * 1024 * 1024) {
                      setImageError('Image must be under 5MB')
                      return
                    }
                    setImageError('')
                    const reader = new FileReader()
                    reader.onload = () => setField('coverImage', reader.result as string)
                    reader.readAsDataURL(file)
                  }}
                />
              </label>
              {imageError && <p style={{ fontSize: 11, color: '#D4537E', marginTop: 4 }}>{imageError}</p>}
              {form.coverImage && <p style={{ fontSize: 11, color: '#1D9E75', marginTop: 4 }}>✓ Photo uploaded</p>}
            </div>

            {/* Emoji + Color (only visible when no photo) */}
            {!form.coverImage && (
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div>
                  <label style={{ ...labelStyle, marginBottom: 6 }}>Emoji</label>
                  <input style={{ ...inputStyle, width: 72 }} value={form.coverEmoji} onChange={e => setField('coverEmoji', e.target.value)} placeholder="🎵" />
                </div>
                <div>
                  <label style={{ ...labelStyle, marginBottom: 6 }}>Color</label>
                  <div style={{ display: 'flex', gap: 6, paddingBottom: 2 }}>
                    {COVER_COLORS.map(c => (
                      <button key={c.value} title={c.label} onClick={() => setField('coverColor', c.value)} style={{
                        width: 24, height: 24, borderRadius: 6, background: c.value, cursor: 'pointer',
                        border: form.coverColor === c.value ? '2px solid #6c67c9' : '2px solid rgba(0,0,0,0.1)',
                        boxShadow: form.coverColor === c.value ? '0 0 0 1px #6c67c9' : 'none',
                      }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Score / Aspects */}
      {form.status === 'completed' && (
        <>
          {!cfg.hasSubItems && (
            <div className="glass" style={{ padding: 20, marginBottom: 16 }}>
              <label style={{ ...labelStyle, marginBottom: 16 }}>Score Breakdown</label>
              {(form.aspects || cfg.aspects.map(a => ({ ...a, score: 0 }))).map(a => (
                <div key={a.name} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{a.name}</span>
                    <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: scoreColor(a.score) }}>{a.score.toFixed(1)}</span>
                  </div>
                  <input
                    type="range" min={0} max={10} step={0.1}
                    value={a.score}
                    onChange={e => setAspectScore(a.name, parseFloat(e.target.value))}
                    style={{ width: '100%', accentColor: scoreColor(a.score) }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-tertiary)', marginTop: 2 }}>
                    <span>0</span><span>Weight: {a.weight}%</span><span>10</span>
                  </div>
                </div>
              ))}
              <div style={{ borderTop: '0.5px solid var(--border)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Weighted Score</span>
                <span style={{ fontSize: 20, fontFamily: 'var(--font-mono)', color: scoreColor(form.score) }}>{form.score.toFixed(1)}</span>
              </div>
            </div>
          )}

          {cfg.hasSubItems && (
            <div className="glass" style={{ padding: 20, marginBottom: 16 }}>
              <label style={{ ...labelStyle, marginBottom: 14 }}>{cfg.subItemLabel}s</label>

              {(form.subItems || []).map((sub, si) => (
                <div key={sub.id} style={{ marginBottom: 16, padding: 14, borderRadius: 10, background: 'rgba(255,255,255,0.5)', border: '0.5px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{sub.number}. {sub.title}</span>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 14, fontFamily: 'var(--font-mono)', color: scoreColor(sub.score) }}>{sub.score.toFixed(1)}</span>
                      <button onClick={() => removeSubItem(sub.id)} style={{ color: '#D4537E', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>✕</button>
                    </div>
                  </div>
                  {sub.aspects.map(a => (
                    <div key={a.name} style={{ marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{a.name}</span>
                        <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)' }}>{a.score.toFixed(1)}</span>
                      </div>
                      <input
                        type="range" min={0} max={10} step={0.1}
                        value={a.score}
                        onChange={e => setSubItemAspect(sub.id, a.name, parseFloat(e.target.value))}
                        style={{ width: '100%', accentColor: scoreColor(a.score) }}
                      />
                    </div>
                  ))}
                </div>
              ))}

              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <input
                  style={{ ...inputStyle, flex: 1 }}
                  value={subItemTitle}
                  onChange={e => setSubItemTitle(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addSubItem()}
                  placeholder={`Add ${cfg.subItemLabel} title...`}
                />
                <button onClick={addSubItem} style={{
                  padding: '9px 16px', borderRadius: 8, background: 'rgba(127,119,221,0.12)',
                  border: '0.5px solid rgba(127,119,221,0.35)', color: '#6c67c9', fontSize: 13,
                  cursor: 'pointer', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap',
                }}>
                  + Add
                </button>
              </div>

              {(form.subItems || []).length > 0 && (
                <div style={{
                  marginTop: 16, padding: '12px 16px', borderRadius: 10,
                  background: 'rgba(29,158,117,0.06)', border: '0.5px solid rgba(29,158,117,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div>
                    <p style={{ fontSize: 11, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2 }}>
                      Overall Score
                    </p>
                    <p style={{ fontSize: 11, color: '#1D9E75' }}>
                      Auto-calculated from {(form.subItems || []).length} {cfg.subItemLabel.toLowerCase()} average
                    </p>
                  </div>
                  <span style={{ fontSize: 28, fontFamily: 'var(--font-mono)', color: scoreColor(form.score), fontWeight: 500 }}>
                    {form.score.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Review Text */}
      <div className="glass" style={{ padding: 20, marginBottom: 20 }}>
        <label style={labelStyle}>Review Text</label>
        <textarea
          style={{ ...inputStyle, minHeight: 120, resize: 'vertical', lineHeight: 1.7 }}
          value={form.reviewText}
          onChange={e => setField('reviewText', e.target.value)}
          placeholder="Write your thoughts..."
        />
      </div>

      {/* Save */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={handleSave} style={{
          flex: 1, padding: '12px 20px', borderRadius: 10, cursor: 'pointer',
          background: 'rgba(29,158,117,0.2)', border: '0.5px solid rgba(29,158,117,0.4)',
          color: '#1D9E75', fontSize: 14, fontFamily: 'var(--font-body)', fontWeight: 500,
        }}>
          {isEdit ? '✓ Save Changes' : '+ Add Review'}
        </button>
        <button onClick={onCancel} style={{
          padding: '12px 20px', borderRadius: 10, cursor: 'pointer',
          background: 'transparent', border: '0.5px solid var(--border)',
          color: 'var(--text-secondary)', fontSize: 14, fontFamily: 'var(--font-body)',
        }}>
          Cancel
        </button>
      </div>
    </div>
  )
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────
type View = 'list' | 'add' | 'edit'

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false)
  const [reviews, setReviews] = useState<Review[]>([])
  const [view, setView] = useState<View>('list')
  const [editing, setEditing] = useState<Review | null>(null)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState<Category | 'all'>('all')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (sessionStorage.getItem('admin_unlocked') === '1') setUnlocked(true)
  }, [])

  const load = useCallback(async () => {
    const reviews = await getStoredReviews()
    setReviews(reviews)
  }, [])

  useEffect(() => {
    if (unlocked) load()
  }, [unlocked, load])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const handleSave = async (r: Review) => {
    if (editing) {
      await updateReview(r)
      showToast('Review updated!')
    } else {
      await addReview(r)
      showToast('Review added!')
    }
    await load()
    setView('list')
    setEditing(null)
  }

  const handleDelete = async (id: string) => {
    await deleteReview(id)
    await load()
    setConfirmDelete(null)
    showToast('Review deleted')
  }

  const handleExport = async () => {
    const data = await exportData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `christianly-reviews-${Date.now()}.json`
    a.click()
  }

  const handleImport = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = async () => {
        if (await importData(reader.result as string)) {
          load()
          showToast('Data imported!')
        } else {
          showToast('Invalid JSON file')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />

  const filtered = reviews.filter(r => {
    const matchCat = catFilter === 'all' || r.category === catFilter
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.subtitle.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  if (view === 'add') {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px 96px' }}>
        <ReviewForm onSave={handleSave} onCancel={() => setView('list')} />
      </div>
    )
  }

  if (view === 'edit' && editing) {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px 96px' }}>
        <ReviewForm initial={editing} onSave={handleSave} onCancel={() => { setView('list'); setEditing(null) }} />
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px 96px' }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(29,158,117,0.9)', color: 'white', padding: '10px 20px',
          borderRadius: 99, fontSize: 13, zIndex: 999, backdropFilter: 'blur(12px)',
        }}>
          ✓ {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <Link href="/" style={{ fontSize: 12, color: 'var(--text-tertiary)', textDecoration: 'none' }}>← Site</Link>
            <span style={{ color: 'var(--text-tertiary)' }}>/</span>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Admin</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 28 }}>
            Review Manager
          </h1>
          <p style={{ color: 'var(--text-tertiary)', fontSize: 13, marginTop: 4 }}>{reviews.length} reviews total</p>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={handleImport} style={{
            padding: '8px 14px', borderRadius: 8, background: 'transparent',
            border: '0.5px solid var(--border)', color: 'var(--text-secondary)',
            fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)',
          }}>⬆ Import</button>
          <button onClick={handleExport} style={{
            padding: '8px 14px', borderRadius: 8, background: 'transparent',
            border: '0.5px solid var(--border)', color: 'var(--text-secondary)',
            fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)',
          }}>⬇ Export</button>
          <button onClick={() => setView('add')} style={{
            padding: '8px 16px', borderRadius: 8, background: 'rgba(127,119,221,0.12)',
            border: '0.5px solid rgba(127,119,221,0.35)', color: '#6c67c9',
            fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 500,
          }}>+ Add Review</button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          style={{
            flex: 1, minWidth: 180, padding: '8px 12px', borderRadius: 8,
            background: 'rgba(255,255,255,0.05)', border: '0.5px solid var(--border)',
            color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-body)', outline: 'none',
          }}
          placeholder="Search reviews..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          value={catFilter}
          onChange={e => setCatFilter(e.target.value as Category | 'all')}
          style={{
            padding: '8px 12px', borderRadius: 8,
            background: 'rgba(255,255,255,0.05)', border: '0.5px solid var(--border)',
            color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-body)', outline: 'none', cursor: 'pointer',
          }}
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_CONFIG[c].emoji} {CATEGORY_CONFIG[c].label}</option>)}
        </select>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {filtered.map(r => {
          const cfg = CATEGORY_CONFIG[r.category]
          return (
            <div key={r.id} className="glass" style={{
              padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <CoverArt {...r} size={44} radius={8} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: 10, color: cfg.color, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{cfg.label}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{r.year}</span>
                  <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 99, background: r.status === 'completed' ? 'rgba(29,158,117,0.15)' : 'rgba(255,255,255,0.06)', color: r.status === 'completed' ? '#1D9E75' : 'var(--text-tertiary)', border: '0.5px solid currentColor' }}>
                    {r.status}
                  </span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.title}</p>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{r.subtitle}</p>
              </div>

              {r.score > 0 && (
                <span style={{ fontSize: 16, fontFamily: 'var(--font-mono)', color: scoreColor(r.score), flexShrink: 0 }}>
                  {r.score.toFixed(1)}
                </span>
              )}

              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button
                  onClick={() => { setEditing(r); setView('edit') }}
                  style={{ padding: '6px 12px', borderRadius: 6, background: 'rgba(55,138,221,0.15)', border: '0.5px solid rgba(55,138,221,0.3)', color: '#378ADD', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
                >
                  Edit
                </button>
                {confirmDelete === r.id ? (
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={() => handleDelete(r.id)} style={{ padding: '6px 10px', borderRadius: 6, background: 'rgba(212,83,126,0.2)', border: '0.5px solid rgba(212,83,126,0.4)', color: '#D4537E', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                      Yes
                    </button>
                    <button onClick={() => setConfirmDelete(null)} style={{ padding: '6px 10px', borderRadius: 6, background: 'transparent', border: '0.5px solid var(--border)', color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(r.id)}
                    style={{ padding: '6px 10px', borderRadius: 6, background: 'transparent', border: '0.5px solid var(--border)', color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="glass" style={{ padding: 40, textAlign: 'center' }}>
            <p style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>No reviews found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
