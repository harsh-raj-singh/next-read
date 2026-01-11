'use client'

interface StarButtonProps {
  star: number
  isActive: boolean
  onClick: () => void
  onHover?: () => void
  ariaLabel: string
}

export function StarButton({ star, isActive, onClick, onHover, ariaLabel }: StarButtonProps) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      className="text-2xl transition-transform hover:scale-110"
      aria-label={ariaLabel}
    >
      <span className={isActive ? 'text-orange-500' : 'text-gray-300'}>★</span>
    </button>
  )
}
