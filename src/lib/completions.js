const STORAGE_KEY = 'algoscope-completions'

export function getCompletions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function markCompleted(id) {
  const current = getCompletions()
  if (!current.includes(id)) {
    current.push(id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current))
    window.dispatchEvent(new Event('completions-changed'))
  }
}

export function isCompleted(id) {
  return getCompletions().includes(id)
}

export function getCompletionCount() {
  return getCompletions().length
}

export function subscribeCompletionsChange(fn) {
  window.addEventListener('completions-changed', fn)
  return () => window.removeEventListener('completions-changed', fn)
}
