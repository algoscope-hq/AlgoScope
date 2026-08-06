export interface DifficultyColorStyle {
  text: string
  bg: string
  border: string
}

export const difficultyColors: Record<string, DifficultyColorStyle> = {
  Beginner: {
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
  },
  Intermediate: {
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
  },
  Advanced: {
    text: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
  },
}
