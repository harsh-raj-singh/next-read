'use client'

import { useState, useEffect } from 'react'
import ArticleCard from '@/components/ArticleCard'
import { Recommendation } from '@/lib/hn/types'
import { getUser } from '@/lib/auth/actions'

export default function DashboardPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [likedArticles, setLikedArticles] = useState<any[]>([]);
  const [userInteractions, setUserInteractions] = useState<Map<number, any>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [interactionCount, setInteractionCount] = useState<number>(0);
  const [mode, setMode] = useState<string>('personalized');
  const [activeTab, setActiveTab] = useState<string>('feed');
  
  useEffect(() => {
    async function init() {
      try {
        const user = await getUser();
        if (!user) {
          setError('Please sign in to view your dashboard');
          setLoading(false);
          return;
        }
        
        setUserId(user.id);
        await Promise.all([fetchRecommendations(user.id), fetchLikedArticles(user.id), fetchUserInteractions(user.id)]);
      } catch (err) {
        console.error('Error initializing dashboard:', err);
        setError('Failed to load. Please refresh.');
      }
    }
    
    init();
  }, []);
  
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
        setError(data.error || 'Failed to load recommendations');
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to load. Please try again.');
    } finally {
      setLoading(false);
    }
  }
  
  async function handleLike(articleId: number) {
    if (!userId) return;
    
    try {
      const response = await fetch('/api/interact/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, articleId })
      });
      
      if (response.ok) {
        setInteractionCount(prev => prev + 1);
        await Promise.all([fetchLikedArticles(userId), fetchUserInteractions(userId)]);
      }
    } catch (err) {
      console.error('Error liking article:', err);
    }
  }
  
  async function handleDislike(articleId: number) {
    if (!userId) return;
    
    try {
      const response = await fetch('/api/interact/dislike', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, articleId })
      });
      
      if (response.ok) {
        setInteractionCount(prev => prev + 1);
        await Promise.all([fetchLikedArticles(userId), fetchUserInteractions(userId)]);
      }
    } catch (err) {
      console.error('Error disliking article:', err);
    }
  }
  
  async function handleRate(articleId: number, rating: number) {
    if (!userId) return;
    
    try {
      const response = await fetch('/api/interact/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, articleId, rating })
      });
      
      if (response.ok) {
        setInteractionCount(prev => prev + 1);
        await Promise.all([fetchLikedArticles(userId), fetchUserInteractions(userId)]);
      }
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
  
  async function fetchLikedArticles(id: string) {
    try {
      const response = await fetch(`/api/liked?userId=${id}`);
      const data = await response.json();
      if (data.success) {
        setLikedArticles(data.articles || []);
      }
    } catch (err) {
      console.error('Error fetching liked articles:', err);
    }
  }
  
  async function fetchUserInteractions(id: string) {
    try {
      const response = await fetch(`/api/interactions?userId=${id}`);
      const data = await response.json();
      if (data.success) {
        const interactionsMap = new Map();
        data.interactions.forEach((interaction: any) => {
          interactionsMap.set(interaction.article_id, {
            liked: interaction.liked,
            disliked: interaction.disliked,
            rating: interaction.rating
          });
        });
        setUserInteractions(interactionsMap);
      }
    } catch (err) {
      console.error('Error fetching user interactions:', err);
    }
  }
  
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent mb-4"></div>
            <p className="text-gray-600">Loading your personalized feed...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => userId && fetchRecommendations(userId)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-4 border-b border-gray-200 mb-4">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'feed'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            📰 Feed
          </button>
          <button
            onClick={() => setActiveTab('liked')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'liked'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            ❤️ Liked ({likedArticles.length})
          </button>
        </div>
        
        {activeTab === 'feed' && (
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {mode === 'trending' ? '🔥 Trending Articles' : '🎯 For You'}
              </h2>
              <p className="text-gray-600 text-sm">
                {mode === 'trending' 
                  ? 'Like some articles to get personalized recommendations'
                  : `${interactionCount} interactions • Personalized feed`
                }
                {' '}• Click refresh for new recommendations
              </p>
            </div>
            <button
              onClick={() => userId && fetchRecommendations(userId)}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Loading...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </>
              )}
            </button>
          </div>
        )}
        
        {activeTab === 'liked' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              ❤️ Your Liked Articles
            </h2>
            <p className="text-gray-600 text-sm">
              {likedArticles.length} articles you've liked
            </p>
          </div>
        )}
      </div>
      
      {activeTab === 'feed' && recommendations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No articles found
          </h3>
          <p className="text-gray-600 mb-4">
            Click the button below to fetch articles from Hacker News.
          </p>
          <a
            href="/api/init"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium inline-block"
          >
              Initialize Articles
            </a>
          </div>
        ) : activeTab === 'feed' ? (
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
                currentInteraction={userInteractions.get(rec.article.id)}
              />
            ))}
          </div>
        ) : activeTab === 'liked' && likedArticles.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No liked articles yet
            </h3>
            <p className="text-gray-600">
              Start liking articles to build your collection!
            </p>
          </div>
        ) : activeTab === 'liked' && (
          <div>
            {likedArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                reason="Liked by you"
                isExploration={false}
                onLike={handleLike}
                onDislike={handleDislike}
                onRate={handleRate}
                onView={handleView}
                currentInteraction={userInteractions.get(article.id)}
              />
            ))}
          </div>
        )}
    </div>
  );
}