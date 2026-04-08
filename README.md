# Next Read

![Next.js 15](https://img.shields.io/badge/Next.js-15-black)
![React 19](https://img.shields.io/badge/React-19-blue)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20Postgres-3ECF8E)
![Recommendation Engine](https://img.shields.io/badge/Engine-TF--IDF%20Ranking-orange)

Next Read is a production-minded article recommendation system for technical readers. It combines live content ingestion, interaction-driven personalization, and a clean reading interface into a single full-stack Next.js application.

The project is built around a straightforward but effective recommendation loop:

- ingest fresh articles from Hacker News
- transform article text into TF-IDF vectors
- learn user preference signals from likes, dislikes, ratings, and views
- rank personalized recommendations while preserving exploration
- fall back to trending results during cold start

Live deployment: [next-read-theta.vercel.app](https://next-read-theta.vercel.app)

## Why It Stands Out

This is not just a static news dashboard. The system includes the full recommendation lifecycle:

- authenticated user accounts with Supabase Auth
- persistent user interaction tracking
- content-based recommendation scoring
- scheduled ingestion via a protected cron endpoint
- production deployment configuration for Vercel

It is a compact but credible example of how to ship an end-to-end recommender product instead of stopping at algorithm notebooks or UI mockups.

## Real System Signals

These are grounded in the current codebase and build output:

- `41` TypeScript / TSX source files across `app`, `components`, and `lib`
- roughly `2,443` lines of source across the application core
- `19` app routes generated in the production build
- `10` API endpoints handling ingestion, recommendations, and interactions
- `100`-article ingestion batch from Hacker News per cron execution
- `20` recommendation slots in the main feed
- `30%` exploration rate to avoid a purely narrow feed
- cold-start fallback to trending content until a user reaches `5` interactions
- production build verified locally on the current repository state

## Product Architecture

### User Experience

- landing page with product framing and platform highlights
- auth flows for sign up, sign in, and callback handling
- personalized dashboard feed
- liked-articles view
- interaction controls for like, dislike, rate, and view tracking

### Backend Flow

1. A protected cron endpoint fetches top Hacker News stories.
2. Stories are normalized and converted into TF-IDF vectors.
3. Article records are stored in Supabase.
4. User interactions build an implicit preference profile.
5. Recommendations are ranked by content similarity, with exploration mixed in.

## Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Supabase Auth + Postgres
- Tailwind CSS
- `natural` for tokenization and TF-IDF feature extraction
- Vercel deployment and scheduled jobs

## Recommendation Strategy

The recommendation layer is intentionally simple, inspectable, and extensible.

- content-based scoring uses cosine similarity over TF-IDF vectors
- positive interactions contribute to a user preference profile
- ratings increase the weight of stronger positive signals
- unseen recent articles are prioritized
- exploration injects fresh content to reduce tunnel vision

This makes the project easy to reason about while still showing real recommender-system design choices.

## Quick Start

### Prerequisites

- Node.js 18+
- npm
- a Supabase project

### Install

```bash
git clone https://github.com/harsh-raj-singh/next-read.git
cd next-read
npm install
cp .env.example .env.local
```

Populate `.env.local` with your Supabase credentials and site URL settings.

### Database Setup

Run these SQL files in your Supabase SQL editor:

1. `supabase-schema.sql`
2. `security-fixes.sql`

Optional platform seed files are also included:

- `supabase-platforms-clean.sql`
- `supabase-platforms-final.sql`

### Run Locally

```bash
npm run dev
```

Open `http://localhost:3000`.

### Production Verification

```bash
npm run build
```

## Key Routes

### App Routes

- `/`
- `/login`
- `/signup`
- `/dashboard`

### API Routes

- `/api/articles`
- `/api/recommendations`
- `/api/liked`
- `/api/interactions`
- `/api/interact/like`
- `/api/interact/dislike`
- `/api/interact/rate`
- `/api/interact/view`
- `/api/init`
- `/api/cron/fetch-articles`

## Repository Layout

```text
.
├── app/
├── components/
├── lib/
│   ├── auth/
│   ├── hn/
│   ├── ml/
│   ├── recommendations/
│   └── supabase/
├── docs/
│   └── architecture.md
├── supabase-schema.sql
├── security-fixes.sql
└── vercel.json
```

## Security and Deployment

The repository includes:

- Supabase-backed authentication
- row-level security SQL for production hardening
- middleware-based route protection
- Vercel deployment configuration
- cron-secret protection for scheduled ingestion

## Future Expansion

- additional content sources beyond Hacker News
- collaborative filtering or hybrid ranking
- author and topic embeddings
- saved reading queues and digest emails
- richer analytics for reader preference evolution

## License

MIT
