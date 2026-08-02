import { describe, expect, it } from 'vitest'
import {
  CATEGORIES,
  DIFFICULTIES,
  QUESTION_BANK,
  getFilteredQuestions,
  pickQuestionsBatch,
} from './challengeQuestions'

describe('Challenge Questions Bank', () => {
  it('contains at least 50 high-quality questions', () => {
    expect(QUESTION_BANK.length).toBeGreaterThanOrEqual(50)
  })

  it('has valid structure for all questions', () => {
    const categoryIds = new Set(CATEGORIES.map((c) => c.id))
    const difficultyIds = new Set(DIFFICULTIES.map((d) => d.id))

    QUESTION_BANK.forEach((q) => {
      expect(q.id).toBeDefined()
      expect(typeof q.id).toBe('string')
      expect(q.question).toBeDefined()
      expect(q.question.length).toBeGreaterThan(5)

      expect(Array.isArray(q.options)).toBe(true)
      expect(q.options.length).toBe(4)

      expect(q.correctIndex).toBeGreaterThanOrEqual(0)
      expect(q.correctIndex).toBeLessThan(4)

      expect(q.explanation).toBeDefined()
      expect(q.explanation.length).toBeGreaterThan(10)

      expect(categoryIds.has(q.category)).toBe(true)
      expect(difficultyIds.has(q.difficulty)).toBe(true)
    })
  })

  it('filters questions by category and difficulty accurately', () => {
    const sortingEasy = getFilteredQuestions('sorting', 'easy')
    sortingEasy.forEach((q) => {
      expect(q.category).toBe('sorting')
      expect(q.difficulty).toBe('easy')
    })
  })

  it('picks question batches correctly', () => {
    const batch = pickQuestionsBatch({ category: 'all', difficulty: 'all', count: 10 })
    expect(batch.length).toBe(10)
  })

  it('supports adaptive question picking mode', () => {
    const adaptiveBatch = pickQuestionsBatch({ category: 'all', difficulty: 'all', count: 10, adaptive: true })
    expect(adaptiveBatch.length).toBe(10)
  })
})
