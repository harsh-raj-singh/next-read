# 🚀 Deployment Guide: Next Read to Vercel

## Prerequisites

Before deploying, ensure you have completed:
- [ ] Tested the app locally with `npm run dev`
- [ ] Run SQL scripts in Supabase (both schemas)
- [ ] Enable email authentication in Supabase
- [ ] Tested signup and login flows
- [ ] Verified interactions work (like/dislike/rate)
- [ ] Seen recommendations update after interactions

---

## Step 1: Supabase Setup

### 1.1 Run Database Schema

1. Go to Supabase SQL Editor:
   **https://supabase.com/dashboard/project/bljkswrtifkzumezrhqy/sql/new**

2. Run `supabase-schema.sql` (from Phase 1)

3. Run `supabase-platforms.sql` (new file in this commit)

4. Verify tables created:
   - `profiles`
   - `articles` (with platform_id column)
   - `user_interactions`
   - `recommendations`
   - `article_similarity`
   - `platforms`

### 1.2 Enable Email Authentication

1. Go to Authentication → Providers → Email
   **https://supabase.com/dashboard/project/bljkswrtifkzumezrhqy/auth/providers**

2. Settings:
   - ✅ Enabled: ON
   - ✅ Email confirmation: OFF (immediate access)
   - ✅ Double opt-in: OFF
   - ✅ Secure email change: ON
   - ✅ Enable signups: ON

### 1.3 JWT Settings (Optional)

Go to Authentication → URL Configuration:
- **JWT expiry**: Set to 604800 seconds (7 days = 1 week)
- **Site URL**: Set after deployment

---

## Step 2: Prepare for Deployment

### 2.1 Update Environment Variables

Ensure your `.env.local` has:
```env
NEXT_PUBLIC_SUPABASE_URL=https://bljkswrtifkzumezrhqy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_kT4CgRCqwg7iKIWt6WnjCA_lNco8fSB
CRON_SECRET=555f672ef8cc13cde0873a6be8cf69475ef6e5ade047d029195ad7dae3baecd7
```

### 2.2 Git Repository

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Add email/password auth and multi-platform support for Next Read

Features:
- Email/password authentication (8+ chars, immediate access)
- Landing page with platform showcase (HN + coming soon)
- Protected dashboard requiring authentication
- Multi-platform database architecture
- Platform badges on articles (hover)
- Rating only shows after like
- Logout redirects to landing page
- Migration: Anonymous data resets, users create fresh accounts

Files:
- Auth: login, signup pages, server actions, middleware
- Landing: hero, platform showcase, features grid, CTA
- Dashboard: protected feed with header
- Platform: platforms table, article platform relationships
- Components: ArticleCard with platform badge, InteractionButtons, Header
- API: Updated routes for authenticated users
"

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/recommender.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy to Vercel

### 3.1 Vercel Import

1. Go to **https://vercel.com/new**

2. Click "Continue with GitHub"

3. Authorize Vercel to access your GitHub

4. Select `recommender` repository

5. Configure Project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`
   - **Output Directory**: `.next`

6. Click "Deploy"

### 3.2 Environment Variables

After importing, add these in Vercel Dashboard → Settings → Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL = https://bljkswrtifkzumezrhqy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = sb_publishable_kT4CgRCqwg7iKIWt6WnjCA_lNco8fSB
CRON_SECRET = 555f672ef8cc13cde0873a6be8cf69475ef6e5ade047d029195ad7dae3baecd7
```

**Important**: Add `NEXT_PUBLIC_` prefix to variables (required for client-side access)

### 3.3 First-Time Setup

After deployment completes:

1. Visit your Vercel URL (e.g., `https://recommender-xxx.vercel.app`)

2. Run both SQL schemas:
   - `supabase-schema.sql` (if not done)
   - `supabase-platforms.sql` (new)

3. Initialize articles:
   - Visit: `https://recommender-xxx.vercel.app/api/init`
   - Should fetch 100 articles from Hacker News

4. Test authentication:
   - Click "Sign Up"
   - Create account
   - Should redirect to dashboard
   - Verify user created in Supabase

---

## Step 4: Verify Deployment

### 4.1 Core Features to Test

**Landing Page** (`/`)
- [ ] Page title is "Next Read"
- [ ] Hero section shows "Next Read" and tagline
- [ ] Platform showcase shows HN (active) + 3 coming soon
- [ ] "Get Started Free" and "Sign In" buttons work
- [ ] Features grid displays correctly

**Authentication** (`/login`, `/signup`)
- [ ] Login form accepts email + password (8+ chars)
- [ ] Signup form requires password confirmation
- [ ] Invalid credentials show error message
- [ ] Successful login redirects to `/dashboard`
- [ ] Successful signup redirects to `/dashboard`
- [ ] Password validation: 8+ characters required

**Dashboard** (`/dashboard`)
- [ ] Shows header with "Next Read" logo
- [ ] Shows "Dashboard" link
- [ ] Shows "Sign Out" button
- [ ] Articles display correctly
- [ ] Platform badges show on hover (HN only for now)
- [ ] Like/Dislike buttons work
- [ ] Rating stars appear only after clicking "Like"
- [ ] "Like to rate" text shows before like
- [ ] Rating persists after refresh

**Protected Routes**
- [ ] Accessing `/dashboard` while logged out redirects to `/login`
- [ ] Accessing `/login` while logged in redirects to `/dashboard`
- [ ] Logout redirects to `/` (landing page)

**API Endpoints**
- [ ] `/api/init` - Fetches articles (public)
- [ ] `/api/recommendations` - Returns personalized feed (auth required)
- [ ] `/api/interact/like` - Likes articles (auth required)
- [ ] `/api/interact/dislike` - Dislikes articles (auth required)
- [ ] `/api/interact/rate` - Rates articles (auth required)
- [ ] `/api/interact/view` - Tracks views (auth required)
- [ ] All interaction routes reject anonymous users (401)

