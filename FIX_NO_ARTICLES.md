# 🔧 Fix for "No Articles Found" Issue

## Problem
The articles table's RLS policy only allows reading (SELECT), not inserting/updating (INSERT/UPDATE). This blocks the `/api/init` endpoint from saving articles.

## Solution
Run this SQL in your Supabase SQL Editor to fix the RLS policy.

## Step 1: Open Supabase SQL Editor
Go to: https://supabase.com/dashboard/project/bljkswrtifkzumezrhqy/sql/new

## Step 2: Run This SQL

```sql
-- Fix: Allow service role to insert/update articles
-- This is needed for cron jobs and init endpoint

-- Drop existing policy
DROP POLICY IF EXISTS "Anyone can read articles" ON articles;

-- Add comprehensive policy for public access
CREATE POLICY "Public can read and write articles" ON articles
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Verify policy exists
DO $$
BEGIN
  RAISE NOTICE '====================================';
  RAISE NOTICE 'RLS policy updated for articles!';
  RAISE NOTICE 'Users can now read and write articles';
  RAISE NOTICE '====================================';
END $$;
```

## Step 3: Verify

1. After running, check the "Applied Policies" section
2. You should see: "Public can read and write articles"

## Step 4: Test

After running the SQL:
1. Refresh your local app (http://localhost:3000)
2. Click "Fetch Articles" button
3. You should see "Fetching articles from Hacker News..."
4. After ~30 seconds, articles should appear

## What This Fixes

The RLS (Row Level Security) policy was only allowing users to **read** articles, but not **insert/update** them. This blocked:
- `/api/init` - Couldn't save fetched articles
- `/api/cron/fetch-articles` - Couldn't update articles

The new policy allows all operations (SELECT, INSERT, UPDATE) on the articles table.

## Alternative: Disable RLS for Articles (Not Recommended)

If the above doesn't work, you can temporarily disable RLS for the articles table:

```sql
ALTER TABLE articles DISABLE ROW LEVEL SECURITY;
```

This allows all operations but removes security constraints.
