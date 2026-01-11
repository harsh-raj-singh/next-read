'use client'

import { useState } from 'react';
import PlatformBadge from '@/components/PlatformBadge';

interface ArticleCardProps {
  article: any;
  reason?: string;
  isExploration?: boolean;
  onLike: (articleId: number) => Promise<void>;
  onDislike: (articleId: number) => Promise<void>;
  onRate: (articleId: number, rating: number) => Promise<void>;
  onView: (articleId: number) => Promise<void>;
  currentInteraction?: {
    liked: boolean;
    disliked: boolean;
    rating: number | null;
  };
}

export default function ArticleCard({
  article,
  reason,
  isExploration = false,
  onLike,
  onDislike,
  onRate,
  onView,
  currentInteraction
}: ArticleCardProps) {
  const [liked, setLiked] = useState(currentInteraction?.liked || false);
  const [disliked, setDisliked] = useState(currentInteraction?.disliked || false);
  const [rating, setRating] = useState<number | null>(currentInteraction?.rating || null);
  const [showRating, setShowRating] = useState(currentInteraction?.liked || false);
  const [showPlatform, setShowPlatform] = useState(false);
  const [viewed, setViewed] = useState(false);
  
  const domain = article.url
    ? new URL(article.url).hostname.replace('www.', '')
    : 'news.ycombinator.com';
  
  const timeAgo = formatTimeAgo(article.time);
  
  const handleClick = async () => {
    const url = article.url || `https://news.ycombinator.com/item?id=${article.id}`
    
    try {
      const validatedUrl = new URL(url)
      if (validatedUrl.protocol === 'javascript:' || validatedUrl.protocol === 'data:') {
        throw new Error('Invalid URL protocol')
      }
      
      if (!viewed && article.url) {
        await onView(article.id);
        setViewed(true);
      }
      window.open(validatedUrl.toString(), '_blank');
    } catch (error) {
      console.error('Invalid URL:', url)
      window.open(`https://news.ycombinator.com/item?id=${article.id}`, '_blank');
    }
  };
  
  const handleLike = async () => {
    await onLike(article.id);
    setLiked(true);
    setDisliked(false);
    setShowRating(true);
  };
  
  const handleDislike = async () => {
    await onDislike(article.id);
    setDisliked(true);
    setLiked(false);
    setShowRating(false);
  };
  
  const handleRate = async (newRating: number) => {
    await onRate(article.id, newRating);
    setRating(newRating);
  };
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 p-5 mb-4 relative"
      onMouseEnter={() => setShowPlatform(true)}
      onMouseLeave={() => setShowPlatform(false)}
    >
      {reason && (
        <div className="mb-3 flex items-center gap-2">
          {isExploration && (
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
              🎲 Exploration
            </span>
          )}
          <span className="text-xs text-gray-500">
            {reason}
          </span>
        </div>
      )}
      
      <div className="mb-3 relative">
        <h2
          onClick={handleClick}
          className="text-xl font-semibold text-gray-800 hover:text-orange-600 cursor-pointer transition-colors mb-2"
        >
          {article.title}
        </h2>
        
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="font-medium text-gray-700">
            {domain}
          </span>
          <span>by {article.by || article.author}</span>
          <span>{timeAgo}</span>
          <span className="flex items-center gap-1">
            ⬆️ {article.score} points
          </span>
          {article.descendants > 0 && (
            <span className="flex items-center gap-1">
              💬 {article.descendants}
            </span>
          )}
          {showPlatform && (
            <PlatformBadge platformName="Hacker News" />
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-4 mt-3">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
            liked
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          aria-label="Like article"
        >
          <span className="text-lg">👍</span>
          <span className="text-sm font-medium">Like</span>
        </button>
        
        <button
          onClick={handleDislike}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
            disliked
              ? 'bg-red-100 text-red-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          aria-label="Dislike article"
        >
          <span className="text-lg">👎</span>
          <span className="text-sm font-medium">Dislike</span>
        </button>
        
        {showRating ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rate:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const isActive = (rating || 0) >= star;
                return (
                  <button
                    key={star}
                    onClick={() => handleRate(star)}
                    className="text-2xl transition-transform hover:scale-110"
                    aria-label={`Rate ${star} stars`}
                  >
                    <span
                      className={
                        isActive
                          ? 'text-orange-500'
                          : 'text-gray-300'
                      }
                    >
                      ★
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <span className="text-sm text-gray-500">Like to rate</span>
        )}
      </div>
    </div>
  );
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor(Date.now() / 1000) - timestamp;
  
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 }
  ];
  
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }
  
  return 'just now';
}
