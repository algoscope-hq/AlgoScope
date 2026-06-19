import { useCallback, useContext, useState } from 'react'
import { VisualizationStateContext } from './visualizationStateContext'

export const useVisualizationState = (key, initialValue) => {
  const context = useContext(VisualizationStateContext)

  if (!context) {
    throw new Error(
      'useVisualizationState must be used inside VisualizationStateProvider'
    )
  }

  const [state, setLocalState] = useState(() =>
    context.getState(key, initialValue)
  )

  const setPersistentState = useCallback(
    (value) => {
      setLocalState((currentValue) => {
        const nextValue =
          typeof value === 'function' ? value(currentValue) : value
        context.setState(key, nextValue)
        return nextValue
      })
    },
    [context, key]
  )

  return [state, setPersistentState]
}
