import React from 'react'
import { useLocation } from 'react-router-dom'
import { ROUTE_DIFFICULTIES } from '../data/difficultyMap'
import { difficultyColors } from './difficultyColors'

export interface DifficultyBadgeProps {
  difficulty?: string
  size?: 'xs' | 'sm'
  className?: string
}

export default function DifficultyBadge({
  difficulty,
  size = 'sm',
  className = '',
}: DifficultyBadgeProps) {
  const location = useLocation()

  const activeDifficulty =
    difficulty ||
    (ROUTE_DIFFICULTIES as Record<string, string>)[location.pathname]
  if (!activeDifficulty) return null

  const styles =
    (
      difficultyColors as Record<
        string,
        { text: string; bg: string; border: string }
      >
    )[activeDifficulty] || difficultyColors.Beginner

  const sizeClasses =
    size === 'xs'
      ? 'px-1.5 py-0 text-[9px] tracking-normal'
      : 'px-2.5 py-0.5 text-[10px] tracking-wider'

  return (
    <span
      className={`inline-flex items-center rounded-full font-mono font-semibold border shrink-0 ${sizeClasses} ${styles.text} ${styles.bg} ${styles.border} ${className}`}
    >
      {activeDifficulty}
    </span>
  )
}
