import React, { useEffect, useState } from 'react'

const loadNotes = (storageKey) => {
  if (!storageKey || typeof window === 'undefined') return ''
  try {
    return window.localStorage.getItem(storageKey) ?? ''
  } catch (error) {
    console.warn('Unable to read notes from localStorage', error)
    return ''
  }
}

export default function AlgorithmNotes({ storageKey }) {
  const [notes, setNotes] = useState(() => loadNotes(storageKey))

  useEffect(() => {
    if (!storageKey || typeof window === 'undefined') return
    try {
      window.localStorage.setItem(storageKey, notes)
    } catch (error) {
      console.warn('Unable to save notes to localStorage', error)
    }
  }, [storageKey, notes])

  const handleClearNotes = () => {
    if (!storageKey || typeof window === 'undefined') return
    window.localStorage.removeItem(storageKey)
    setNotes('')
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
        <button
          type="button"
          onClick={handleClearNotes}
          className="inline-flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300 transition hover:border-cyan-400 hover:text-white"
        >
          Clear Notes
        </button>
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
