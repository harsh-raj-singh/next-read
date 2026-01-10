'use client';

import { useState, useEffect } from 'react';
import ArticleCard from '@/components/ArticleCard';
import { Recommendation } from '@/lib/hn/types';
import { ensureAnonymousUser } from '@/lib/supabase/auth-client';

export default function Home() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [interactionCount, setInteractionCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<string>('personalized');
  const [articlesInitialized, setArticlesInitialized] = useState(false);
  
  useEffect(() => {
    async function init() {
      try {
        const id = await ensureAnonymousUser();
        setUserId(id);
        await initializeArticles();
        await fetchRecommendations(id);
      } catch (err) {
        console.error('Error initializing:', err);
        setError('Failed to initialize. Please refresh the page.');
      }
    }
    
    init();
  }, []);
  
  async function initializeArticles() {
    try {
      setInitializing(true);
      const response = await fetch('/api/init');
      const data = await response.json();
      
      if (data.success && data.stats && data.stats.upserted > 0) {
        console.log(`Initialized ${data.stats.upserted} articles`);
        setArticlesInitialized(true);
      }
    } catch (err) {
      console.error('Error initializing articles:', err);
    } finally {
      setInitializing(false);
    }
  }
  
  async function fetchRecommendations(id: string) {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/recommendations?userId=${id}`);
      const data = await response.json();
      
      if (data.success) {
        setRecommendations(data.recommendations);
        setInteractionCount(data.interactionCount || 0);
        setMode(data.mode || 'personalized');
      } else {
        setError(data.error || 'Failed to fetch recommendations');
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to load recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  }
  
  async function handleLike(articleId: number) {
    if (!userId) return;
    
    try {
      await fetch('/api/interact/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, articleId })
      });
      await fetchRecommendations(userId);
    } catch (err) {
      console.error('Error liking article:', err);
    }
  }
  
  async function handleDislike(articleId: number) {
    if (!userId) return;
    
    try {
      await fetch('/api/interact/dislike', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, articleId })
      });
      await fetchRecommendations(userId);
    } catch (err) {
      console.error('Error disliking article:', err);
    }
  }
  
  async function handleRate(articleId: number, rating: number) {
    if (!userId) return;
    
    try {
      await fetch('/api/interact/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, articleId, rating })
      });
      await fetchRecommendations(userId);
    } catch (err) {
      console.error('Error rating article:', err);
    }
  }
  
  async function handleView(articleId: number) {
    if (!userId) return;
    
    try {
      await fetch('/api/interact/view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, articleId })
      });
    } catch (err) {
      console.error('Error tracking view:', err);
    }
  }
  
  if (initializing) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent mb-4"></div>
              <p className="text-gray-600">Fetching articles from Hacker News...</p>
              <p className="text-sm text-gray-500 mt-2">This may take 30-60 seconds</p>
            </div>
          </div>
        </div>
      </main>
    );
  }
  
  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent mb-4"></div>
              <p className="text-gray-600">Loading recommendations...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }
  
  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-800 mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-red-700 mb-4">{error}</p>
            <div className="space-x-2">
              <button
                onClick={async () => {
                  await initializeArticles();
                  if (userId) await fetchRecommendations(userId);
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Fetch Articles
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {mode === 'trending' ? '🔥 Trending Articles' : '🎯 For You'}
            </h2>
            <p className="text-gray-600">
              {mode === 'trending' 
                ? 'Like some articles to get personalized recommendations'
                : `${interactionCount} interactions • Personalized feed`
              }
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                await initializeArticles();
                if (userId) await fetchRecommendations(userId);
              }}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Fetch Articles
            </button>
            <button
              onClick={() => userId && fetchRecommendations(userId)}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
        
        {recommendations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No articles found
            </h3>
            <p className="text-gray-600 mb-4">
              Click "Fetch Articles" button above to get started.
            </p>
            <button
              onClick={async () => {
                await initializeArticles();
                if (userId) await fetchRecommendations(userId);
              }}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              Fetch Articles from Hacker News
            </button>
          </div>
        ) : (
          <div>
            {recommendations.map((rec) => (
              <ArticleCard
                key={rec.article.id}
                article={rec.article}
                reason={rec.reason}
                isExploration={rec.reason.includes('Exploration')}
                onLike={handleLike}
                onDislike={handleDislike}
                onRate={handleRate}
                onView={handleView}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
