# Next Read

**Your intelligent article companion** — Personalized recommendations that learn what you love to read.

## ✨ Features

- **🧠 Smart Personalization** — Learns your reading preferences through interactions
- **📚 Multi-Source Content** — Aggregates quality articles from across the web (currently Hacker News, expanding to more sources)
- **👍👎 Interactive Training** — Like, dislike, and rate articles to refine your recommendations
- **🎯 Balanced Discovery** — Mix of personalized content and exploration of new topics
- **📱 Beautiful Interface** — Clean, modern design optimized for reading
- **🔒 Privacy-First** — Your data stays yours with enterprise-grade security

## 🎯 How It Works

1. **Sign up** and start reading curated tech articles
2. **Interact** with articles (like, dislike, rate) to train your personal model
3. **Get smarter** recommendations that improve over time
4. **Discover** new topics and authors aligned with your interests

## 🛠️ Tech Overview

**Built with modern web technologies:**
- **Next.js 15** — React framework with App Router
- **Supabase** — PostgreSQL database & authentication
- **Machine Learning** — TF-IDF content analysis + user preference tracking
- **Tailwind CSS** — Beautiful, responsive UI
- **Vercel** — Cloud deployment & cron jobs

**How recommendations work:**
1. **Content Analysis** — Articles are processed using natural language processing
2. **User Profiling** — Your interactions build a unique interest profile
3. **Smart Matching** — Algorithm finds articles matching your preferences
4. **Exploration** — Introduces diverse content to prevent filter bubbles

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Supabase account (free tier works)

### Installation

```bash
# Clone the repository
git clone https://github.com/harsh-raj-singh/next-read.git
cd next-read

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase credentials to .env.local

# Run database setup
# Upload supabase-schema.sql to Supabase SQL Editor

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the app.

### Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor in your Supabase dashboard
3. Run the contents of `supabase-schema.sql`
4. Run `security-fixes.sql` for production deployment
5. Copy your Supabase credentials to `.env.local`

## 🔐 Security

This application implements enterprise-grade security:
- ✅ Row-Level Security (RLS) on all database tables
- ✅ Secure authentication with Supabase Auth
- ✅ API authorization checks on all endpoints
- ✅ Input validation and sanitization
- ✅ No sensitive data exposure in client code
- ✅ Secure database access controls

*See `CLAUDE.md` for detailed security implementation and architecture documentation.*

## 🗺️ Roadmap

**Current Release:**
- ✅ Hacker News integration
- ✅ User authentication & profiles
- ✅ Content-based recommendations
- ✅ Interaction tracking (like, dislike, rate)
- ✅ Responsive UI design

**Coming Soon:**
- 🔄 Additional content sources (tech blogs, newsletters, research papers)
- 🔄 Collaborative filtering (recommendations based on similar users)
- 🔄 Social features (share recommendations, follow users)
- 🔄 Mobile apps (iOS & Android)
- 🔄 Browser extension for quick article saving
- 🔄 Export reading history and statistics

## 📁 Project Structure

```
next-read/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Protected user routes
│   └── api/               # API endpoints
├── components/            # React components
├── lib/
│   ├── auth/             # Authentication logic
│   ├── ml/               # Machine learning algorithms
│   ├── recommendations/   # Recommendation engine
│   └── supabase/         # Database clients
├── supabase-schema.sql   # Database structure
├── security-fixes.sql    # Security policies
└── CLAUDE.md            # Detailed documentation
```

## 🤝 Contributing

We welcome contributions! Here are some ways to help:
- Add new content sources
- Improve recommendation algorithms
- Enhance UI/UX
- Report bugs and suggest features
- Improve documentation

Please read our contributing guidelines and submit pull requests to the `main` branch.

## 📝 License

MIT License — feel free to use this project for learning or building your own recommender system.

## 🙏 Acknowledgments

- **Hacker News** for providing quality tech content and API
- **Supabase** for the amazing backend infrastructure
- **Vercel** for seamless deployment
- The open-source community for the incredible tools and libraries

---

**Built with ❤️ for readers who want to spend less time searching and more time reading.**

*Live demo: [next-read-theta.vercel.app](https://next-read-theta.vercel.app)*
