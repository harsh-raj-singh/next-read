'use client'

import StarRating from './RatingComponent'
import { useState } from 'react';

interface InteractionButtonsProps {
  articleId: number;
  liked: boolean;
  disliked: boolean;
  rating: number | null;
  onLike: () => void;
  onDislike: () => void;
  onRate: (rating: number) => void;
}

export default function InteractionButtons({
  articleId,
  liked,
  disliked,
  rating,
  onLike,
  onDislike,
  onRate
}: InteractionButtonsProps) {
  const [loading, setLoading] = useState(false);
  const [showRating, setShowRating] = useState(liked);
  
  const handleLike = async () => {
    if (loading) return;
    setLoading(true);
    await onLike();
    setShowRating(true);
    setLoading(false);
  };
  
  const handleDislike = async () => {
    if (loading) return;
    setLoading(true);
    await onDislike();
    setShowRating(false);
    setLoading(false);
  };
  
  const handleRate = async (newRating: number) => {
    if (loading) return;
    setLoading(true);
    await onRate(newRating);
    setLoading(false);
  };
  
  return (
    <div className="flex items-center gap-4 mt-3">
      <button
        onClick={handleLike}
        disabled={loading}
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
        disabled={loading}
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
        <StarRating rating={rating} onChange={handleRate} />
      ) : (
        <span className="text-sm text-gray-500">Like to rate</span>
      )}
    </div>
  );
}
