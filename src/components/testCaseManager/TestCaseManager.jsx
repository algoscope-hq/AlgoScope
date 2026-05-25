import { useState, useEffect, useCallback, useRef } from 'react'
import {
  getAllTestCases,
  saveTestCase,
  deleteTestCase,
  togglePin,
  searchTestCases,
  exportTestCases,
  importTestCases,
  updateUsedAt,
} from '../../lib/testCaseStore'

export default function TestCaseManager({
  algorithm,
  currentInput,
  onLoad,
  sampleCases = [],
}) {
  const [testCases, setTestCases] = useState([])
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const hasSeededSamples = useRef(false)

  const fetchCases = useCallback(async () => {
    const cases = search
      ? await searchTestCases(search)
      : await getAllTestCases(activeTab === 'current' ? algorithm : null)

    if (search && activeTab === 'current' && algorithm) {
      return cases.filter((testCase) => testCase.algorithm === algorithm)
    }

    return cases
  }, [search, algorithm, activeTab])

  const load = useCallback(async () => {
    const data = await fetchCases()

    if (
      !search &&
      data.length === 0 &&
      sampleCases.length > 0 &&
      !hasSeededSamples.current
    ) {
      hasSeededSamples.current = true
      await Promise.all(
        sampleCases.map((sampleCase) => saveTestCase(sampleCase))
      )
      const seededCases = await fetchCases()
      setTestCases(seededCases)
      return
    }

    setTestCases(data)
  }, [fetchCases, sampleCases, search])

  useEffect(() => {
    if (!isOpen) return

    const timer = window.setTimeout(() => {
      void load()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [isOpen, load])

  const handleSave = async () => {
    if (!name.trim() || !algorithm || !currentInput) return
    setSaving(true)

    let shouldReload = false

    try {
      await saveTestCase({ name, algorithm, input: currentInput, description })
      setName('')
      setDescription('')
      shouldReload = true
    } catch (error) {
      console.error('Failed to save test case:', error)
    } finally {
      setSaving(false)
      if (shouldReload) {
        void load()
      }
    }
  }

  const handleUse = async (tc) => {
    await updateUsedAt(tc.id)
    onLoad(tc.input)
    setIsOpen(false)
  }

  const handlePin = async (id) => {
    setSaving(true)

    let shouldReload = false

    try {
      await togglePin(id)
      shouldReload = true
    } catch (error) {
      console.error('Failed to toggle pin:', error)
    } finally {
      setSaving(false)
      if (shouldReload) {
        void load()
      }
    }
  }

  const handleDelete = async (id) => {
    setSaving(true)

    let shouldReload = false

    try {
      await deleteTestCase(id)
      shouldReload = true
    } catch (error) {
      console.error('Failed to delete test case:', error)
    } finally {
      setSaving(false)
      if (shouldReload) {
        void load()
      }
    }
  }

  const handleExport = async () => {
    const all = await getAllTestCases()
    exportTestCases(all)
  }

  const handleImport = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSaving(true)

    let shouldReload = false

    try {
      await importTestCases(file)
      shouldReload = true
    } catch (error) {
      console.error('Failed to import test cases:', error)
    } finally {
      e.target.value = ''
      setSaving(false)
      if (shouldReload) {
        void load()
      }
    }
  }

  const pinned = testCases.filter((tc) => tc.pinned)
  const recent = testCases.filter((tc) => !tc.pinned)
  const currentTabLabel = algorithm ? `${algorithm} only` : 'Current only'

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white hover:bg-gray-700"
      >
        <span aria-hidden="true">📋</span>
        Test Cases
      </button>

      {isOpen && (
        <div className="absolute right-0 top-10 z-50 w-96 rounded-xl border border-gray-700 bg-gray-900 shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-700 p-4">
            <h3 className="font-semibold text-white">Test Case Manager</h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExport}
                className="text-xs text-gray-400 hover:text-white"
              >
                ⬇ Export
              </button>
              <label className="cursor-pointer text-xs text-gray-400 hover:text-white">
                ⬆ Import
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImport}
                />
              </label>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
                aria-label="Close test case manager"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="space-y-2 border-b border-gray-700 p-4">
            <p className="text-xs text-gray-400">Save current input</p>
            <input
              className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white"
              placeholder="Test case name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !name.trim()}
              className="w-full rounded bg-blue-600 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : '+ Save Test Case'}
            </button>
          </div>

          <div className="border-b border-gray-700 p-3">
            <input
              className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white"
              placeholder="Search test cases..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex border-b border-gray-700">
            {['all', 'current'].map((tab) => (
              <button
                type="button"
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 border-b-2 py-2 text-xs capitalize ${
                  activeTab === tab
                    ? 'border-blue-400 text-blue-400'
                    : 'border-transparent text-gray-400'
                }`}
              >
                {tab === 'current' ? currentTabLabel : 'All'}
              </button>
            ))}
          </div>

          <div className="max-h-64 overflow-y-auto">
            {testCases.length === 0 && (
              <p className="py-6 text-center text-sm text-gray-500">
                No test cases found.
              </p>
            )}

            {pinned.length > 0 && (
              <div className="px-3 pb-1 pt-3">
                <p className="mb-2 text-xs text-yellow-400">📌 Pinned</p>
                {pinned.map((tc) => (
                  <TestCaseItem
                    key={tc.id}
                    tc={tc}
                    onUse={handleUse}
                    onPin={handlePin}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}

            {recent.length > 0 && (
              <div className="px-3 pb-3 pt-2">
                {pinned.length > 0 && (
                  <p className="mb-2 text-xs text-gray-400">Recent</p>
                )}
                {recent.map((tc) => (
                  <TestCaseItem
                    key={tc.id}
                    tc={tc}
                    onUse={handleUse}
                    onPin={handlePin}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function TestCaseItem({ tc, onUse, onPin, onDelete }) {
  return (
    <div className="flex items-start justify-between gap-2 border-b border-gray-800 py-2 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{tc.name}</p>
        <p className="truncate text-xs text-gray-400">{tc.input}</p>
        {tc.description && (
          <p className="truncate text-xs text-gray-500">{tc.description}</p>
        )}
        <p className="text-xs text-gray-600">{tc.algorithm}</p>
      </div>
      <div className="flex shrink-0 gap-1">
        <button
          type="button"
          onClick={() => onUse(tc)}
          className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
        >
          Use
        </button>
        <button
          type="button"
          onClick={() => onPin(tc.id)}
          className={`rounded px-2 py-1 text-xs ${
            tc.pinned
              ? 'text-yellow-400'
              : 'text-gray-500 hover:text-yellow-400'
          }`}
          aria-label={tc.pinned ? 'Unpin test case' : 'Pin test case'}
        >
          📌
        </button>
        <button
          type="button"
          onClick={() => onDelete(tc.id)}
          className="rounded px-2 py-1 text-xs text-gray-500 hover:text-red-400"
          aria-label="Delete test case"
        >
          🗑
        </button>
      </div>
    </div>
  )
}
