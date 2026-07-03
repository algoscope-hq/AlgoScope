import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Compass, MapPin, Sparkles } from 'lucide-react'

export const WELCOME_STORAGE_KEY = 'algoscope-welcome-seen'

export const WelcomeModal = ({ isOpen, onExplore, onTakeTour }) => {
  // Prevent background scroll while the modal is open
  useEffect(() => {
    if (!isOpen) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [isOpen])

  // Allow dismissing with Escape (treated as "Explore Platform")
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onExplore()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onExplore])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9998] bg-slate-950/75 dark:bg-slate-950/85 backdrop-blur-sm"
            onClick={onExplore}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="welcome-modal-title"
              onClick={(e) => e.stopPropagation()}
              className="theme-card border border-[var(--theme-border)] rounded-3xl shadow-2xl backdrop-blur-xl w-full max-w-md p-7 sm:p-8 pointer-events-auto"
            >
              {/* Icon */}
              <div className="flex justify-center mb-5">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30">
                  <Sparkles className="w-7 h-7 text-cyan-400" />
                </div>
              </div>

              {/* Heading */}
              <h2
                id="welcome-modal-title"
                className="text-center text-2xl font-extrabold theme-text-strong tracking-tight mb-2"
              >
                Welcome to AlgoScope
              </h2>
              <p className="text-center text-sm theme-text-muted leading-relaxed mb-8 max-w-sm mx-auto">
                Watch algorithms and data structures come to life with
                interactive visualizations. New here? Take a quick tour, or jump
                straight in.
              </p>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={onTakeTour}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold theme-button-primary shadow-sm hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                >
                  <MapPin className="w-4 h-4" />
                  Take Quick Tour
                </button>
                <button
                  type="button"
                  onClick={onExplore}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold border border-[var(--theme-border)] theme-text-strong hover:bg-[var(--theme-button-secondary-hover)] transition-all cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                  Explore Platform
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default WelcomeModal