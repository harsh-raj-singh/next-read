-- Security Fixes for Next Read Database
-- Run this in Supabase SQL Editor to fix critical security vulnerabilities

-- 1. Fix articles table RLS policy - Remove public write access
DROP POLICY IF EXISTS "Public can read and write articles" ON articles;

CREATE POLICY "Public can read articles" ON articles
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Authenticated users can insert articles" ON articles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Service role can update articles" ON articles
  FOR UPDATE TO service_role USING (true);

CREATE POLICY "Service role can delete articles" ON articles
  FOR DELETE TO service_role USING (true);

-- 2. Add missing DELETE policies for user data
CREATE POLICY "Users can delete own interactions" ON user_interactions
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recommendations" ON recommendations
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 3. Add missing policy for article_similarity table
CREATE POLICY "Authenticated users can read similarity" ON article_similarity
  FOR SELECT TO authenticated USING (true);

-- 4. Add audit logging table (optional but recommended)
CREATE TABLE IF NOT EXISTS security_audit_log (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);

-- Enable RLS on audit log
ALTER TABLE security_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can insert audit logs" ON security_audit_log
  FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "Service role can read audit logs" ON security_audit_log
  FOR SELECT TO service_role USING (true);

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_interactions_user_id ON user_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_article_id ON user_interactions(article_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user_id ON recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_articles_score_time ON articles(score DESC, time DESC);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_user_id ON security_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_created_at ON security_audit_log(created_at DESC);

-- 6. Add comments for documentation
COMMENT ON POLICY "Public can read articles" ON articles IS 'Allows anonymous and authenticated users to read articles';
COMMENT ON POLICY "Authenticated users can insert articles" ON articles IS 'Allows authenticated users to insert new articles';
COMMENT ON POLICY "Service role can update articles" ON articles IS 'Only service role can update articles (for cron jobs)';
COMMENT ON POLICY "Service role can delete articles" ON articles IS 'Only service role can delete articles';