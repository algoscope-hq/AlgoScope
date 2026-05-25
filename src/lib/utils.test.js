import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  createStep,
  calculateStepDelay,
  generateRandomArray,
  swap,
} from './utils'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('createStep', () => {
  it('returns a normalized step object with defaults and custom fields', () => {
    const step = createStep({
      lineKey: 'line1',
      type: 'compare',
      array: [3, 1],
      variables: { i: 0 },
      customFlag: true,
    })

    expect(step).toEqual({
      lineKey: 'line1',
      type: 'compare',
      array: [3, 1],
      indices: [],
      sortedIndices: [],
      message: '',
      variables: { i: 0 },
      duration: undefined,
      customFlag: true,
    })
  })

  it('copies the array snapshot to avoid reference sharing', () => {
    const inputArray = [5, 2, 9]
    const step = createStep({ lineKey: 'x', type: 'start', array: inputArray })

    inputArray[0] = 99

    expect(step.array).toEqual([5, 2, 9])
    expect(step.array).not.toBe(inputArray)
  })
})

describe('calculateStepDelay', () => {
  it('uses defaults when no arguments are provided', () => {
    expect(calculateStepDelay()).toBe(700)
  })

  it('applies speed multiplier and rounds to nearest integer', () => {
    expect(calculateStepDelay(1000, 2, 120)).toBe(500)
    expect(calculateStepDelay(1000, 3, 120)).toBe(333)
  })

  it('enforces minimum delay boundary', () => {
    expect(calculateStepDelay(20, 10, 120)).toBe(120)
  })

  it('clamps very low speed to 0.1 to prevent runaway delay', () => {
    expect(calculateStepDelay(700, 0, 120)).toBe(7000)
  })

  it('falls back to default base duration when stepDuration is nullish', () => {
    expect(calculateStepDelay(undefined, 1, 120)).toBe(700)
    expect(calculateStepDelay(null, 1, 120)).toBe(700)
  })

  it('gracefully handles non-numeric and NaN parameters', () => {
    expect(calculateStepDelay('1000', '2', '120')).toBe(500)
    expect(calculateStepDelay(NaN, 1, 120)).toBe(700)
    expect(calculateStepDelay(1000, NaN, 120)).toBe(1000)
    expect(calculateStepDelay(1000, 2, NaN)).toBe(500)
  })
})

describe('generateRandomArray', () => {
  it('returns expected length and keeps all values within min/max bounds', () => {
    const randomSpy = vi
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.49)
      .mockReturnValueOnce(0.9999)

    const result = generateRandomArray(3, 10, 12)

    expect(result).toEqual([10, 11, 12])
    expect(result).toHaveLength(3)
    expect(result.every((n) => n >= 10 && n <= 12)).toBe(true)
    expect(randomSpy).toHaveBeenCalledTimes(3)
  })

  it('returns an empty array for zero length', () => {
    expect(generateRandomArray(0, 1, 5)).toEqual([])
  })

  it('handles negative lengths by returning an empty array', () => {
    expect(generateRandomArray(-5, 1, 10)).toEqual([])
  })

  it('handles range inversion (min > max) by swapping bounds', () => {
    const result = generateRandomArray(10, 20, 10)
    expect(result).toHaveLength(10)
    expect(result.every((n) => n >= 10 && n <= 20)).toBe(true)
  })

  it('gracefully parses string representations of numbers', () => {
    const result = generateRandomArray('3', '5', '8')
    expect(result).toHaveLength(3)
    expect(result.every((n) => n >= 5 && n <= 8)).toBe(true)
  })

  it('handles NaN and non-finite parameters gracefully', () => {
    expect(generateRandomArray(NaN, 1, 5)).toEqual([])
    const result = generateRandomArray(5, NaN, NaN)
    expect(result).toHaveLength(5)
  })
})

describe('swap', () => {
  it('swaps two different indices in place', () => {
    const arr = [1, 2, 3]
    swap(arr, 0, 2)
    expect(arr).toEqual([3, 2, 1])
  })

  it('keeps array unchanged when swapping the same index', () => {
    const arr = [4, 5, 6]
    swap(arr, 1, 1)
    expect(arr).toEqual([4, 5, 6])
  })
})
