-- ============================================
-- Next Read: Multi-Platform Schema
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

-- 2. Add platform_id to articles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles'
    AND column_name = 'platform_id'
  ) THEN
    ALTER TABLE articles ADD COLUMN platform_id INTEGER REFERENCES platforms(id);
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
DROP POLICY IF EXISTS "Public can read platforms" ON platforms;
CREATE POLICY "Public can read platforms" ON platforms
  FOR SELECT USING (true);

-- 7. Create index for platform queries
CREATE INDEX IF NOT EXISTS idx_articles_platform ON articles(platform_id);
CREATE INDEX IF NOT EXISTS idx_platforms_priority ON platforms(priority DESC);

-- 8. Update RLS policies to require authenticated users
DROP POLICY IF EXISTS "Users can insert own interactions" ON user_interactions;
CREATE POLICY "Users can insert own interactions" ON user_interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id AND NOT auth.uid() IS ANONYMOUS);

DROP POLICY IF EXISTS "Users can update own interactions" ON user_interactions;
CREATE POLICY "Users can update own interactions" ON user_interactions
  FOR UPDATE USING (auth.uid() = user_id AND NOT auth.uid() IS ANONYMOUS);

DROP POLICY IF EXISTS "Users can view own interactions" ON user_interactions;
CREATE POLICY "Users can view own interactions" ON user_interactions
  FOR SELECT USING (auth.uid() = user_id AND NOT auth.uid() IS ANONYMOUS);

DROP POLICY IF EXISTS "Users can insert own interactions" ON user_interactions;
CREATE POLICY "Users can insert own interactions" ON user_interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id AND NOT auth.uid() IS ANONYMOUS);

DROP POLICY IF EXISTS "Users can view own recommendations" ON recommendations;
CREATE POLICY "Users can view own recommendations" ON recommendations
  FOR SELECT USING (auth.uid() = user_id AND NOT auth.uid() IS ANONYMOUS);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '====================================';
  RAISE NOTICE 'Multi-platform schema created!';
  RAISE NOTICE 'Platform support: Hacker News (active), others (coming soon)';
  RAISE NOTICE 'RLS policies updated: Require authenticated users';
  RAISE NOTICE '====================================';
END $$;
