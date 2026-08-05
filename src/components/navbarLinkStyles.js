export const getNavLinkClasses = ({ isActive = false, isDark = false } = {}) => {
  const base = [
    'group relative inline-flex items-center justify-center rounded-full px-3.5 py-2 text-sm font-semibold tracking-[0.01em] transition-all duration-300 ease-out',
    'before:absolute before:inset-x-2 before:-bottom-1 before:h-[2px] before:origin-left before:scale-x-0 before:rounded-full before:transition-transform before:duration-300',
    'hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)]',
  ]

  if (isActive) {
    base.push('bg-indigo-500/10 text-indigo-600 shadow-[0_10px_30px_rgba(99,102,241,0.12)]')
    base.push('before:scale-x-100 before:bg-indigo-500')
    if (isDark) {
      base.push('dark:bg-indigo-500/15 dark:text-indigo-300')
    }
    return base.join(' ')
  }

  base.push('text-slate-600 hover:text-slate-900 hover:bg-white/70')
  base.push('before:bg-slate-400')
  if (isDark) {
    base.push('dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-900/70')
  }

  return base.join(' ')
}
