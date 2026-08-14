import { describe, it, expect } from 'vitest'
import {
  CHEATSHEET_ALGORITHMS,
  getNormalizedAlgorithms,
  getCategories,
  filterAlgorithms,
  normalizeAlgorithm,
} from './cheatsheetData'

describe('cheatsheetData', () => {
  it('contains valid raw algorithms array', () => {
    expect(Array.isArray(CHEATSHEET_ALGORITHMS)).toBe(true)
    expect(CHEATSHEET_ALGORITHMS.length).toBeGreaterThan(20)
  })

  it('normalizes algorithms without missing complexity values or pseudocodes', () => {
    const normalized = getNormalizedAlgorithms()
    expect(normalized.length).toBe(CHEATSHEET_ALGORITHMS.length)

    normalized.forEach((algo) => {
      expect(algo.id).toBeTruthy()
      expect(algo.name).toBeTruthy()
      expect(algo.category).toBeTruthy()
      expect(algo.time).toBeDefined()
      expect(algo.time.best).toMatch(/^O\(/)
      expect(algo.time.average).toMatch(/^O\(/)
      expect(algo.time.worst).toMatch(/^O\(/)
      expect(algo.space).toMatch(/^O\(/)
      expect(algo.pseudocode).toBeTruthy()
      expect(typeof algo.pseudocode).toBe('string')
    })
  })

  it('provides fallback values for incomplete metadata', () => {
    const incomplete = {
      id: 'custom-test',
      name: 'Custom Test Algorithm',
      category: 'Other',
    }
    const normalized = normalizeAlgorithm(incomplete)

    expect(normalized.time.best).toBe('O(1)')
    expect(normalized.time.average).toBe('O(N)')
    expect(normalized.time.worst).toBe('O(N)')
    expect(normalized.space).toBe('O(1)')
    expect(normalized.pseudocode).toContain('Pseudocode available')
  })

  it('extracts unique categories including "All"', () => {
    const categories = getCategories()
    expect(categories[0]).toBe('All')
    expect(categories).toContain('Sorting')
    expect(categories).toContain('Graph')
    expect(categories).toContain('Dynamic Programming')
    expect(categories).toContain('Backtracking')
    expect(categories).toContain('Strings')
  })

  it('filters algorithms by category and search query', () => {
    const algorithms = getNormalizedAlgorithms()

    const allResult = filterAlgorithms(algorithms, 'All', '')
    expect(allResult.length).toBe(algorithms.length)

    const sortingResult = filterAlgorithms(algorithms, 'Sorting', '')
    expect(sortingResult.every((a) => a.category === 'Sorting')).toBe(true)
    expect(sortingResult.length).toBeGreaterThan(5)

    const searchResult = filterAlgorithms(algorithms, 'All', 'quick')
    expect(searchResult.some((a) => a.name === 'Quick Sort')).toBe(true)

    const emptyResult = filterAlgorithms(algorithms, 'Sorting', 'nonexistenttermxyz')
    expect(emptyResult.length).toBe(0)
  })

  it('resolves fractional-knapsack to dedicated complexity metadata', () => {
    const rawItem = CHEATSHEET_ALGORITHMS.find((a) => a.id === 'fractional-knapsack')
    expect(rawItem).toBeDefined()
    expect(rawItem.complexityKey).toBe('fractionalknapsack')

    const normalized = getNormalizedAlgorithms().find((a) => a.id === 'fractional-knapsack')
    expect(normalized).toBeDefined()
    expect(normalized.time.best).toBe('O(N log N)')
    expect(normalized.time.average).toBe('O(N log N)')
    expect(normalized.time.worst).toBe('O(N log N)')
    expect(normalized.space).toBe('O(N)')
  })

  it('uses terminating floor condition in radix-sort pseudocode', () => {
    const radixSort = CHEATSHEET_ALGORITHMS.find((a) => a.id === 'radix-sort')
    expect(radixSort).toBeDefined()
    expect(radixSort.pseudocode).toContain('while floor(maxVal / exp) > 0:')
  })
})
