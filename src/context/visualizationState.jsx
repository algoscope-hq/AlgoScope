import { useCallback, useRef } from 'react'
import { VisualizationStateContext } from './visualizationStateContext'

export const VisualizationStateProvider = ({ children }) => {
  const storeRef = useRef(new Map())

  const getState = useCallback((key, initialValue) => {
    if (!storeRef.current.has(key)) {
      storeRef.current.set(
        key,
        typeof initialValue === 'function' ? initialValue() : initialValue
      )
    }

    return storeRef.current.get(key)
  }, [])

  const setState = useCallback((key, value) => {
    const nextValue =
      typeof value === 'function' ? value(storeRef.current.get(key)) : value
    storeRef.current.set(key, nextValue)
    return nextValue
  }, [])

  return (
    <VisualizationStateContext.Provider value={{ getState, setState }}>
      {children}
    </VisualizationStateContext.Provider>
  )
}
