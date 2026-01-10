'use client'

import { useState } from 'react';

interface StarRatingProps {
  rating: number | null;
  onChange: (rating: number) => void;
}

export default function StarRating({ rating, onChange }: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = (rating || 0) >= star;
        const isHovered = (hoveredRating || 0) >= star;
        
        return (
          <button
            key={star}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(null)}
            className="text-2xl transition-transform hover:scale-110"
            aria-label={`Rate ${star} stars`}
          >
            <span
              className={
                isActive || isHovered
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
  );
}
