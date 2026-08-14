import React, { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import SeoHead from '../SeoHead'
import AlgorithmReferenceCard from './AlgorithmReferenceCard'
import CheatSheetFilters from './CheatSheetFilters'
import {
  getNormalizedAlgorithms,
  getCategories,
  filterAlgorithms,
} from '../../data/cheatsheetData'

export default function CheatSheetPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const allAlgorithms = useMemo(() => getNormalizedAlgorithms(), [])
  const categories = useMemo(() => getCategories(), [])

  const filteredAlgorithms = useMemo(
    () => filterAlgorithms(allAlgorithms, activeCategory, searchQuery),
    [allAlgorithms, activeCategory, searchQuery]
  )

  const handleClearFilters = useCallback(() => {
    setActiveCategory('All')
    setSearchQuery('')
  }, [])

  const handleClearSearch = useCallback(() => {
    setSearchQuery('')
  }, [])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  return (
    <div className="theme-home print-page relative min-h-screen w-full px-4 pb-20 pt-6">
      <SeoHead
        title="Algorithm Cheat Sheet | AlgoScope"
        description="Comprehensive consolidated algorithm study reference cheat sheet. Quick-scan time complexities, space complexities, and pseudocodes across all DSA categories."
      />

      <div className="mx-auto w-full max-w-5xl">
        {/* Header Section */}
        <div className="no-print mb-8 text-center">
          <span className="inline-block px-3.5 py-1 mb-3 rounded-full text-xs font-sans font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 uppercase">
            ALGOSCOPE CHEAT SHEET
          </span>
          <h1 className="text-4xl sm:text-5xl font-sans font-extrabold tracking-tight theme-text-strong mb-3">
            Algorithm Study Reference
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg font-sans theme-text-subtle font-normal">
            Quick-scan time complexities, space complexities, and concise pseudocodes across all data structures and algorithms in AlgoScope.
          </p>
        </div>

        {/* Printable Header (Visible only when printing) */}
        <div className="hidden print:block mb-6 text-center border-b border-slate-300 pb-4">
          <h1 className="text-2xl font-bold font-sans text-black">AlgoScope — Algorithm Cheat Sheet</h1>
          <p className="text-xs font-sans text-slate-600 mt-1">
            Consolidated Reference Guide for Computer Science Algorithms & Data Structures
          </p>
        </div>

        {/* Search & Filter Bar */}
        <CheatSheetFilters
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClearSearch={handleClearSearch}
          totalCount={allAlgorithms.length}
          visibleCount={filteredAlgorithms.length}
          onPrint={handlePrint}
        />

        {/* Algorithm Cards List - 1 per row */}
        <AnimatePresence mode="popLayout">
          {filteredAlgorithms.length > 0 ? (
            <motion.div
              key="algorithm-grid"
              layout
              className="grid grid-cols-1 gap-6 max-w-4xl mx-auto"
            >
              <AnimatePresence propagate>
                {filteredAlgorithms.map((algo) => (
                  <motion.div
                    key={algo.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AlgorithmReferenceCard algorithm={algo} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="no-print rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center my-6 max-w-4xl mx-auto"
            >
              <p className="text-base font-sans font-semibold text-slate-300 mb-2">
                No algorithms found matching your search
              </p>
              <p className="text-xs font-sans text-slate-500 mb-6 max-w-md mx-auto">
                Try adjusting your search term or selecting a different algorithm category filter.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-sans font-semibold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset All Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
