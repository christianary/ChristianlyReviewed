export type Category = 'album' | 'film' | 'series' | 'anime' | 'game' | 'book'

export type Status = 'completed' | 'consuming' | 'dropped'

export interface AspectScore {
  name: string
  score: number
  weight: number
  description?: string
}

export interface SubItem {
  id: string
  title: string
  number: number
  aspects: AspectScore[]
  score: number
  notes?: string
}

export interface Review {
  id: string
  title: string
  subtitle: string
  category: Category
  status: Status
  coverColor: string
  coverEmoji: string
  coverImage?: string
  year: number
  genre: string[]
  score: number
  aspects?: AspectScore[]
  subItems?: SubItem[]
  reviewText: string
  dateReviewed: string
  tags?: string[]
}

export const CATEGORY_CONFIG: Record<Category, {
  label: string
  emoji: string
  color: string
  accentColor: string
  hasSubItems: boolean
  subItemLabel: string
  aspects: Omit<AspectScore, 'score'>[]
  subAspects?: Omit<AspectScore, 'score'>[]
}> = {
  album: {
    label: 'Album',
    emoji: '🎵',
    color: '#7F77DD',
    accentColor: '#EEEDFE',
    hasSubItems: true,
    subItemLabel: 'Track',
    aspects: [
      { name: 'Production & Sound', weight: 25, description: 'Mix quality, mastering, sonic texture — does it sound good as a listening experience?' },
      { name: 'Lyrics & Meaning',   weight: 25, description: 'Depth, originality, and emotional resonance of the words and themes.' },
      { name: 'Composition & Arrangement', weight: 20, description: 'How instruments, melodies, and structure are put together as a whole.' },
      { name: 'Vocals & Performance', weight: 15, description: 'Delivery, technique, and emotional expressiveness of the vocal performance.' },
      { name: 'Replayability',      weight: 15, description: 'How much you want to return to it — does it reveal more with each listen?' },
    ],
    subAspects: [
      { name: 'Production & Sound', weight: 25, description: 'Mix quality, mastering, sonic texture.' },
      { name: 'Lyrics & Meaning',   weight: 25, description: 'Depth and emotional resonance of the words.' },
      { name: 'Composition & Arrangement', weight: 20, description: 'How instruments and structure come together.' },
      { name: 'Vocals & Performance', weight: 15, description: 'Delivery and expressiveness.' },
      { name: 'Replayability',      weight: 15, description: 'How often you want to return to this track.' },
    ],
  },
  film: {
    label: 'Film',
    emoji: '🎬',
    color: '#1D9E75',
    accentColor: '#E1F5EE',
    hasSubItems: false,
    subItemLabel: '',
    aspects: [
      { name: 'Story & Screenplay', weight: 30, description: 'Narrative structure, dialogue quality, originality, and overall writing craft.' },
      { name: 'Cinematography',     weight: 20, description: 'Visual language — framing, lighting, camera movement, and aesthetic choices.' },
      { name: 'Acting',             weight: 20, description: 'Believability, range, and emotional depth of the performances.' },
      { name: 'Score & Sound Design', weight: 15, description: 'How music and sound support mood, tension, and storytelling.' },
      { name: 'Direction & Vision', weight: 15, description: "The coherence of the director's creative intent — does it feel like a unified work?" },
    ],
  },
  series: {
    label: 'Series',
    emoji: '📺',
    color: '#378ADD',
    accentColor: '#E6F1FB',
    hasSubItems: true,
    subItemLabel: 'Episode',
    aspects: [
      { name: 'Story & Consistency',   weight: 30, description: 'Plot quality across episodes — does it stay compelling without major drops?' },
      { name: 'Character Development', weight: 25, description: 'How much characters grow, feel real, and carry the narrative forward.' },
      { name: 'Acting',                weight: 20, description: 'Quality of performances across the main and supporting cast.' },
      { name: 'Pacing',               weight: 15, description: 'Episode and season rhythm — not too rushed, not too slow.' },
      { name: 'World-building',        weight: 10, description: 'How well the setting, rules, and lore are established and maintained.' },
    ],
    subAspects: [
      { name: 'Story',     weight: 40, description: 'How well this episode advances the narrative.' },
      { name: 'Execution', weight: 35, description: 'Directing, pacing, and overall craft of this episode.' },
      { name: 'Enjoyment', weight: 25, description: 'How much you enjoyed watching this episode.' },
    ],
  },
  anime: {
    label: 'Anime',
    emoji: '🎌',
    color: '#D4537E',
    accentColor: '#FBEAF0',
    hasSubItems: true,
    subItemLabel: 'Episode',
    aspects: [
      { name: 'Story & Plot',      weight: 25, description: 'Narrative coherence, originality, and how well the story holds up overall.' },
      { name: 'Characters',        weight: 25, description: 'Depth, relatability, and growth of the main and supporting cast.' },
      { name: 'Animation & Visuals', weight: 20, description: 'Fluidity, art style consistency, and quality of key animation moments.' },
      { name: 'OST & Sound Design', weight: 15, description: 'Opening/ending themes, BGM, and overall audio atmosphere.' },
      { name: 'Enjoyment',         weight: 15, description: 'Pure subjective feel — how much fun, emotion, or engagement it gave you.' },
    ],
    subAspects: [
      { name: 'Story',     weight: 40, description: 'How well this episode advances the narrative.' },
      { name: 'Execution', weight: 35, description: 'Animation quality and directorial choices this episode.' },
      { name: 'Enjoyment', weight: 25, description: 'Pure enjoyment of this episode.' },
    ],
  },
  game: {
    label: 'Game',
    emoji: '🎮',
    color: '#639922',
    accentColor: '#EAF3DE',
    hasSubItems: true,
    subItemLabel: 'Chapter',
    aspects: [
      { name: 'Gameplay & Mechanics', weight: 30, description: 'Core loop feel, control responsiveness, and how fun it is to actually play.' },
      { name: 'Story & Narrative',    weight: 20, description: 'Writing quality, plot, and how well the story integrates with gameplay.' },
      { name: 'Visuals & Art Direction', weight: 15, description: 'Art style coherence, aesthetic choices, and overall visual identity.' },
      { name: 'Music & Audio',        weight: 15, description: 'Soundtrack, sound effects, and how audio enhances the experience.' },
      { name: 'Replayability',        weight: 20, description: 'Longevity — replay value, content depth, or how long it holds your attention.' },
    ],
    subAspects: [
      { name: 'Story',     weight: 40, description: 'Narrative beats and writing quality of this chapter.' },
      { name: 'Execution', weight: 35, description: 'Level design, pacing, and moment-to-moment gameplay.' },
      { name: 'Enjoyment', weight: 25, description: 'How much fun this chapter was.' },
    ],
  },
  book: {
    label: 'Book',
    emoji: '📚',
    color: '#BA7517',
    accentColor: '#FAEEDA',
    hasSubItems: false,
    subItemLabel: '',
    aspects: [
      { name: 'Writing & Style',         weight: 30, description: "Prose quality, voice, clarity, and distinctiveness of the author's writing." },
      { name: 'Story / Core Idea',       weight: 30, description: 'For fiction: plot and themes. For non-fiction: strength and novelty of the central argument.' },
      { name: 'Characters / Arguments',  weight: 20, description: 'For fiction: character depth. For non-fiction: how well ideas are developed and supported.' },
      { name: 'Pacing',                  weight: 10, description: 'Does the book move at the right speed — never dragging, never rushing?' },
      { name: 'Impact & Impression',     weight: 10, description: 'How much it stuck with you — changed your thinking, moved you emotionally, or stayed in your mind.' },
    ],
  },
}
