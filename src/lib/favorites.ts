export const FAVORITES_KEY = 'algo-favorites'

export interface FavoriteItem {
  id: string
  [key: string]: unknown
}

export function getFavorites(): FavoriteItem[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (err) {
    console.error('Failed to read favorites from localStorage', err)
    return []
  }
}

export function saveFavorites(list: FavoriteItem[]): void {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(list))
    window.dispatchEvent(new Event('favorites-changed'))
  } catch (err) {
    console.error('Failed to save favorites to localStorage', err)
  }
}

export function isFavoriteId(id: string): boolean {
  return getFavorites().some((favorite) => favorite.id === id)
}

export function addFavorite(item: FavoriteItem): void {
  const favorites = getFavorites()
  if (!favorites.some((favorite) => favorite.id === item.id)) {
    saveFavorites([item, ...favorites])
  }
}

export function removeFavorite(id: string): void {
  const favorites = getFavorites()
  saveFavorites(favorites.filter((favorite) => favorite.id !== id))
}

export function toggleFavorite(item: FavoriteItem): void {
  if (isFavoriteId(item.id)) {
    removeFavorite(item.id)
  } else {
    addFavorite(item)
  }
}

export function subscribeFavoritesChange(callback: () => void): () => void {
  window.addEventListener('favorites-changed', callback)
  const handleStorage = (event: StorageEvent) => {
    if (event.key === FAVORITES_KEY) callback()
  }
  window.addEventListener('storage', handleStorage)
  return () => {
    window.removeEventListener('favorites-changed', callback)
    window.removeEventListener('storage', handleStorage)
  }
}
