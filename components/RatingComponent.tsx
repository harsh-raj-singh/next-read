'use client'

import { useState } from 'react'
import { StarButton } from './ui/StarButton'

interface RatingComponentProps {
  rating: number | null
  onChange: (rating: number) => void
}

export default function RatingComponent({ rating, onChange }: RatingComponentProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null)

  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHoveredRating(null)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <StarButton
          key={star}
          star={star}
          isActive={(rating ?? 0) >= star || (hoveredRating ?? 0) >= star}
          onClick={() => onChange(star)}
          onHover={() => setHoveredRating(star)}
          ariaLabel={`Rate ${star} stars`}
        />
      ))}
    </div>
  )
}
