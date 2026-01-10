# HN Recommender

Personalized Hacker News article recommendations using hybrid machine learning (TF-IDF + collaborative filtering).

## 🚀 Features

- Real-time article fetching from Hacker News API
- Like/Dislike articles to train your personal model
- Rate articles (1-5 stars) for better recommendations
- Hybrid recommendation system (content + collaborative filtering)
- 25% exploration rate for discovering new topics
- Resurfacing of older articles you might have missed
- Real-time updates using Supabase subscriptions

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend/Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Google + Email)
- **ML**: TF-IDF (natural npm package)
- **Deployment**: Vercel (free tier)
- **Scheduling**: Vercel Cron Jobs (every 6 hours)

## 📦 Setup Instructions

### 1. Clone and Install

```bash
cd recommender
npm install
```

### 2. Set Up Supabase Database

1. Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/bljkswrtifkzumezrhqy/sql/new)
2. Copy and paste the contents of `supabase-schema.sql`
3. Click "Run" to execute
4. Verify tables are created in the Table Editor

### 3. Verify Setup

```bash
npm run dev
```

Visit `http://localhost:3000` to see the landing page.

## 📁 Project Structure

```
recommender/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles
├── lib/
│   └── supabase/          # Supabase clients
│       ├── client.ts       # Browser client
│       └── server.ts       # Server client
├── supabase-schema.sql    # Database schema
└── README.md
```

## 🔐 Environment Variables

Required environment variables are already set in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://bljkswrtifkzumezrhqy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_kT4CgRCqwg7iKIWt6WnjCA_lNco8fSB
```

## 📊 Database Schema

### Tables

- **profiles**: User profiles (extended from auth.users)
- **articles**: Hacker News articles with TF-IDF vectors
- **user_interactions**: User likes, dislikes, ratings, visit counts
- **recommendations**: Cached personalized recommendations
- **article_similarity**: Precomputed article similarity matrix

### Row Level Security (RLS)

All tables have RLS enabled:
- Users can only access their own data (interactions, recommendations)
- Articles are publicly readable
- Automatic profile creation on signup via trigger

## 🎯 Phase Status

- ✅ **Phase 1**: Project setup and database schema
- 🔄 **Phase 2**: Authentication (coming soon)
- ⏳ **Phase 3**: HN article fetching
- ⏳ **Phase 4**: User interaction tracking
- ⏳ **Phase 5**: Recommendation engine
- ⏳ **Phase 6**: Frontend UI
- ⏳ **Phase 7**: Real-time updates

## 📝 License

MIT License - Open source for the community!

## 🤝 Contributing

Feel free to fork, modify, and submit issues/PRs.
