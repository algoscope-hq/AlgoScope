import { describe, it, expect, vi, beforeEach } from 'vitest'

// Create in-memory storage for mock database
let mockStoreData = new Map()

const mockIndex = {
  getAll: (val) => {
    const req = {
      onsuccess: null,
      onerror: null,
      result: Array.from(mockStoreData.values()).filter(
        (item) => item.algorithm === val
      ),
    }
    setTimeout(() => {
      if (req.onsuccess) req.onsuccess({ target: req })
    }, 0)
    return req
  },
}

const mockObjectStore = {
  add: (entry) => {
    mockStoreData.set(entry.id, entry)
    const req = {
      onsuccess: null,
      onerror: null,
      result: entry.id,
    }
    setTimeout(() => {
      if (req.onsuccess) req.onsuccess({ target: req })
    }, 0)
    return req
  },
  delete: (id) => {
    mockStoreData.delete(id)
    const req = {
      onsuccess: null,
      onerror: null,
    }
    setTimeout(() => {
      if (req.onsuccess) req.onsuccess({ target: req })
    }, 0)
    return req
  },
  get: (id) => {
    const req = {
      onsuccess: null,
      onerror: null,
      result: mockStoreData.get(id),
    }
    setTimeout(() => {
      if (req.onsuccess) req.onsuccess({ target: req })
    }, 0)
    return req
  },
  put: (entry) => {
    mockStoreData.set(entry.id, entry)
    const req = {
      onsuccess: null,
      onerror: null,
      result: entry.id,
    }
    setTimeout(() => {
      if (req.onsuccess) req.onsuccess({ target: req })
    }, 0)
    return req
  },
  getAll: () => {
    const req = {
      onsuccess: null,
      onerror: null,
      result: Array.from(mockStoreData.values()),
    }
    setTimeout(() => {
      if (req.onsuccess) req.onsuccess({ target: req })
    }, 0)
    return req
  },
  createIndex: vi.fn(),
  index: () => mockIndex,
}

const mockDb = {
  objectStoreNames: {
    contains: () => true,
  },
  createObjectStore: vi.fn(() => mockObjectStore),
  transaction: () => {
    const tx = {
      objectStore: () => mockObjectStore,
      oncomplete: null,
      onerror: null,
    }
    // Defer the oncomplete call to let any internal asynchronous get/put operations finish
    setTimeout(() => {
      if (tx.oncomplete) tx.oncomplete()
    }, 20)
    return tx
  },
}

const mockIndexedDB = {
  open: () => {
    const req = {
      onsuccess: null,
      onerror: null,
      onupgradeneeded: null,
      result: mockDb,
    }
    setTimeout(() => {
      if (req.onupgradeneeded)
        req.onupgradeneeded({ target: { result: mockDb } })
      if (req.onsuccess) req.onsuccess({ target: req })
    }, 0)
    return req
  },
}

// Mock globals for Vitest environment
globalThis.indexedDB = mockIndexedDB

// Mock Blob as standard ES6 class constructor
globalThis.Blob = class {
  constructor(content, options) {
    this.content = content
    this.options = options
  }
}

globalThis.URL = {
  createObjectURL: vi.fn().mockReturnValue('mock-blob-url'),
  revokeObjectURL: vi.fn(),
}

// Mock document for export test
globalThis.document = {
  createElement: vi.fn().mockReturnValue({
    href: '',
    download: '',
    click: vi.fn(),
  }),
}

// Mock FileReader for import test
globalThis.FileReader = class {
  constructor() {
    this.onload = null
    this.onerror = null
    this.result = ''
  }
  readAsText(file) {
    setTimeout(() => {
      if (file.shouldError) {
        if (this.onerror) this.onerror()
      } else {
        this.result = file.content
        if (this.onload) this.onload({ target: this })
      }
    }, 0)
  }
}

// Now import target modules
import {
  saveTestCase,
  getAllTestCases,
  deleteTestCase,
  togglePin,
  searchTestCases,
  updateUsedAt,
  exportTestCases,
  importTestCases,
} from './testCaseStore'

