import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { tourSteps } from '../data/tourSteps'

export const GuidedTour = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [rect, setRect] = useState(null)
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  )

  const padding = 8
  const spacing = 12

  // Helper to find the first visible element matching step selectors
  const getVisibleElement = (selectors) => {
    if (!selectors) return null
    const selectorList = Array.isArray(selectors) ? selectors : [selectors]
    for (const selector of selectorList) {
      const element = document.querySelector(selector)
      if (element) {
        const bounding = element.getBoundingClientRect()
        if (bounding.width > 0 && bounding.height > 0) {
          return element
        }
      }
    }
    return null
  }

  // Track window resizing for responsive layout
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Auto-start tour on first visit
  useEffect(() => {
    const completed = localStorage.getItem('algoscope-tour-completed')
    if (completed !== 'true') {
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [])

  // Update highlighted element bounding rect
  useEffect(() => {
    if (!isOpen) return

    const updateRect = () => {
      const step = tourSteps[currentStep]
      if (!step) return
      const element = getVisibleElement(step.selector)
      if (element) {
        setRect(element.getBoundingClientRect())
      } else {
        setRect(null)
      }
    }

    // Scroll element into view smoothly
    const step = tourSteps[currentStep]
    if (step) {
      const element = getVisibleElement(step.selector)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }

    updateRect()

    // Smooth coordinate synchronization during scrolling
    const scrollInterval = setInterval(updateRect, 30)
    const timeout = setTimeout(() => clearInterval(scrollInterval), 500)

    window.addEventListener('resize', updateRect)
    window.addEventListener('scroll', updateRect, { passive: true })

    return () => {
      clearInterval(scrollInterval)
      clearTimeout(timeout)
      window.removeEventListener('resize', updateRect)
      window.removeEventListener('scroll', updateRect)
    }
  }, [isOpen, currentStep])

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSkip = () => {
    handleComplete()
  }

  const handleComplete = () => {
    setIsOpen(false)
    setCurrentStep(0)
    setRect(null)
    localStorage.setItem('algoscope-tour-completed', 'true')
  }

  const getPopoverStyles = () => {
    if (!rect) {
      return {
        style: {
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '320px',
          zIndex: 9999,
        },
        arrowStyle: { display: 'none' },
        actualPlacement: 'center',
      }
    }

    // Mobile layout
    if (windowWidth < 768) {
      return {
        style: {
          position: 'fixed',
          left: '1rem',
          right: '1rem',
          bottom: '1rem',
          width: 'calc(100% - 2rem)',
          zIndex: 9999,
        },
        arrowStyle: { display: 'none' },
        actualPlacement: 'bottom-sheet',
      }
    }

    const step = tourSteps[currentStep]
    let placement = step.placement || 'bottom'

    // Adjust placement if element is too close to viewport edges
    if (placement === 'left' && rect.left < 340) {
      placement = 'bottom'
    } else if (placement === 'right' && windowWidth - rect.right < 340) {
      placement = 'bottom'
    }

    let left = 0
    let top = 0
    let transform = 'none'
    let arrowStyle = {}

    const targetCenterX = rect.left + rect.width / 2
    const targetCenterY = rect.top + rect.height / 2

    if (placement === 'bottom' || placement === 'top') {
      const safeLeft = Math.max(
        16,
        Math.min(windowWidth - 320 - 16, targetCenterX - 160)
      )
      left = safeLeft

      if (placement === 'bottom') {
        top = rect.bottom + spacing
        transform = 'none'
      } else {
        top = rect.top - spacing
        transform = 'translateY(-100%)'
      }

      // Position the arrow precisely to point at the target center
      const arrowLeft = Math.max(
        16,
        Math.min(320 - 16, targetCenterX - safeLeft)
      )
      arrowStyle = { left: `${arrowLeft}px` }
    } else if (placement === 'left') {
      left = rect.left - 320 - spacing
      top = targetCenterY
      transform = 'translateY(-50%)'
      arrowStyle = { top: '50%', transform: 'translateY(-50%) rotate(45deg)' }
    } else if (placement === 'right') {
      left = rect.right + spacing
      top = targetCenterY
      transform = 'translateY(-50%)'
      arrowStyle = { top: '50%', transform: 'translateY(-50%) rotate(45deg)' }
    }

    return {
      style: {
        position: 'fixed',
        left: `${left}px`,
        top: `${top}px`,
        transform,
        width: '320px',
        zIndex: 9999,
      },
      arrowStyle,
      actualPlacement: placement,
    }
  }

  const getArrowClass = (actualPlacement) => {
    const base = 'absolute w-3 h-3 bg-[var(--theme-surface)] z-[-1]'
    switch (actualPlacement) {
      case 'bottom':
        return `${base} border-t border-l border-[var(--theme-border)] -top-[6px]`
      case 'top':
        return `${base} border-b border-r border-[var(--theme-border)] -bottom-[6px]`
      case 'left':
        return `${base} border-t border-r border-[var(--theme-border)] -right-[6px]`
      case 'right':
        return `${base} border-b border-l border-[var(--theme-border)] -left-[6px]`
      default:
        return 'hidden'
    }
  }

  const currentStepData = tourSteps[currentStep]
  const popoverData = getPopoverStyles()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Click blocking transparent backdrop overlay */}
          <div className="fixed inset-0 z-[9996] pointer-events-auto bg-transparent" />

          {/* Cutout highlighting card */}
          {rect ? (
            <motion.div
              initial={false}
              animate={{
                left: rect.left - padding,
                top: rect.top - padding,
                width: rect.width + padding * 2,
                height: rect.height + padding * 2,
              }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              className="fixed z-[9997] rounded-xl border-2 border-indigo-500/80 shadow-[0_0_25px_rgba(99,102,241,0.55),0_0_0_9999px_rgba(2,6,23,0.75)] dark:shadow-[0_0_25px_rgba(99,102,241,0.55),0_0_0_9999px_rgba(2,6,23,0.85)] pointer-events-none"
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9997] bg-slate-950/75 dark:bg-slate-950/85 pointer-events-none"
            />
          )}

          {/* Popover Description Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={popoverData.style}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tour-step-title"
            className="theme-card border border-[var(--theme-border)] rounded-2xl p-4.5 shadow-2xl backdrop-blur-xl flex flex-col gap-3 selection:bg-cyan-500/30"
          >
            {/* Popover Arrow */}
            <div
              style={popoverData.arrowStyle}
              className={getArrowClass(popoverData.actualPlacement)}
            />

            {/* Header */}
            <div className="flex justify-between items-start gap-4">
              <h3
                id="tour-step-title"
                className="font-bold text-[13px] tracking-tight theme-text-strong font-mono uppercase"
              >
                {currentStepData.title}
              </h3>
              <button
                onClick={handleComplete}
                aria-label="Close tour"
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-0.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <p className="text-xs theme-text-muted leading-relaxed font-sans font-medium">
              {currentStepData.description}
            </p>

            {/* Footer */}
            <div className="flex justify-between items-center mt-2 pt-3 border-t border-[var(--theme-border)]">
              {/* Step indicator */}
              <span className="text-[10px] font-mono theme-text-subtle">
                {currentStep + 1} / {tourSteps.length}
              </span>

              {/* Navigation Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleSkip}
                  className="px-2.5 py-1 text-[11px] font-semibold font-mono theme-text-muted hover:theme-text-strong transition-colors cursor-pointer"
                >
                  Skip
                </button>

                {currentStep > 0 && (
                  <button
                    onClick={handlePrev}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-[var(--theme-border)] hover:bg-[var(--theme-button-secondary-hover)] transition-all flex items-center gap-0.5 theme-text-strong cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Previous
                  </button>
                )}

                <button
                  onClick={handleNext}
                  className="px-3 py-1 text-[11px] font-bold rounded-lg theme-button-primary shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-0.5 cursor-pointer"
                >
                  {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
                  {currentStep < tourSteps.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
