import React, { memo, useState, useEffect } from 'react'
import { Search, X, Printer } from 'lucide-react'

function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof document === 'undefined') return true
    const theme = document.documentElement.getAttribute('data-theme')
    return !theme || theme === 'dark'
  })

  useEffect(() => {
    if (typeof document === 'undefined') return

    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme')
      setIsDark(!theme || theme === 'dark')
    }

    checkTheme()

    const observer = new MutationObserver(() => {
      checkTheme()
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class'],
    })

    return () => observer.disconnect()
  }, [])

  return isDark
}

const CheatSheetFilters = memo(function CheatSheetFilters({
  categories,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onClearSearch,
  totalCount,
  visibleCount,
  onPrint,
}) {
  const isDark = useDarkMode()

  return (
    <div
      className={`no-print mb-8 flex flex-col gap-4 p-5 rounded-xl border transition-all ${
        isDark
          ? 'bg-[#0d1117] border-slate-800 shadow-sm text-slate-100'
          : 'bg-white border-slate-200 shadow-md text-slate-900'
      }`}
    >
      {/* Search Bar & Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search
            className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search algorithms by name, category, or description..."
            className={`w-full pl-10 pr-9 py-2.5 text-sm font-sans rounded-lg border transition-colors shadow-inner focus:outline-none focus:ring-1 ${
              isDark
                ? 'bg-[#161b22] border-slate-700/80 text-slate-100 placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500'
            }`}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={onClearSearch}
              title="Clear search"
              aria-label="Clear search"
              className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors p-1 ${
                isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Count & Print Button */}
        <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
          <span
            className={`text-xs font-sans font-medium ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Showing{' '}
            <strong
              className={`font-bold ${
                isDark ? 'text-cyan-400' : 'text-indigo-600'
              }`}
            >
              {visibleCount}
            </strong>{' '}
            of{' '}
            <strong
              className={`font-bold ${
                isDark ? 'text-slate-200' : 'text-slate-900'
              }`}
            >
              {totalCount}
            </strong>{' '}
            algorithms
          </span>

          <button
            type="button"
            onClick={onPrint}
            className={`print-keep inline-flex items-center justify-center gap-2 h-9 px-3.5 rounded-lg border font-medium text-xs transition-colors shadow-sm active:scale-95 cursor-pointer ${
              isDark
                ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white'
                : 'border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-900'
            }`}
          >
            <Printer
              className={`w-4 h-4 ${
                isDark ? 'text-cyan-400' : 'text-indigo-600'
              }`}
            />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills (LeetCode Tag Style with exact Light/Dark mode) */}
      <div
        className={`flex flex-wrap items-center gap-2 pt-2 border-t ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`px-3 py-1.5 text-xs font-mono rounded-md transition-all cursor-pointer ${
                isActive
                  ? isDark
                    ? 'bg-cyan-600 text-white font-semibold shadow-sm border border-cyan-500'
                    : 'bg-indigo-600 text-white font-semibold shadow-sm border border-indigo-600'
                  : isDark
                    ? 'bg-[#161b22] hover:bg-slate-800 text-slate-300 hover:text-white font-medium border border-slate-800'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-medium border border-slate-200'
              }`}
            >
              {cat}
            </button>
          )
        })}
      </div>
    </div>
  )
})

export default CheatSheetFilters
