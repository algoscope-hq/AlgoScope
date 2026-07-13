const DB_NAME = 'algoscope-testcases'
const VERSION = 1
const STORE_NAME = 'testcases'

function openDB() {
  if (typeof indexedDB === 'undefined') {
    return Promise.reject(
      new Error('IndexedDB is not available in this environment')
    )
  }

  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION)

    req.onupgradeneeded = (e) => {
      const db = e.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        store.createIndex('algorithm', 'algorithm', { unique: false })
        store.createIndex('pinned', 'pinned', { unique: false })
      }
    }

    req.onsuccess = (e) => resolve(e.target.result)
    req.onerror = (e) => reject(e.target.error)
  })
}

function sortByUsedAtDesc(testCases) {
  return [...testCases].sort(
    (a, b) =>
      new Date(b.usedAt || b.createdAt || 0) -
      new Date(a.usedAt || a.createdAt || 0)
  )
}

function safeText(value) {
  return typeof value === 'string' ? value : value == null ? '' : String(value)
}

export function buildTestCaseEntry({
  id,
  name,
  algorithm,
  input,
  description = '',
  pinned = false,
  createdAt,
  usedAt,
}) {
  const now = new Date().toISOString()

  return {
    id: id || `tc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: safeText(name).trim(),
    algorithm: safeText(algorithm).trim(),
    input: safeText(input),
    description: safeText(description),
    pinned: Boolean(pinned),
    createdAt: createdAt || now,
    usedAt: usedAt || now,
  }
}

export async function saveTestCase({
  name,
  algorithm,
  input,
  description = '',
}) {
  const db = await openDB()
  const entry = buildTestCaseEntry({ name, algorithm, input, description })

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).add(entry)
    tx.oncomplete = () => resolve(entry)
    tx.onerror = (e) => reject(e.target.error)
  })
}

export async function getAllTestCases(algorithm = null) {
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const req = algorithm
      ? store.index('algorithm').getAll(algorithm)
      : store.getAll()

    req.onsuccess = () => resolve(sortByUsedAtDesc(req.result))
    req.onerror = (e) => reject(e.target.error)
  })
}

export async function deleteTestCase(id) {
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).delete(id)
    tx.oncomplete = resolve
    tx.onerror = (e) => reject(e.target.error)
  })
}

export async function togglePin(id) {
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const req = store.get(id)

    req.onsuccess = () => {
      const entry = req.result
      if (!entry) {
        reject(new Error('Test case not found'))
        return
      }

      entry.pinned = !entry.pinned
      store.put(entry)
      tx.oncomplete = () => resolve(entry)
    }

    req.onerror = (e) => reject(e.target.error)
  })
}

export async function searchTestCases(query) {
  const all = await getAllTestCases()
  const q = safeText(query).trim().toLowerCase()

  if (!q) return all

  return all.filter((tc) => {
    const name = safeText(tc.name).toLowerCase()
    const algorithm = safeText(tc.algorithm).toLowerCase()
    const input = safeText(tc.input).toLowerCase()
    const description = safeText(tc.description).toLowerCase()

    return (
      name.includes(q) ||
      algorithm.includes(q) ||
      input.includes(q) ||
      description.includes(q)
    )
  })
}

export async function updateUsedAt(id) {
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const req = store.get(id)

    req.onsuccess = () => {
      const entry = req.result
      if (!entry) {
        reject(new Error('Test case not found'))
        return
      }

      entry.usedAt = new Date().toISOString()
      store.put(entry)
      tx.oncomplete = () => resolve(entry)
    }

    req.onerror = (e) => reject(e.target.error)
  })
}

export function exportTestCases(testcases) {
  const blob = new Blob([JSON.stringify(testcases, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'algoscope-testcases.json'
  a.click()
  URL.revokeObjectURL(url)
}

export async function importTestCases(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result)
        if (!Array.isArray(data)) {
          throw new Error('Import file must contain an array of test cases')
        }

        const db = await openDB()
        const tx = db.transaction(STORE_NAME, 'readwrite')
        const store = tx.objectStore(STORE_NAME)

        let successfulImports = 0
        let skippedImports = 0

        data.forEach((tc) => {
          if (
            !tc ||
            typeof tc !== 'object' ||
            !tc.name?.trim() ||
            !tc.algorithm?.trim() ||
            !tc.input?.trim()
          ) {
            skippedImports += 1
            return
          }

          const entry = buildTestCaseEntry({
            id: tc.id,
            name: tc.name,
            algorithm: tc.algorithm,
            input: tc.input,
            description: tc.description,
            pinned: tc.pinned,
            createdAt: tc.createdAt,
            usedAt: tc.usedAt,
          })

          store.put(entry)
          successfulImports += 1
        })

        tx.oncomplete = () =>
          resolve({
            success: successfulImports,
            skipped: skippedImports,
          })
        tx.onerror = (err) => reject(err.target.error)
      } catch (err) {
        reject(err)
      }
    }

    reader.onerror = () =>
      reject(reader.error || new Error('Failed to read file'))
    reader.readAsText(file)
  })
}
