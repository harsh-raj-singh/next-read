-- ============================================
-- HN Recommender - Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT,
  text_content TEXT,
  author TEXT,
  score INTEGER,
  time BIGINT,
  type TEXT,
  descendants INTEGER,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  tfidf_vector JSONB,
  tags TEXT[]
);

-- 3. Create user_interactions table
CREATE TABLE IF NOT EXISTS user_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  article_id BIGINT REFERENCES articles(id),
  liked BOOLEAN,
  disliked BOOLEAN,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  visit_count INTEGER DEFAULT 1,
  last_visited TIMESTAMPTZ DEFAULT NOW(),
  first_visited TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, article_id)
);

-- 4. Create recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  article_id BIGINT REFERENCES articles(id),
  content_score NUMERIC,
  collab_score NUMERIC,
  final_score NUMERIC,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, article_id)
);

-- 5. Create article_similarity table
CREATE TABLE IF NOT EXISTS article_similarity (
  article_id_1 BIGINT REFERENCES articles(id),
  article_id_2 BIGINT REFERENCES articles(id),
  similarity NUMERIC,
  PRIMARY KEY (article_id_1, article_id_2)
);

-- 6. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_articles_time ON articles(time DESC);
CREATE INDEX IF NOT EXISTS idx_articles_score ON articles(score DESC);
CREATE INDEX IF NOT EXISTS idx_user_interactions_user ON user_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_article ON user_interactions(article_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user ON recommendations(user_id);

-- 7. Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS Policies

-- Users can only see their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can view own interactions
DROP POLICY IF EXISTS "Users can view own interactions" ON user_interactions;
CREATE POLICY "Users can view own interactions" ON user_interactions
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert own interactions
DROP POLICY IF EXISTS "Users can insert own interactions" ON user_interactions;
CREATE POLICY "Users can insert own interactions" ON user_interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update own interactions
DROP POLICY IF EXISTS "Users can update own interactions" ON user_interactions;
CREATE POLICY "Users can update own interactions" ON user_interactions
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can view own recommendations
DROP POLICY IF EXISTS "Users can view own recommendations" ON recommendations;
CREATE POLICY "Users can view own recommendations" ON recommendations
  FOR SELECT USING (auth.uid() = user_id);

-- Articles are public (anyone can read)
DROP POLICY IF EXISTS "Anyone can read articles" ON articles;
CREATE POLICY "Anyone can read articles" ON articles
  FOR SELECT USING (true);

-- 9. Create trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 10. Create function to increment visit count
CREATE OR REPLACE FUNCTION public.increment_visit_count(user_id_param UUID, article_id_param BIGINT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.user_interactions (user_id, article_id, visit_count, first_visited, last_visited)
  VALUES (user_id_param, article_id_param, 1, NOW(), NOW())
  ON CONFLICT (user_id, article_id)
  DO UPDATE SET 
    visit_count = user_interactions.visit_count + 1,
    last_visited = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_visit_count(UUID, BIGINT) TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '====================================';
  RAISE NOTICE 'Database schema created successfully!';
  RAISE NOTICE '====================================';
  RAISE NOTICE 'Tables created: profiles, articles, user_interactions, recommendations, article_similarity';
  RAISE NOTICE 'RLS policies enabled and configured';
  RAISE NOTICE 'Trigger: on_auth_user_created (auto-create profiles)';
  RAISE NOTICE 'Function: increment_visit_count';
  RAISE NOTICE '====================================';
END $$;
