/**
 * Creates a standardized step object for algorithm visualizations.
 * This object represents a single frame of the animation state.
 *
 * @param {Object} params - The configuration for the current step.
 * @param {string} params.lineKey - Key mapping to the source code line to highlight.
 * @param {string} params.type - Category of the step (e.g., 'compare', 'swap', 'start').
 * @param {Array<number>} params.array - A snapshot of the array at this specific step.
 * @param {Array<number>} [params.indices=[]] - Indices currently being operated on (highlighted).
 * @param {Array<number>} [params.sortedIndices=[]] - Indices already in their final position.
 * @param {string} [params.message=''] - A descriptive string explaining the action to the user.
 * @param {Object} [params.variables={}] - Current values of algorithm variables (e.g., i, j, pivot).
 * @param {number} [params.duration] - Custom pause duration for this specific step in milliseconds.
 * @returns {Object} The formatted, deep-copied step object.
 */
export const createStep = ({
  lineKey,
  type,
  array = [],
  indices = [],
  sortedIndices = [],
  message = '',
  variables = {},
  duration,
  ...rest
}) => ({
  lineKey,
  type,
  array: [...array],
  indices,
  sortedIndices,
  message,
  variables,
  duration,
  ...rest,
})

/**
 * Calculates the playback delay for a step based on the current speed multiplier.
 * Ensures the delay does not drop below a minimum threshold for visual clarity.
 *
 * @param {number} [stepDuration=700] - The base duration assigned to the specific step.
 * @param {number} [speed=1] - The speed multiplier from the UI (e.g., 0.5, 1, 2).
 * @param {number} [minDelay=120] - The absolute minimum delay allowed in milliseconds.
 * @returns {number} The calculated delay in milliseconds.
 */
export const calculateStepDelay = (
  stepDuration = 700,
  speed = 1,
  minDelay = 120
) => {
  const baseValue = stepDuration ?? 700
  const parsedDuration = Number(baseValue)
  const safeStepDuration = isFinite(parsedDuration) ? parsedDuration : 700

  const baseSpeed = speed ?? 1
  const parsedSpeed = Number(baseSpeed)
  const safeSpeed = isFinite(parsedSpeed) ? parsedSpeed : 1

  const baseMinDelay = minDelay ?? 120
  const parsedMinDelay = Number(baseMinDelay)
  const safeMinDelay = isFinite(parsedMinDelay) ? parsedMinDelay : 120

  const adjustedSpeed = Math.max(safeSpeed, 0.1)
  const base = Math.max(0, safeStepDuration)
  return Math.max(safeMinDelay, Math.round(base / adjustedSpeed))
}

/**
 * Generates an array of random integers within a specified numerical range.
 * Used for initializing or resetting the visualizer with fresh data.
 *
 * @param {number} length - The number of elements to generate in the array.
 * @param {number} min - The minimum possible value (inclusive).
 * @param {number} max - The maximum possible value (inclusive).
 * @returns {Array<number>} An array of randomly generated integers.
 */
export const generateRandomArray = (length, min, max) => {
  const parsedLength = Math.max(0, Math.floor(Number(length) || 0))
  const safeLength = isFinite(parsedLength) ? parsedLength : 0

  let safeMin = isFinite(Number(min)) ? Math.floor(Number(min)) : 0
  let safeMax = isFinite(Number(max)) ? Math.floor(Number(max)) : 100

  if (safeMin > safeMax) {
    const temp = safeMin
    safeMin = safeMax
    safeMax = temp
  }

  return Array.from(
    { length: safeLength },
    () => Math.floor(Math.random() * (safeMax - safeMin + 1)) + safeMin
  )
}

/**
 * Swaps two elements within an array.
 * Note: This operation mutates the original array.
 *
 * @param {Array<number>} arr - The array where the swap will occur.
 * @param {number} i - The index of the first element.
 * @param {number} j - The index of the second element.
 */
export const swap = (arr, i, j) => {
  const temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}

export function formatComplex(re, im) {
  if (re === undefined) return '—'
  const r = +re.toFixed(2)
  const i = +im.toFixed(2)
  if (i === 0) return `${r}`
  if (i < 0) return `${r} − ${Math.abs(i)}i`
  return `${r} + ${i}i`
}
