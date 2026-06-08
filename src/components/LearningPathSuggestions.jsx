import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ROUTE_DIFFICULTIES, NEXT_TOPICS_MAP } from '../data/difficultyMap'
import { difficultyColors } from './difficultyColors'
import { ArrowRight } from 'lucide-react'

export default function LearningPathSuggestions({ className = '' }) {
  const location = useLocation()
  const activeDifficulty = ROUTE_DIFFICULTIES[location.pathname]
  if (!activeDifficulty) return null

  const suggestions = NEXT_TOPICS_MAP[activeDifficulty] || []
  if (suggestions.length === 0) return null

  return (
    <div
      className={`bg-slate-900/50 border border-slate-700/60 rounded-xl px-5 py-4 flex flex-col gap-3 backdrop-blur-sm shadow-xl ${className}`}
    >
      <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400/80">
        Suggested Next Steps
      </h3>
      <p className="text-xs text-slate-400 font-light leading-relaxed">
        Finished this {activeDifficulty} topic? Continue your learning journey
        with these recommended modules:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
        {suggestions.map((topic) => {
          const colorStyles =
            difficultyColors[topic.difficulty] || difficultyColors.Beginner
          return (
            <Link
              key={topic.name}
              to={topic.href}
              onClick={() => window.scrollTo(0, 0)}
              className="flex items-center justify-between p-3 rounded-lg border border-slate-700/50 bg-slate-950/60 hover:bg-slate-900 hover:border-cyan-500/40 transition-all duration-300 group shadow-sm"
            >
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors truncate">
                  {topic.name}
                </span>
                <span
                  className={`text-[9px] font-mono mt-0.5 ${colorStyles.text} uppercase tracking-wider`}
                >
                  {topic.difficulty}
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
