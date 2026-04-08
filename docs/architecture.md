# Architecture Notes

## Overview

Next Read is a full-stack reading recommender built as a single Next.js application with Supabase as the system of record.

The architecture has five major layers:

1. ingestion
2. feature extraction
3. interaction capture
4. recommendation ranking
5. application delivery

## Ingestion

The ingestion pipeline starts in [`app/api/cron/fetch-articles/route.ts`](../app/api/cron/fetch-articles/route.ts).

- fetches up to `100` valid Hacker News stories per run
- validates access with `x-cron-secret`
- normalizes article fields
- computes TF-IDF vectors before persistence
- upserts into Supabase on article `id`

This keeps the recommendation corpus fresh without needing a separate backend service.

## Feature Extraction

The TF-IDF workflow lives in [`lib/ml/tfidf.ts`](../lib/ml/tfidf.ts).

- tokenizes normalized article text
- removes stop words and low-signal tokens
- computes a sparse TF-IDF representation
- stores `terms`, `scores`, and vector `magnitude`

Similarity scoring lives in [`lib/ml/similarity.ts`](../lib/ml/similarity.ts) and uses cosine similarity to compare article vectors with user preference vectors.

## User Modeling

User actions are captured through the interaction API routes:

- like
- dislike
- rate
- view

These signals are persisted in `user_interactions` and later aggregated into a lightweight preference profile in [`lib/recommendations/content-based.ts`](../lib/recommendations/content-based.ts).

The current implementation:

- prioritizes positive interactions
- weights rated items more strongly
- excludes already seen articles from personalized retrieval
- falls back to trending content during cold start

## Recommendation Policy

The ranking policy is intentionally transparent:

- recent unseen articles are candidates
- content similarity determines personalized ranking
- an exploration policy introduces randomness at a `30%` rate
- cold-start users see trending results until they have at least `5` interactions

This makes the system easy to inspect, demo, and evolve into a hybrid recommender later.

## Delivery Layer

The frontend is organized with:

- marketing-oriented landing sections
- auth routes
- a personalized dashboard
- reusable article and interaction components

The dashboard fetches personalized content from the app's own API layer, keeping client logic thin and recommendation behavior centralized.

## Operational Notes

- current deployment target is Vercel
- auth and persistence are handled by Supabase
- production build currently generates `19` routes
- the app is suitable as a portfolio-grade reference for full-stack recommendation systems
