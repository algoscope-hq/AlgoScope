// Type definitions for AlgoScope SDK

// src/lib/utils.js
export interface StepParams {
  lineKey: string
  type: string
  array?: number[]
  indices?: number[]
  sortedIndices?: number[]
  message?: string
  variables?: Record<string, any>
  duration?: number
  [key: string]: any
}

export interface StepResult {
  lineKey: string
  type: string
  array: number[]
  indices: number[]
  sortedIndices: number[]
  message: string
  variables: Record<string, any>
  duration?: number
  [key: string]: any
}

export function createStep(params: StepParams): StepResult

export function calculateStepDelay(
  stepDuration?: number,
  speed?: number,
  minDelay?: number
): number

export function generateRandomArray(
  length: number,
  min: number,
  max: number
): number[]

export function swap(arr: number[], i: number, j: number): void

export function formatComplex(re?: number, im?: number): string

// src/lib/favorites.js
export const FAVORITES_KEY: string

export interface FavoriteItem {
  id: string
  [key: string]: any
}

export function getFavorites(): FavoriteItem[]

export function saveFavorites(list: FavoriteItem[]): void

export function isFavoriteId(id: string): boolean

export function addFavorite(item: FavoriteItem): void

export function removeFavorite(id: string): void

export function toggleFavorite(item: FavoriteItem): void

export function subscribeFavoritesChange(callback: () => void): () => void

// src/lib/testCaseStore.js
export interface TestCaseParams {
  id?: string
  name: string
  algorithm: string
  input: string
  description?: string
  pinned?: boolean
  createdAt?: string
  usedAt?: string
}

export interface TestCaseEntry {
  id: string
  name: string
  algorithm: string
  input: string
  description: string
  pinned: boolean
  createdAt: string
  usedAt: string
}

export function buildTestCaseEntry(params: TestCaseParams): TestCaseEntry

export function saveTestCase(params: {
  name: string
  algorithm: string
  input: string
  description?: string
}): Promise<TestCaseEntry>

export function getAllTestCases(
  algorithm?: string | null
): Promise<TestCaseEntry[]>

export function deleteTestCase(id: string): Promise<void>

export function togglePin(id: string): Promise<TestCaseEntry>

export function searchTestCases(query: string): Promise<TestCaseEntry[]>

export function updateUsedAt(id: string): Promise<TestCaseEntry>

export function exportTestCases(testcases: TestCaseEntry[]): void

export function importTestCases(file: File): Promise<{
  success: number
  skipped: number
}>

// src/lib/version.js
export const APP_VERSION: string
