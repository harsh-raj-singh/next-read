-- ============================================
-- Next Read: Simple Platform Schema (No Foreign Key)
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Create platforms table
CREATE TABLE IF NOT EXISTS platforms (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  url TEXT,
  icon_url TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add platform_id to articles (simple version)
-- This adds the column without a foreign key constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles'
    AND column_name = 'platform_id'
  ) THEN
    ALTER TABLE articles ADD COLUMN IF NOT EXISTS platform_id INTEGER;
  END IF;
END $$;

-- 3. Backfill existing articles (all current articles are HN)
UPDATE articles 
SET platform_id = 1 
WHERE platform_id IS NULL;

-- 4. Insert initial platforms
INSERT INTO platforms (name, slug, url, description, priority) VALUES
  ('Hacker News', 'hacker-news', 'https://news.ycombinator.com', 'Tech news and startup discussion', 1),
  ('Uber Tech Blog', 'uber-tech-blog', 'https://eng.uber.com/', 'Engineering blog from Uber', 2),
  ('Netflix Tech Blog', 'netflix-tech-blog', 'https://netflixtechblog.com/', 'Streaming technology insights', 3),
  ('Tech Newsletters', 'tech-newsletters', NULL, 'Curated technical newsletters', 4)
ON CONFLICT (slug) DO NOTHING;

-- 5. Enable RLS on platforms
ALTER TABLE platforms ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for platforms
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'platforms' 
    AND policyname = 'Public can read platforms'
  ) THEN
    CREATE POLICY "Public can read platforms" ON platforms
      FOR SELECT USING (true);
  END IF;
END $$;

-- 7. Create indexes for platform queries
CREATE INDEX IF NOT EXISTS idx_articles_platform ON articles(platform_id);
CREATE INDEX IF NOT EXISTS idx_platforms_priority ON platforms(priority DESC);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '====================================';
  RAISE NOTICE 'Platform schema created!';
  RAISE NOTICE 'Platform support: Hacker News (active), others (coming soon)';
  RAISE NOTICE '====================================';
END $$;
