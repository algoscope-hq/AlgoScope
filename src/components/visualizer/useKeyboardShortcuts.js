import { useEffect } from 'react'

export function useKeyboardShortcuts({
  onPlayPause,
  onStepForward,
  onStepBackward,
  onReset,
  onSpeedUp,
  onSpeedDown,
  onSlowDown,
  onHelp,
  disabled = false,
}) {
  useEffect(() => {
    const speedDownHandler = onSpeedDown ?? onSlowDown

    const handler = (e) => {
      const activeEl = document.activeElement
      const tag = activeEl?.tagName
      const isEditable = activeEl?.isContentEditable

      // 1. Ignore keystrokes when typing inside form inputs or editable areas
      if (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        isEditable
      ) {
        return
      }

      if (disabled) return

      // 2. Prevent Space bar from triggering focused buttons/links twice
      if (e.key === ' ' && (tag === 'BUTTON' || tag === 'A')) {
        e.preventDefault()
      }

      switch (e.key) {
        case ' ':
          e.preventDefault()
          onPlayPause?.()
          break
        case 'ArrowRight':
          e.preventDefault()
          onStepForward?.()
          break
        case 'ArrowLeft':
          e.preventDefault()
          onStepBackward?.()
          break
        case 'Escape':
        case 'r':
        case 'R':
          e.preventDefault()
          onReset?.()
          break
        case '+':
        case '=':
          e.preventDefault()
          onSpeedUp?.()
          break
        case '-':
        case '_':
          e.preventDefault()
          speedDownHandler?.()
          break
        case '?':
          onHelp?.()
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [
    onPlayPause,
    onStepForward,
    onStepBackward,
    onReset,
    onSpeedUp,
    onSpeedDown,
    onSlowDown,
    onHelp,
    disabled,
  ])
}