describe('testCaseStore', () => {
  beforeEach(() => {
    mockStoreData.clear()
    vi.clearAllMocks()
  })

  describe('saveTestCase & getAllTestCases', () => {
    it('saves a testcase and retrieves it sorted by usedAt desc', async () => {
      const tc1 = await saveTestCase({
        name: 'Merge Sort Average Case',
        algorithm: 'mergeSort',
        input: '[5, 3, 8, 4]',
        description: 'Random list',
      })

      expect(tc1.id).toBeDefined()
      expect(tc1.name).toBe('Merge Sort Average Case')
      expect(tc1.algorithm).toBe('mergeSort')
      expect(tc1.input).toBe('[5, 3, 8, 4]')
      expect(tc1.description).toBe('Random list')
      expect(tc1.pinned).toBe(false)

      await saveTestCase({
        name: 'Merge Sort Best Case',
        algorithm: 'mergeSort',
        input: '[1, 2, 3, 4]',
        description: 'Already sorted',
      })

      const all = await getAllTestCases()
      expect(all).toHaveLength(2)
      // The second one saved has a later usedAt timestamp and should be returned first
      expect(all[0].name).toBe('Merge Sort Best Case')
      expect(all[1].name).toBe('Merge Sort Average Case')
    })

    it('retrieves test cases filtered by algorithm', async () => {
      await saveTestCase({
        name: 'Binary Search Case',
        algorithm: 'binarySearch',
        input: '[1, 2, 3]',
        description: 'Small list',
      })

      await saveTestCase({
        name: 'Quick Sort Case',
        algorithm: 'quickSort',
        input: '[9, 2]',
        description: 'Small list',
      })

      const searchFiltered = await getAllTestCases('binarySearch')
      expect(searchFiltered).toHaveLength(1)
      expect(searchFiltered[0].name).toBe('Binary Search Case')
    })
  })

  describe('deleteTestCase', () => {
    it('successfully deletes a test case from the store', async () => {
      const tc = await saveTestCase({
        name: 'Test to delete',
        algorithm: 'bubbleSort',
        input: '[]',
      })

      let all = await getAllTestCases()
      expect(all).toHaveLength(1)

      await deleteTestCase(tc.id)
      all = await getAllTestCases()
      expect(all).toHaveLength(0)
    })
  })

  describe('togglePin', () => {
    it('toggles the pinned state of an existing test case', async () => {
      const tc = await saveTestCase({
        name: 'Pin Test',
        algorithm: 'quickSort',
        input: '[1, 2]',
      })

      expect(tc.pinned).toBe(false)

      const updated = await togglePin(tc.id)
      expect(updated.pinned).toBe(true)

      const reUpdated = await togglePin(tc.id)
      expect(reUpdated.pinned).toBe(false)
    })

    it('throws error when test case is not found', async () => {
      await expect(togglePin('non-existent-id')).rejects.toThrow(
        'Test case not found'
      )
    })
  })

  describe('searchTestCases', () => {
    it('returns all items when query is empty', async () => {
      await saveTestCase({ name: 'One', algorithm: 'a', input: 'i1' })
      await saveTestCase({ name: 'Two', algorithm: 'b', input: 'i2' })

      const results = await searchTestCases('')
      expect(results).toHaveLength(2)
    })

    it('filters items matching name, algorithm, input, or description case-insensitively', async () => {
      await saveTestCase({
        name: 'Bubble Sort Test',
        algorithm: 'bubbleSort',
        input: '[3, 1]',
        description: 'average',
      })
      await saveTestCase({
        name: 'Quick Sort Test',
        algorithm: 'quickSort',
        input: '[5, 2]',
        description: 'best case',
      })

      // Match name
      let results = await searchTestCases('bubble')
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('Bubble Sort Test')

      // Match algorithm
      results = await searchTestCases('quicksort')
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('Quick Sort Test')

      // Match description
      results = await searchTestCases('average')
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('Bubble Sort Test')

      // Match input
      results = await searchTestCases('[5, 2]')
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('Quick Sort Test')
    })
  })

  describe('updateUsedAt', () => {
    it('updates usedAt timestamp to current time', async () => {
      const tc = await saveTestCase({
        name: 'Timestamp update test',
        algorithm: 'bubbleSort',
        input: '[1]',
      })

      const oldUsedAt = tc.usedAt
      // Wait briefly to guarantee new Date().toISOString() will be different
      await new Promise((resolve) => setTimeout(resolve, 50))

      const updated = await updateUsedAt(tc.id)
      expect(updated.usedAt).not.toBe(oldUsedAt)
      expect(new Date(updated.usedAt).getTime()).toBeGreaterThan(
        new Date(oldUsedAt).getTime()
      )
    })

    it('throws error when test case is not found', async () => {
      await expect(updateUsedAt('invalid-id')).rejects.toThrow(
        'Test case not found'
      )
    })
  })

  describe('exportTestCases', () => {
    it('creates object URL and triggers download element click', () => {
      const testCases = [{ id: '1', name: 'Export Test' }]
      exportTestCases(testCases)

      expect(globalThis.URL.createObjectURL).toHaveBeenCalled()
      expect(globalThis.document.createElement).toHaveBeenCalledWith('a')
      expect(globalThis.URL.revokeObjectURL).toHaveBeenCalledWith(
        'mock-blob-url'
      )
    })
  })

  describe('importTestCases', () => {
    it('imports valid JSON array into database', async () => {
      const importData = [
        { name: 'Imported 1', algorithm: 'alg1', input: 'in1' },
        { name: 'Imported 2', algorithm: 'alg2', input: 'in2', pinned: true },
      ]

      const file = {
        content: JSON.stringify(importData),
        shouldError: false,
      }

      const count = await importTestCases(file)
      expect(count).toBe(2)

      const all = await getAllTestCases()
      expect(all).toHaveLength(2)
      expect(all.map((tc) => tc.name)).toContain('Imported 1')
      expect(all.map((tc) => tc.name)).toContain('Imported 2')
    })

    it('rejects if the import file is not a valid JSON array', async () => {
      const file = {
        content: JSON.stringify({ notAnArray: true }),
        shouldError: false,
      }

      await expect(importTestCases(file)).rejects.toThrow(
        'Import file must contain an array of test cases'
      )
    })

    it('rejects if FileReader encounters an error', async () => {
      const file = {
        shouldError: true,
      }

      await expect(importTestCases(file)).rejects.toThrow()
    })
  })
})
