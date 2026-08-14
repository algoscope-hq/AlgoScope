import React, { memo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import * as themes from 'react-syntax-highlighter/dist/esm/styles/prism'
import { MoveUpRight, Code2 } from 'lucide-react'
import DifficultyBadge from '../DifficultyBadge'

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

const AlgorithmReferenceCard = memo(function AlgorithmReferenceCard({
  algorithm,
}) {
  const {
    name,
    category,
    difficulty,
    time,
    space,
    pseudocode,
    link,
    description,
  } = algorithm
  const isDark = useDarkMode()

  const handleNavClick = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }

  return (
    <div
      className={`print-card group relative flex flex-col justify-between rounded-xl border p-6 sm:p-7 shadow-sm transition-all ${
        isDark
          ? 'bg-[#0d1117] border-slate-800 hover:border-slate-700 text-slate-100'
          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900 shadow-md'
      }`}
    >
      <div>
        {/* Header Row: Badges & Action Button */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-xs font-mono font-medium border px-2.5 py-1 rounded-md ${
                isDark
                  ? 'bg-slate-800 text-slate-300 border-slate-700'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {category}
            </span>
            {difficulty && (
              <DifficultyBadge difficulty={difficulty} size="sm" />
            )}
          </div>

          {link && (
            <Link
              to={link}
              onClick={handleNavClick}
              className={`no-print inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border font-sans font-medium text-xs transition-colors shrink-0 ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border-slate-700'
                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-900 border-indigo-200'
              }`}
            >
              <span>Explore Visualizer</span>
              <MoveUpRight
                className={`w-3.5 h-3.5 ${isDark ? 'text-cyan-400' : 'text-indigo-600'}`}
              />
            </Link>
          )}
        </div>

        {/* Algorithm Title & Description */}
        <h3
          className={`text-2xl sm:text-3xl font-sans font-bold tracking-tight transition-colors mb-2 ${
            isDark
              ? 'text-white group-hover:text-cyan-400'
              : 'text-slate-900 group-hover:text-indigo-600'
          }`}
        >
          {name}
        </h3>

        {description && (
          <p
            className={`text-sm font-sans leading-relaxed mb-5 font-normal ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            {description}
          </p>
        )}

        {/* LeetCode Style Complexity Grid - Exact Dark Theme + Clean Light Theme */}
        <div className="mb-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div
            className={`rounded-lg p-3 border ${
              isDark
                ? 'bg-[#161b22] border-slate-800'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <span
              className={`block text-xs font-sans font-semibold uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Best Time
            </span>
            <span
              className={`font-mono text-base font-bold ${
                isDark ? 'text-emerald-400' : 'text-emerald-600'
              }`}
            >
              {time?.best || 'O(1)'}
            </span>
          </div>

          <div
            className={`rounded-lg p-3 border ${
              isDark
                ? 'bg-[#161b22] border-slate-800'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <span
              className={`block text-xs font-sans font-semibold uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Average Time
            </span>
            <span
              className={`font-mono text-base font-bold ${
                isDark ? 'text-amber-300' : 'text-amber-600'
              }`}
            >
              {time?.average || 'O(N)'}
            </span>
          </div>

          <div
            className={`rounded-lg p-3 border ${
              isDark
                ? 'bg-[#161b22] border-slate-800'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <span
              className={`block text-xs font-sans font-semibold uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Worst Time
            </span>
            <span
              className={`font-mono text-base font-bold ${
                isDark ? 'text-slate-100' : 'text-slate-900'
              }`}
            >
              {time?.worst || 'O(N)'}
            </span>
          </div>

          <div
            className={`rounded-lg p-3 border ${
              isDark
                ? 'bg-[#161b22] border-slate-800'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <span
              className={`block text-xs font-sans font-semibold uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Space Complexity
            </span>
            <span
              className={`font-mono text-base font-bold ${
                isDark ? 'text-cyan-400' : 'text-indigo-600'
              }`}
            >
              {space || 'O(1)'}
            </span>
          </div>
        </div>
      </div>

      {/* Code Editor Style Solution Box */}
      <div
        className={`print-code rounded-lg border overflow-hidden ${
          isDark
            ? 'bg-[#161b22] border-slate-800'
            : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div
          className={`px-4 py-2 border-b flex items-center justify-between text-xs font-mono ${
            isDark
              ? 'bg-[#0d1117] border-slate-800 text-slate-400'
              : 'bg-slate-100 border-slate-200 text-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Code2
              className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-indigo-600'}`}
            />
            <span
              className={`font-semibold ${
                isDark ? 'text-slate-300' : 'text-slate-800'
              }`}
            >
              Pseudocode / Solution Pattern
            </span>
          </div>
        </div>
        <SyntaxHighlighter
          language="javascript"
          style={isDark ? themes.vscDarkPlus : themes.vs}
          customStyle={{
            margin: 0,
            padding: '1.1rem',
            fontSize: '0.9rem',
            lineHeight: '1.6',
            background: 'transparent',
            overflowX: 'auto',
          }}
        >
          {pseudocode}
        </SyntaxHighlighter>
      </div>
    </div>
  )
})

export default AlgorithmReferenceCard
