import React, { useEffect, useState } from 'react'
import { StickyNote, Minimize2 } from 'lucide-react'

const loadNotes = (storageKey) => {
  if (!storageKey || typeof window === 'undefined') return ''
  try {
    return window.localStorage.getItem(storageKey) ?? ''
  } catch (error) {
    console.warn('Unable to read notes from localStorage', error)
    return ''
  }
}

const minimizedKey = (storageKey) => `${storageKey}:minimized`

const loadMinimized = (storageKey) => {
  if (!storageKey || typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(minimizedKey(storageKey)) === 'true'
  } catch (error) {
    console.warn('Unable to read notes panel state from localStorage', error)
    return false
  }
}

export default function AlgorithmNotes({ storageKey }) {
  const [notes, setNotes] = useState(() => loadNotes(storageKey))
  const [isMinimized, setIsMinimized] = useState(() =>
    loadMinimized(storageKey)
  )

  useEffect(() => {
    if (!storageKey || typeof window === 'undefined') return
    try {
      if (notes) {
        window.localStorage.setItem(storageKey, notes)
      } else {
        window.localStorage.removeItem(storageKey)
      }
    } catch (error) {
      console.warn('Unable to save notes to localStorage', error)
    }
  }, [storageKey, notes])

  useEffect(() => {
    if (!storageKey || typeof window === 'undefined') return
    try {
      window.localStorage.setItem(minimizedKey(storageKey), String(isMinimized))
    } catch (error) {
      console.warn('Unable to save notes panel state to localStorage', error)
    }
  }, [storageKey, isMinimized])

  const handleClearNotes = () => {
    if (!storageKey || typeof window === 'undefined') return
    setNotes('')
  }

  const hasSavedContent = notes.trim().length > 0

  if (isMinimized) {
    return (
      <div className="flex w-full justify-end">
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          aria-label="Expand My Notes"
          title="Expand My Notes"
          className="relative inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/90 px-4 py-3 text-cyan-300 shadow-[0_20px_60px_rgba(15,23,42,0.35)] backdrop-blur-xl transition hover:border-cyan-400 hover:text-white"
        >
          <StickyNote className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em]">
            Notes
          </span>
          {hasSavedContent && (
            <span
              aria-hidden="true"
              className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-cyan-400 ring-2 ring-slate-950"
            />
          )}
        </button>
      </div>
    )
  }

  return (
    <section className="w-full rounded-3xl border border-white/10 bg-slate-950/80 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.35)] backdrop-blur-xl transition-colors duration-200">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-base font-semibold text-white">My Notes</h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-400">
            Jot down personal observations, reminders, and learning points for
            this page. Notes are saved locally and persist after refresh.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleClearNotes}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300 transition hover:border-cyan-400 hover:text-white"
          >
            Clear Notes
          </button>
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            aria-label="Minimize My Notes"
            title="Minimize My Notes"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-500/10 text-cyan-300 shadow-[0_8px_24px_rgba(34,211,238,0.25)] transition hover:scale-105 hover:border-cyan-400 hover:bg-cyan-500/20 hover:text-white active:scale-95"
          >
            <Minimize2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <textarea
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        placeholder="Start writing your notes here..."
        className="mt-4 min-h-[180px] w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-4 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 sm:min-h-[220px]"
      />
      <p className="mt-3 text-xs text-slate-500">
        This note is stored in your browser only and is visible only on this
        device.
      </p>
    </section>
  )
}
