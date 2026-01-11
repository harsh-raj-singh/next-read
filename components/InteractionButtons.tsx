'use client'

import { useState } from 'react'
import RatingComponent from './RatingComponent'
import { interactionButtonStyles } from './ui/constants'

type InteractionState = 'idle' | 'liked' | 'disliked'

interface InteractionButtonsProps {
  liked: boolean
  disliked: boolean
  rating: number | null
  onLike: () => void | Promise<void>
  onDislike: () => void | Promise<void>
  onRate: (rating: number) => void | Promise<void>
}

export default function InteractionButtons({
  liked,
  disliked,
  rating,
  onLike,
  onDislike,
  onRate,
}: InteractionButtonsProps) {
  const [loading, setLoading] = useState(false)

  const handleLike = async () => {
    if (loading) return
    setLoading(true)
    await onLike()
    setLoading(false)
  }

  const handleDislike = async () => {
    if (loading) return
    setLoading(true)
    await onDislike()
    setLoading(false)
  }

  const handleRate = async (newRating: number) => {
    if (loading) return
    setLoading(true)
    await onRate(newRating)
    setLoading(false)
  }

  const likeButtonClass = liked
    ? interactionButtonStyles.activeLike
    : interactionButtonStyles.inactiveLike

  const dislikeButtonClass = disliked
    ? interactionButtonStyles.activeDislike
    : interactionButtonStyles.inactiveDislike

  return (
    <div className="flex items-center gap-4 mt-3">
      <button
        onClick={handleLike}
        disabled={loading}
        className={`${interactionButtonStyles.base} ${likeButtonClass}`}
        aria-label="Like article"
      >
        <span className="text-lg">👍</span>
        <span className="text-sm font-medium">Like</span>
      </button>

      <button
        onClick={handleDislike}
        disabled={loading}
        className={`${interactionButtonStyles.base} ${dislikeButtonClass}`}
        aria-label="Dislike article"
      >
        <span className="text-lg">👎</span>
        <span className="text-sm font-medium">Dislike</span>
      </button>

      {liked ? (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Rate:</span>
          <RatingComponent rating={rating} onChange={handleRate} />
        </div>
      ) : (
        <span className="text-sm text-gray-500">Like to rate</span>
      )}
    </div>
  )
}
