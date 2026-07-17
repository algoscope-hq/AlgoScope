import { useState } from 'react'
import CodeViewer from '../CodeViewer'

const LANGUAGES = ['javascript', 'python', 'java', 'cpp']

export default function GreedyCodeViewer({ algorithm }) {
  const [language, setLanguage] = useState('javascript')

  return (
    <section aria-labelledby="greedy-code-title" className="min-w-0">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            Code viewer
          </p>
          <h2 id="greedy-code-title" className="mt-1 text-lg font-bold theme-text-strong">
            {algorithm.name} implementation
          </h2>
        </div>
        <label className="text-sm font-semibold theme-text-muted">
          <span className="sr-only">Code language</span>
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm theme-text-strong"
          >
            {LANGUAGES.map((option) => (
              <option key={option} value={option}>
                {option === 'cpp' ? 'C++' : option[0].toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <CodeViewer
        language={language}
        code={algorithm.code[language]}
        title={`${algorithm.name} Preview`}
      />
    </section>
  )
}
