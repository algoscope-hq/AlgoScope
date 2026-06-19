import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { calculateStepDelay } from '../../lib/utils'

const DEFAULT_PLAYBACK_STATE = {
  steps: [],
  currentStepIndex: -1,
  isPlaying: false,
}

export function useStepPlayback({
  speed = 1,
  initialState = DEFAULT_PLAYBACK_STATE,
  onStateChange,
}) {
  const [steps, setSteps] = useState(() => initialState.steps ?? [])
  const [currentStepIndex, setCurrentStepIndex] = useState(
    () => initialState.currentStepIndex ?? -1
  )
  const [isPlaying, setIsPlaying] = useState(
    () => initialState.isPlaying ?? false
  )
  const timeoutRef = useRef(null)

  const currentStep =
    currentStepIndex >= 0 && currentStepIndex < steps.length
      ? steps[currentStepIndex]
      : null

  const hasSteps = steps.length > 0
  const isComplete = hasSteps && currentStepIndex === steps.length - 1

  useEffect(() => {
    onStateChange?.({ steps, currentStepIndex, isPlaying })
  }, [currentStepIndex, isPlaying, onStateChange, steps])

  useEffect(() => {
    if (!isPlaying || !hasSteps || currentStepIndex < 0) {
      return
    }

    if (currentStepIndex >= steps.length - 1) {
      // End reached; separate effect will handle stopping playback
      return
    }

    // Now using the centralized utility function for calculation
    const delay = calculateStepDelay(currentStep?.duration, speed)

    timeoutRef.current = window.setTimeout(() => {
      startTransition(() => {
        setCurrentStepIndex((index) =>
          index < steps.length - 1 ? index + 1 : index
        )
      })
    }, delay)

    return () => {
      window.clearTimeout(timeoutRef.current)
    }
  }, [currentStep, currentStepIndex, hasSteps, isPlaying, speed, steps.length])

  // Separate effect to stop playback when last step is reached
  useEffect(() => {
    if (isPlaying && currentStepIndex >= steps.length - 1) {
      startTransition(() => setIsPlaying(false))
    }
  }, [isPlaying, currentStepIndex, steps.length])

  const loadSteps = useCallback((nextSteps, options = {}) => {
    const { autoPlay = true } = options

    window.clearTimeout(timeoutRef.current)
    setSteps(nextSteps)
    setCurrentStepIndex(nextSteps.length > 0 ? 0 : -1)
    setIsPlaying(autoPlay && nextSteps.length > 1)
  }, [])

  const clear = useCallback(() => {
    window.clearTimeout(timeoutRef.current)
    setIsPlaying(false)
    setSteps([])
    setCurrentStepIndex(-1)
  }, [])

  const pause = useCallback(() => {
    setIsPlaying(false)
  }, [])

  const play = useCallback(() => {
    setCurrentStepIndex((idx) => {
      // Only start playing if we have steps and aren't at the end
      // We read steps.length via a ref-like approach inside the callback
      return idx // no-op, just to read state
    })
    // We need to check conditions before playing
    setIsPlaying(true)
  }, [])

  const reset = useCallback(() => {
    window.clearTimeout(timeoutRef.current)
    setIsPlaying(false)
    setCurrentStepIndex(0)
  }, [])

  const replay = useCallback(() => {
    window.clearTimeout(timeoutRef.current)
    setCurrentStepIndex(0)
    setIsPlaying(true)
  }, [])

  const stepForward = useCallback(() => {
    window.clearTimeout(timeoutRef.current)
    setIsPlaying(false)
    setCurrentStepIndex((index) => {
      if (index < 0) {
        return 0
      }
      return index + 1
    })
  }, [])

  const stepBackward = useCallback(() => {
    window.clearTimeout(timeoutRef.current)
    setIsPlaying(false)
    setCurrentStepIndex((index) => {
      return Math.max(index - 1, 0)
    })
  }, [])

  return {
    steps,
    currentStep,
    currentStepIndex,
    hasSteps,
    isComplete,
    isPlaying,
    loadSteps,
    clear,
    pause,
    play,
    reset,
    replay,
    stepForward,
    stepBackward,
  }
}
