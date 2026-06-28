const COMPLETION_KEY = 'algo-completed'
const LAST_PRACTICE_KEY = 'algo-last-practice'

export function getCompletedAlgorithms() {
  try {
    const raw = localStorage.getItem(COMPLETION_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function markAlgorithmComplete(id) {
  try {
    const completed = getCompletedAlgorithms()
    if (!completed.includes(id)) {
      completed.push(id)
      localStorage.setItem(COMPLETION_KEY, JSON.stringify(completed))
    }
  } catch {
    // ignore
  }
}

export function isAlgorithmComplete(id) {
  return getCompletedAlgorithms().includes(id)
}

export function getCompletionPercentage(total) {
  const completed = getCompletedAlgorithms()
  if (!total) return 0
  return Math.round((completed.length / total) * 100)
}

export function getLastPracticeDate() {
  try {
    return localStorage.getItem(LAST_PRACTICE_KEY) || null
  } catch {
    return null
  }
}

export function updateLastPracticeDate() {
  try {
    const today = new Date().toISOString().split('T')[0]
    localStorage.setItem(LAST_PRACTICE_KEY, today)
  } catch {
    // ignore
  }
}

export function getLearningStreak() {
  try {
    const lastDate = getLastPracticeDate()
    if (!lastDate) return 0

    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    if (lastDate !== today && lastDate !== yesterday) return 0

    const streakKey = 'algo-streak'
    const raw = localStorage.getItem(streakKey)
    const streak = raw ? parseInt(raw, 10) : 0

    if (lastDate === today) return streak

    if (lastDate === yesterday) {
      const newStreak = streak + 1
      localStorage.setItem(streakKey, String(newStreak))
      updateLastPracticeDate()
      return newStreak
    }

    return streak
  } catch {
    return 0
  }
}

export function initStreakOnPractice() {
  const today = new Date().toISOString().split('T')[0]
  const lastDate = getLastPracticeDate()
  const streakKey = 'algo-streak'

  if (!lastDate) {
    localStorage.setItem(streakKey, '1')
  } else if (lastDate === today) {
    return
  } else if (
    lastDate ===
    new Date(Date.now() - 86400000).toISOString().split('T')[0]
  ) {
    const raw = localStorage.getItem(streakKey)
    const streak = raw ? parseInt(raw, 10) : 0
    localStorage.setItem(streakKey, String(streak + 1))
  } else {
    localStorage.setItem(streakKey, '1')
  }

  updateLastPracticeDate()
}

export function subscribeCompletionChange(callback) {
  window.addEventListener('completion-changed', callback)
  const handleStorage = (event) => {
    if (event.key === COMPLETION_KEY || event.key === LAST_PRACTICE_KEY) {
      callback()
    }
  }
  window.addEventListener('storage', handleStorage)
  return () => {
    window.removeEventListener('completion-changed', callback)
    window.removeEventListener('storage', handleStorage)
  }
}