---

## Step 5: Cron Job Verification

### 5.1 Check Cron Job

1. Go to Vercel Dashboard → Your Project → Settings → Cron Jobs

2. Verify you see:
   - Path: `/api/cron/fetch-articles`
   - Schedule: `0 */6 * * *` (every 6 hours)
   - Status: Active

### 5.2 Test Cron Job (Optional)

Simulate cron request locally to verify it works:

```bash
curl -X GET "http://localhost:3000/api/cron/fetch-articles" \
  -H "x-cron-secret: 555f672ef8cc13cde0873a6be8cf69475ef6e5ade047d029195ad7dae3baecd7"
```

Expected response:
```json
{
  "success": true,
  "message": "Successfully fetched 100 articles",
  "stats": {
    "processed": 100,
    "upserted": 95,
    "skipped": 5
  }
}
```

---

## Step 6: Custom Domain (Optional)

If you want to use a custom domain:

### 6.1 Add Domain in Vercel

1. Vercel Dashboard → Settings → Domains

2. Click "Add Domain"

3. Enter your domain (e.g., `nextread.app`)

4. Update DNS records with your domain registrar:
   - Type: CNAME
   - Name: `@`
   - Value: `cname.vercel-dns.com`

5. Wait for SSL certificate (automatic, ~5-10 min)

6. Once verified, your site is live at `https://nextread.app`

---

## Step 7: Production Checklist

### 7.1 Security

- [ ] HTTPS is enabled (automatic with Vercel)
- [ ] Supabase RLS policies are active
- [ ] User sessions use HttpOnly cookies
- [ ] Passwords are hashed by Supabase
- [ ] JWT tokens expire after 1 week
- [ ] Anonymous users cannot access protected routes
- [ ] Anonymous users cannot interact with articles

### 7.2 Data Isolation

- [ ] Each user only sees their own interactions
- [ ] Users only modify their own data
- [ ] Articles are publicly readable
- [ ] Platform badges show correct data

### 7.3 Performance

- [ ] Build completes successfully
- [ ] Page load time is < 2 seconds
- [ ] Recommendations load in < 1 second
- [ ] Cron job runs every 6 hours
- [ ] Within free tier limits (Vercel + Supabase)

---

## Step 8: Post-Deployment Monitoring

### 8.1 Vercel Analytics

1. Vercel Dashboard → Your Project → Analytics

2. Monitor:
   - Page views
   - Unique visitors
   - Top pages
   - Geographic distribution

### 8.2 Supabase Dashboard

1. Supabase Dashboard → Your Project

2. Monitor:
   - Auth users count
   - Database usage (should stay under 500MB)
   - API request count (should stay under 500K/month)
   - Database size by table

### 8.3 Cost Tracking

**Monthly Cost Estimate:**
- Vercel: $0 (within free tier)
- Supabase: $0 (within free tier)
- Total: **$0**

---

## Step 9: Troubleshooting

### 9.1 Build Fails

**Issue**: Build fails in Vercel

**Solutions**:
- Check environment variables are set correctly
- Verify `npm run build` works locally
- Check for TypeScript errors
- Clear Vercel cache: Vercel Dashboard → Deployments → Clear Cache → Redeploy

### 9.2 Auth Issues

**Issue**: Users can't log in

**Solutions**:
- Verify email auth is enabled in Supabase
- Check RLS policies allow authenticated users
- Verify user sessions are being created
- Check browser console for auth errors

### 9.3 Articles Not Appearing

**Issue**: No articles shown after signup

**Solutions**:
- Visit `/api/init` to fetch articles
- Check Supabase `articles` table has data
- Verify RLS policy allows reading articles
- Check console for API errors

### 9.4 Cron Job Not Running

**Issue**: New articles not appearing

**Solutions**:
- Verify `CRON_SECRET` is set in Vercel
- Check cron job status in Vercel Dashboard
- Manually run `/api/cron/fetch-articles` with secret header
- Check Vercel function logs

### 9.5 Anonymous Users Still Have Access

**Issue**: Anonymous users can still interact

**Solutions**:
- Verify RLS policy includes `AND NOT auth.uid() IS ANONYMOUS`
- Check middleware properly rejects anonymous users
- Verify API routes check for `user.is_anonymous`

---

## Summary

You have successfully:

✅ **Auth System**
- Email/password authentication
- 8-character minimum password
- Immediate access (no email confirmation)
- 1-week session duration
- Protected routes with middleware

✅ **User Experience**
- Clean minimal landing page
- Platform showcase (HN + coming soon)
- Rating only shows after like
- "Continue where left off" (redirects to dashboard)
- Logout to landing page

✅ **Multi-Platform Foundation**
- Platforms table created
- Articles linked to platforms
- Platform badges on articles (hover)
- Future-proof architecture for adding sources

✅ **Deployment Ready**
- All API routes protect against anonymous users
- Database schemas ready
- Vercel cron job configured
- Environment variables documented

**Next Steps:**
1. Run SQL schemas in Supabase
2. Push code to GitHub
3. Deploy to Vercel
4. Add environment variables
5. Run `/api/init` to fetch articles
6. Test all flows
7. Optional: Add custom domain

**Total Monthly Cost: $0** (Free tiers on both Vercel and Supabase)

---

## Support

If you encounter issues:
- Check build logs in Vercel Dashboard
- Check auth errors in Supabase Dashboard
- Check database queries in Supabase SQL Editor
- Review this guide's troubleshooting section

For more help, check the Next.js and Supabase documentation.
