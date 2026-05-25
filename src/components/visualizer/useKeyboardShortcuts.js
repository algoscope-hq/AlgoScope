import { useEffect } from 'react'

export function useKeyboardShortcuts({
  onPlayPause,
  onStepForward,
  onStepBackward,
  onReset,
  onSpeedUp,
  onSlowDown,
  onHelp,
  disabled = false,
}) {
  useEffect(() => {
    const handler = (e) => {
      const tag = document.activeElement.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (disabled) return
      if (e.key === ' ' && (tag === 'BUTTON' || tag === 'A')) return
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
        case 'r':
        case 'R':
          onReset?.()
          break
        case '+':
          onSpeedUp?.()
          break
        case '-':
          onSlowDown?.()
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
    onSlowDown,
    onHelp,
    disabled,
  ])
}
