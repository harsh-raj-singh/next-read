'use client'

import { useState } from 'react'
import PlatformBadge from '@/components/PlatformBadge'
import { formatTimeAgo, extractDomain } from './ui/formatTimeAgo'
import { interactionButtonStyles } from './ui/constants'
import { StarButton } from './ui/StarButton'

interface ArticleInteraction {
  liked: boolean
  disliked: boolean
  rating: number | null
}

interface Article {
  id: number
  title: string
  url: string | null
  by?: string
  author?: string
  time: number
  score: number
  descendants?: number
}

interface ArticleCardProps {
  article: Article
  reason?: string
  isExploration?: boolean
  onLike: (articleId: number) => void | Promise<void>
  onDislike: (articleId: number) => void | Promise<void>
  onRate: (articleId: number, rating: number) => void | Promise<void>
  onView: (articleId: number) => void | Promise<void>
  currentInteraction?: ArticleInteraction
}

export default function ArticleCard({
  article,
  reason,
  isExploration = false,
  onLike,
  onDislike,
  onRate,
  onView,
  currentInteraction,
}: ArticleCardProps) {
  const [liked, setLiked] = useState(currentInteraction?.liked ?? false)
  const [disliked, setDisliked] = useState(currentInteraction?.disliked ?? false)
  const [rating, setRating] = useState<number | null>(currentInteraction?.rating ?? null)
  const [showPlatform, setShowPlatform] = useState(false)
  const [viewed, setViewed] = useState(false)
  const [loading, setLoading] = useState(false)

  const domain = extractDomain(article.url)
  const timeAgo = formatTimeAgo(article.time)

  const handleClick = async () => {
    const url = article.url ?? `https://news.ycombinator.com/item?id=${article.id}`

    try {
      const validatedUrl = new URL(url)
      if (validatedUrl.protocol === 'javascript:' || validatedUrl.protocol === 'data:') {
        throw new Error('Invalid URL protocol')
      }

      if (!viewed && article.url) {
        await onView(article.id)
        setViewed(true)
      }
      window.open(validatedUrl.toString(), '_blank')
    } catch {
      console.error('Invalid URL:', url)
      window.open(`https://news.ycombinator.com/item?id=${article.id}`, '_blank')
    }
  }

  const handleLike = async () => {
    if (loading) return
    setLoading(true)
    await onLike(article.id)
    setLiked(true)
    setDisliked(false)
    setLoading(false)
  }

  const handleDislike = async () => {
    if (loading) return
    setLoading(true)
    await onDislike(article.id)
    setDisliked(true)
    setLiked(false)
    setLoading(false)
  }

  const handleRate = async (newRating: number) => {
    if (loading) return
    setLoading(true)
    await onRate(article.id, newRating)
    setRating(newRating)
    setLoading(false)
  }

  const likeButtonClass = liked
    ? interactionButtonStyles.activeLike
    : interactionButtonStyles.inactiveLike

  const dislikeButtonClass = disliked
    ? interactionButtonStyles.activeDislike
    : interactionButtonStyles.inactiveDislike

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
          <span className="text-xs text-gray-500">{reason}</span>
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
          <span className="font-medium text-gray-700">{domain}</span>
          <span>by {article.by ?? article.author}</span>
          <span>{timeAgo}</span>
          <span className="flex items-center gap-1">
            ⬆️ {article.score} points
          </span>
          {article.descendants && article.descendants > 0 && (
            <span className="flex items-center gap-1">
              💬 {article.descendants}
            </span>
          )}
          {showPlatform && <PlatformBadge platformName="Hacker News" />}
        </div>
      </div>

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
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarButton
                  key={star}
                  star={star}
                  isActive={(rating ?? 0) >= star}
                  onClick={() => handleRate(star)}
                  ariaLabel={`Rate ${star} stars`}
                />
              ))}
            </div>
          </div>
        ) : (
          <span className="text-sm text-gray-500">Like to rate</span>
        )}
      </div>
    </div>
  )
}
