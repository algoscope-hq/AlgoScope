import { useEffect, useState } from 'react'
import { Bookmark, BookmarkCheck, Trash2 } from 'lucide-react'
import {
  getBookmarks,
  addBookmark,
  removeBookmark,
  subscribeBookmarksChange,
} from '../lib/bookmarks'

export default function BookmarkPanel({
  algorithmName,
  currentStepIndex,
  onJumpToStep,
}) {
  const [bookmarks, setBookmarks] = useState(() =>
    getBookmarks(algorithmName)
  )

  useEffect(() => {
    setBookmarks(getBookmarks(algorithmName))
  }, [algorithmName])

  useEffect(() => {
    const unsub = subscribeBookmarksChange(algorithmName, () => {
      setBookmarks(getBookmarks(algorithmName))
    })
    return unsub
  }, [algorithmName])

  if (!algorithmName) return null

  const alreadyBookmarked = bookmarks.some(
    (b) => b.stepIndex === currentStepIndex
  )

  const handleAddBookmark = () => {
    const label = `Step ${currentStepIndex + 1} - ${algorithmName}`
    addBookmark(algorithmName, currentStepIndex, label)
  }

  const handleRemove = (bookmarkId) => {
    removeBookmark(algorithmName, bookmarkId)
  }

  const handleJump = (stepIndex) => {
    if (onJumpToStep) onJumpToStep(stepIndex)
  }

  return (
    <div className="rounded-2xl border border-slate-700/80 bg-slate-900/60 p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
          Bookmarks
        </p>
        {currentStepIndex >= 0 && (
          <button
            type="button"
            onClick={handleAddBookmark}
            disabled={alreadyBookmarked}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-cyan-500 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-40"
            title={
              alreadyBookmarked
                ? 'Step already bookmarked'
                : 'Bookmark current step'
            }
          >
            {alreadyBookmarked ? (
              <BookmarkCheck className="w-3.5 h-3.5 text-cyan-400" />
            ) : (
              <Bookmark className="w-3.5 h-3.5" />
            )}
            {alreadyBookmarked ? 'Bookmarked' : 'Bookmark'}
          </button>
        )}
      </div>

      {bookmarks.length === 0 ? (
        <p className="text-xs text-slate-500">
          No bookmarks yet. Use the bookmark button to save steps.
        </p>
      ) : (
        <ul className="space-y-1.5 max-h-48 overflow-y-auto">
          {bookmarks.map((bm) => (
            <li
              key={bm.id}
              className="flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-800/40 px-3 py-2 transition hover:border-slate-600"
            >
              <button
                type="button"
                onClick={() => handleJump(bm.stepIndex)}
                className="flex-1 text-left text-xs text-slate-300 hover:text-cyan-300 transition-colors"
                title={`Jump to Step ${bm.stepIndex + 1}`}
              >
                <span className="font-mono text-cyan-400">
                  #{bm.stepIndex + 1}
                </span>{' '}
                {bm.label.replace(` - ${algorithmName}`, '')}
              </button>
              <button
                type="button"
                onClick={() => handleRemove(bm.id)}
                className="ml-2 rounded p-1 text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Remove bookmark"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
