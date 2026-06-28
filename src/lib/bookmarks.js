const BOOKMARKS_PREFIX = 'algo-bookmarks-'

export function getBookmarks(algorithmName) {
  try {
    const key = BOOKMARKS_PREFIX + algorithmName
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveBookmarks(algorithmName, bookmarks) {
  try {
    const key = BOOKMARKS_PREFIX + algorithmName
    localStorage.setItem(key, JSON.stringify(bookmarks))
    window.dispatchEvent(
      new CustomEvent('bookmarks-changed', { detail: { algorithmName } })
    )
  } catch {
    // ignore
  }
}

export function addBookmark(algorithmName, stepIndex, label) {
  const bookmarks = getBookmarks(algorithmName)
  const exists = bookmarks.some((b) => b.stepIndex === stepIndex)
  if (!exists) {
    const newBookmark = { id: Date.now(), stepIndex, label, createdAt: new Date().toISOString() }
    bookmarks.push(newBookmark)
    saveBookmarks(algorithmName, bookmarks)
  }
}

export function removeBookmark(algorithmName, bookmarkId) {
  const bookmarks = getBookmarks(algorithmName).filter(
    (b) => b.id !== bookmarkId
  )
  saveBookmarks(algorithmName, bookmarks)
}

export function subscribeBookmarksChange(algorithmName, callback) {
  const handler = (event) => {
    if (!event.detail || event.detail.algorithmName === algorithmName) {
      callback()
    }
  }
  window.addEventListener('bookmarks-changed', handler)
  return () => window.removeEventListener('bookmarks-changed', handler)
}
