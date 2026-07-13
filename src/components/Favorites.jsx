import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AlgoCard from './AlgoCard'
import { getFavorites, subscribeFavoritesChange } from '../lib/favorites'

export default function Favorites() {
  const [favorites, setFavorites] = useState(() => getFavorites())

  useEffect(() => {
    const unsubscribe = subscribeFavoritesChange(() => {
      setFavorites(getFavorites())
    })
    return unsubscribe
  }, [])

  return (
    <div className="px-4 pb-16">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold theme-text-strong mb-2">
            Favorites
          </h1>
          <p className="text-sm theme-text-muted">Your saved algorithms.</p>
        </div>

        {favorites.length === 0 ? (
          <div className="rounded-2xl p-12 border theme-border theme-card text-center">
            <p className="mb-4 text-lg theme-text-muted">
              No favorite algorithms added yet
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 rounded-lg border theme-border bg-slate-50 dark:bg-slate-900 text-sm font-medium"
            >
              Explore algorithms
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map((f) => (
              <AlgoCard
                key={f.id}
                id={f.id}
                title={f.title}
                description={f.description}
                color={f.color}
                link={f.link}
                difficulty={f.difficulty}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
