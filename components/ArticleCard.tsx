'use client';

import { useState, useEffect } from 'react';
import { Article } from '@/lib/hn/types';
import InteractionButtons from './InteractionButtons';

interface ArticleCardProps {
  article: Article;
  reason?: string;
  isExploration?: boolean;
  onLike: (articleId: number) => Promise<void>;
  onDislike: (articleId: number) => Promise<void>;
  onRate: (articleId: number, rating: number) => Promise<void>;
  onView: (articleId: number) => Promise<void>;
}

export default function ArticleCard({
  article,
  reason,
  isExploration = false,
  onLike,
  onDislike,
  onRate,
  onView
}: ArticleCardProps) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [viewed, setViewed] = useState(false);
  
  const domain = article.url
    ? new URL(article.url).hostname.replace('www.', '')
    : 'news.ycombinator.com';
  
  const timeAgo = formatTimeAgo(article.time);
  
  const handleClick = async () => {
    if (!viewed && article.url) {
      await onView(article.id);
      setViewed(true);
    }
    window.open(article.url || `https://news.ycombinator.com/item?id=${article.id}`, '_blank');
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 p-5 mb-4">
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
      
      <div className="mb-3">
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
          <span>by {article.author}</span>
          <span>{timeAgo}</span>
          <span className="flex items-center gap-1">
            ⬆️ {article.score} points
          </span>
          {article.descendants > 0 && (
            <span className="flex items-center gap-1">
              💬 {article.descendants}
            </span>
          )}
        </div>
      </div>
      
      <InteractionButtons
        articleId={article.id}
        liked={liked}
        disliked={disliked}
        rating={rating}
        onLike={async () => {
          await onLike(article.id);
          setLiked(true);
          setDisliked(false);
        }}
        onDislike={async () => {
          await onDislike(article.id);
          setDisliked(true);
          setLiked(false);
        }}
        onRate={async (newRating) => {
          await onRate(article.id, newRating);
          setRating(newRating);
        }}
      />
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
