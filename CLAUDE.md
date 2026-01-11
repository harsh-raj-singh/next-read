# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Next Read" is a personalized article recommendation system built with Next.js 15, Supabase, and machine learning. The system uses content-based filtering (TF-IDF) and user interaction tracking to provide personalized tech article recommendations, primarily from Hacker News with planned multi-platform expansion.

## Development Commands

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint code quality checks
```

**Database Setup**: Run SQL schemas in Supabase SQL Editor in this order:
1. `supabase-schema.sql` - Core database structure
2. `supabase-platforms-final.sql` - Multi-platform support

**Article Initialization**: After auth setup, visit `/api/init` to fetch initial articles from Hacker News.

## Architecture

### Tech Stack
- **Next.js 15** with App Router (React 19, TypeScript)
- **Supabase** (PostgreSQL + Auth + RLS)
- **Tailwind CSS** with custom orange/amber design system
- **Natural** NLP library for TF-IDF computation
- **Vercel** deployment with cron jobs

### Route Structure
```
app/
├── (auth)/              # Authentication routes (login, signup)
├── (dashboard)/         # Protected routes (middleware enforced)
├── api/                 # REST endpoints (articles, recommendations, interactions)
└── auth/callback/       # Supabase auth callback handler
```

### Key Architectural Patterns

**Authentication Flow**: 
- Anonymous users are BLOCKED from interactions (middleware.ts)
- Auth users: email/password via Supabase Auth
- Server actions in `lib/auth/actions.ts` handle signIn/signUp/signOut
- Protected routes use `lib/auth/middleware.ts` for access control

**Database Architecture**:
- Row Level Security (RLS) enabled on all tables
- Users can only access their own interactions/recommendations
- Articles are publicly readable
- TF-IDF vectors stored in `articles.tfidf_vector` column

**ML Pipeline**:
1. Text preprocessing (tokenization, stop-word removal)
2. TF-IDF computation via `lib/ml/tfidf.ts`
3. Cosine similarity calculation in `lib/ml/similarity.ts`
4. Content-based filtering in `lib/recommendations/content-based.ts`

**Recommendation Strategy**:
- Cold start: Trending articles (high score, recent)
- Engaged users: 70% content-based, 30% exploration
- Interactions: Like (1), Dislike (-1), Rating (1-5), View tracking

## Important Conventions

**Component Architecture**:
- Client components use `'use client'` directive
- Server actions use `'use server'` directive
- Interactive components (buttons, forms) are client-side
- Data fetching components are server-side where possible

**Database Operations**:
- Browser operations: `lib/supabase/client.ts`
- Server operations: `lib/supabase/server.ts`
- Always use the appropriate client for security

**Error Handling**:
- API routes return JSON responses with appropriate status codes
- User-facing errors are displayed via toast/inline messages
- Database errors are logged but user receives generic messages

**Styling**:
- Tailwind utility classes
- Orange/amber color scheme (see `tailwind.config.ts`)
- Responsive design (mobile-first)
- Platform badges use `PlatformBadge.tsx` component

## Environment Variables

Required in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
CRON_SECRET=your_cron_secret  # For cron job authentication
```

## Database Schema Highlights

**Core Tables**:
- `profiles` - User profile extensions
- `articles` - Article content + TF-IDF vectors
- `user_interactions` - User engagement (likes, dislikes, ratings, views)
- `recommendations` - Cached recommendation results
- `platforms` - Multi-platform configuration

**Key Relationships**:
- `user_interactions.user_id` → `auth.users`
- `user_interactions.article_id` → `articles.id`
- `recommendations.user_id` → `auth.users`

## Common Patterns

**Fetching User Data**:
```typescript
const user = await getUser(); // lib/auth/getUser.ts
const supabase = createServerClient(); // lib/supabase/server.ts
```

**API Response Format**:
```typescript
return Response.json({ data: result }, { status: 200 });
return Response.json({ error: message }, { status: 500 });
```

**Article Fetching**:
- Hacker News API client: `lib/hn/fetch.ts`
- Scheduled via Vercel cron: `/app/api/cron/fetch-articles/route.ts`
- Manual initialization: `/app/api/init/route.ts`

## Deployment

**Vercel Cron Jobs**: Configured in `vercel.json`
- Runs every 6 hours: `0 */6 * * *`
- Endpoint: `/api/cron/fetch-articles`
- Protected by `CRON_SECRET` environment variable

**Build Process**:
1. `npm run build` validates TypeScript and builds production bundle
2. Deploy to Vercel (automatic from GitHub)
3. Environment variables must be configured in Vercel dashboard

## Troubleshooting

**No articles appearing**: Run `/api/init` to fetch initial articles
**Authentication errors**: Verify Supabase email templates are enabled
**CORS issues**: Check Supabase project settings for allowed origins
**RLS policy violations**: Ensure policies are created after schema changes
**TF-IDF errors**: Check that `natural` npm package is installed

## Future Development

**Planned Expansions**:
- Additional platforms (Uber Blog, Netflix Blog, newsletters)
- Real-time updates with Supabase subscriptions
- Collaborative filtering alongside content-based
- Pre-computed similarity matrix for performance
- Article bookmarking and saved searches

**Technical Debt**:
- No caching layer (consider Redis)
- On-demand similarity computation (could be batched)
- Limited test coverage
- Error handling could be more comprehensive