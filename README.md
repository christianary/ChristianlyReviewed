# Christianly Reviewed

A personal media review archive — albums, films, anime, series, games, and books.

## Stack

- **Next.js 15** — App Router
- **TypeScript** — strict typed
- **Tailwind CSS** — utility styling
- **DM Serif Display + DM Sans + DM Mono** — font trio

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage — Currently Consuming + Recent Reviews
│   ├── rankings/page.tsx     # Rankings by category with filter tabs
│   ├── review/[id]/page.tsx  # Individual review page
│   ├── layout.tsx            # Root layout + Nav
│   ├── globals.css           # Glassmorphism design tokens + base styles
│   └── not-found.tsx         # 404 page
├── components/
│   ├── Nav.tsx               # Sticky nav bar
│   ├── ReviewCard.tsx        # Card/row review component
│   ├── ScoreDisplay.tsx      # Circular score ring
│   ├── AspectBar.tsx         # Weighted aspect score bar
│   ├── CategoryPill.tsx      # Category label pill
│   └── CoverArt.tsx          # Cover image or emoji fallback
├── lib/
│   └── data.ts               # Sample data + helper functions
└── types/
    └── index.ts              # All TypeScript types + CATEGORY_CONFIG
```

## Review System

### Single-entry categories (review directly)
- **Film** — Story & Screenplay (30%), Cinematography (20%), Acting (20%), Score & Sound (15%), Direction (15%)
- **Books** — Writing & Style (30%), Story/Core Idea (30%), Characters/Arguments (20%), Pacing (10%), Impact (10%)

### Multi-entry categories (review per sub-item → averaged)
- **Album** → per Track — full 5 aspects (same weights as top level)
- **Series** → per Episode — Story (40%), Execution (35%), Enjoyment (25%)
- **Anime** → per Episode — Story (40%), Execution (35%), Enjoyment (25%)
- **Game** → per Chapter — Story (40%), Execution (35%), Enjoyment (25%)

## Adding Reviews

Edit `src/lib/data.ts` and add to `SAMPLE_REVIEWS`. Each review needs:

```ts
{
  id: 'url-slug',
  title: 'Title',
  subtitle: 'Artist / Director / Author',
  category: 'album' | 'film' | 'series' | 'anime' | 'game' | 'book',
  status: 'completed' | 'consuming' | 'dropped',
  coverColor: '#hexcolor',  // fallback bg color
  coverEmoji: '🎵',         // fallback emoji
  coverImage: '/path.jpg',  // optional: actual cover photo
  year: 2024,
  genre: ['Genre'],
  score: 9.1,               // 0 if still consuming
  aspects: [...],           // for single-entry categories
  subItems: [...],          // for multi-entry categories
  reviewText: '...',
  dateReviewed: 'YYYY-MM-DD',
  tags: ['tag1', 'tag2'],
}
```

## Cover Images

Place cover photos in `/public/covers/` and reference them as:
```ts
coverImage: '/covers/album-name.jpg'
```

Recommended size: **500×500px** for albums/games, **500×750px** for films/books/series.
