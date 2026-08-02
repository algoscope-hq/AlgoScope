import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ALGORITHMS, OPERATING_SYSTEMS } from '../../data/visualizerData'

const difficultyColor = {
  Beginner: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  Intermediate: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  Advanced: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
}

export const ConceptsOverview = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('All')

  const allConcepts = useMemo(() => {
    return [
      ...ALGORITHMS.map((item) => ({ ...item, category: 'Algorithms & Data Structures' })),
      ...OPERATING_SYSTEMS.map((item) => ({ ...item, category: 'Operating Systems' })),
    ]
  }, [])

  const filteredConcepts = useMemo(() => {
    return allConcepts.filter((item) => {
      const matchesTab =
        activeTab === 'All' ||
        item.category === activeTab ||
        item.difficulty === activeTab

      const matchesSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesTab && matchesSearch
    })
  }, [allConcepts, activeTab, searchQuery])

  const counts = useMemo(() => {
    return {
      all: allConcepts.length,
      algo: ALGORITHMS.length,
      os: OPERATING_SYSTEMS.length,
      beginner: allConcepts.filter((i) => i.difficulty === 'Beginner').length,
      intermediate: allConcepts.filter((i) => i.difficulty === 'Intermediate').length,
      advanced: allConcepts.filter((i) => i.difficulty === 'Advanced').length,
    }
  }, [allConcepts])

  return (
    <div className="theme-home relative min-h-screen w-full px-4 pb-20 pt-24">
      <div className="mx-auto w-full max-w-6xl">
        {/* Header Section */}
        <div className="mb-10 text-center">
          <span className="inline-block px-3.5 py-1 mb-3 rounded-full text-xs font-mono font-semibold tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20">
            ALGOSCOPE CONCEPTS DIRECTORY
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight theme-text-strong mb-4">
            Algorithm & Systems Concepts
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg theme-text-subtle">
            Explore interactive visualizers, data structures, complexity theory, and operating system policies — all organized in one master index.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-xl">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter concepts..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-950/80 border border-slate-700/60 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {[
              { id: 'All', label: `All (${counts.all})` },
              { id: 'Algorithms & Data Structures', label: `Algorithms (${counts.algo})` },
              { id: 'Operating Systems', label: `OS (${counts.os})` },
              { id: 'Beginner', label: `Beginner (${counts.beginner})` },
              { id: 'Intermediate', label: `Intermediate (${counts.intermediate})` },
              { id: 'Advanced', label: `Advanced (${counts.advanced})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-800/40 hover:bg-slate-800/80'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Concept Cards Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredConcepts.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to={item.link}
                  className="theme-card flex flex-col justify-between h-full rounded-2xl border border-slate-800/80 p-5 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 group bg-slate-950/50 backdrop-blur-md"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-semibold">
                        {item.category === 'Operating Systems' ? 'Systems' : 'Algorithm'}
                      </span>
                      <span
                        className={`shrink-0 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                          difficultyColor[item.difficulty] || 'text-slate-400 border-slate-600/40'
                        }`}
                      >
                        {item.difficulty}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold theme-text-strong group-hover:text-indigo-400 transition-colors mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs theme-text-subtle leading-relaxed line-clamp-3 mb-4">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform">
                    <span>Explore Visualizer</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredConcepts.length === 0 && (
          <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800/60 mt-4">
            <p className="text-base text-slate-400 mb-2">No concepts found matching "{searchQuery}"</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setActiveTab('All')
              }}
              className="text-xs font-semibold text-indigo-400 hover:underline"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ConceptsOverview
