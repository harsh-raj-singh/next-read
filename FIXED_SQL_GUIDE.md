# 🔧 Fixed SQL for Supabase

## Error You're Seeing

**"policy already exists"** - The policy from Phase 1 conflicts
**"IS ANONYMOUS syntax error"** - This doesn't exist in PostgreSQL
**"Operational mode changed"** - System updated from read-only mode

## ✅ Fixed SQL File

I've created a new `supabase-platforms-fixed.sql` file that:

### **What Changed:**

1. **Uses DROP POLICY IF EXISTS**
   - Safely removes old policies without error
   - Handles the "already exists" issue

2. **Removed IS ANONYMOUS clause**
   - No invalid syntax
   - API routes handle anonymous rejection instead

3. **Simplified RLS Policies**
   - Authenticated users can: SELECT, INSERT, UPDATE
   - Public users can: SELECT only (can read, can't modify)
   - Anonymous users are handled in API routes (401 errors)

### **New Policies:**

**Articles Table:**
```sql
CREATE POLICY "Authenticated users can read articles" ON articles
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert articles" ON articles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update articles" ON articles
  FOR UPDATE USING (auth.uid() = user_id);
```

**User Interactions Table:**
```sql
CREATE POLICY "Authenticated users can insert interactions" ON user_interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update interactions" ON user_interactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view interactions" ON user_interactions
  FOR SELECT USING (auth.uid() = user_id);
```

---

## 📋 How to Run

### **Option 1: Clear Everything & Rebuild (Recommended)**

1. In Supabase SQL Editor, run this to DROP all policies:
```sql
DROP POLICY IF EXISTS "Public can read and write articles" ON articles;
DROP POLICY IF EXISTS "Public can read articles" ON articles;
DROP POLICY IF EXISTS "Users can insert own interactions" ON user_interactions;
DROP POLICY IF EXISTS "Users can update own interactions" ON user_interactions;
DROP POLICY IF EXISTS "Users can view own interactions" ON user_interactions;
DROP POLICY IF EXISTS "Users can insert own interactions" ON user_interactions;
DROP POLICY IF EXISTS "Users can view own recommendations" ON recommendations;
```

2. Then run the new fixed file: `supabase-platforms-fixed.sql`

### **Option 2: Just Run the Fixed File**

Run `supabase-platforms-fixed.sql` - it includes the DROP POLICY IF EXISTS statements so it should work even if policies already exist.

---

## ✅ What the Fixed File Does

1. **Creates platforms table** (HN + 3 coming soon)
2. **Adds platform_id column** to articles table
3. **Backfills** all existing articles as HN platform
4. **Creates clean RLS policies** for all tables
5. **Creates indexes** for performance

---

## 🎯 After Running the SQL

1. Check platforms table in Table Editor
2. Verify all articles have `platform_id = 1`
3. Verify RLS policies exist and look correct
4. Test the app locally - interactions should work for authenticated users

---

## 🔒 Important Notes

- **Anonymous users**: Can still browse articles but cannot like/dislike/rate (handled by API)
- **Authenticated users**: Full access to all features
- **Platform badges**: Will show "Hacker News" for all current articles
- **Coming soon platforms**: Already in database (Uber, Netflix, Tech Newsletters) - just need fetchers later

Run the fixed SQL and try again!
