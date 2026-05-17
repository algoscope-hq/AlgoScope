import React, { useEffect, useState, useRef, memo } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import * as themes from 'react-syntax-highlighter/dist/esm/styles/prism'

const CodePanel = memo(function CodePanel({
  title,
  code,
  language = 'javascript',
  activeLine,
  onLanguageChange,
}) {
  const scrollContainerRef = useRef(null)
  const [theme, setTheme] = useState('vscDarkPlus')
  const [copied, setCopied] = useState(false)

  const activeTheme = themes[theme] ?? themes.vscDarkPlus

  useEffect(() => {
    if (!activeLine || !scrollContainerRef.current) {
      return
    }

    const activeNode = scrollContainerRef.current.querySelector(
      `[data-line-number="${activeLine}"]`
    )

    activeNode?.scrollIntoView({
      block: 'nearest',
      behavior: 'smooth',
    })
  }, [activeLine])

  useEffect(() => {
    if (!copied) return

    const timeoutId = window.setTimeout(() => {
      setCopied(false)
    }, 1800)

    return () => window.clearTimeout(timeoutId)
  }, [copied])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
    } catch (err) {
      console.error('Failed to copy code: ', err)
    }
  }

  return (
    <div className="rounded-xl border border-slate-700/80 bg-slate-950/90 shadow-[0_18px_56px_rgba(15,23,42,0.38)] backdrop-blur-xl">
      <div className="flex flex-col gap-3 border-b border-slate-800 px-4 py-3">
        <div className="relative flex items-center justify-center gap-4">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-400/80">
              Live Code
            </p>
            <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
          </div>
          <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-200 sm:block">
            {activeLine ? `Line ${activeLine}` : 'Waiting'}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {onLanguageChange ? (
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 transition focus:border-cyan-500 focus:outline-none"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>
          ) : (
            <div className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-300">
              {language}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={theme}
              onChange={(event) => setTheme(event.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 transition focus:border-cyan-500 focus:outline-none"
            >
              <option value="vscDarkPlus">VSC Dark Plus</option>
              <option value="oneDark">One Dark</option>
              <option value="dracula">Dracula</option>
              <option value="coldarkDark">Coldark Dark</option>
              <option value="materialDark">Material Dark</option>
            </select>

            <button
              type="button"
              onClick={handleCopy}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'border border-slate-700 bg-slate-900 text-slate-100 hover:border-cyan-500 hover:text-cyan-200'
              }`}
            >
              {copied ? 'Copied' : 'Copy Code'}
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="max-h-[24rem] overflow-auto rounded-b-xl"
      >
        <SyntaxHighlighter
          language={language}
          style={activeTheme}
          showLineNumbers={true}
          wrapLines={true}
          wrapLongLines={true}
          customStyle={{
            margin: 0,
            padding: '1rem 0.75rem 1rem 0.5rem',
            fontSize: '0.9rem',
            lineHeight: '1.65',
            background: 'transparent',
          }}
          lineProps={(lineNumber) => ({
            'data-line-number': lineNumber,
            style: {
              display: 'block',
              borderRadius: '0.5rem',
              margin: '0 0.25rem',
              padding: '0 0.5rem',
              background:
                lineNumber === activeLine
                  ? 'rgba(34, 211, 238, 0.18)'
                  : 'transparent',
              boxShadow:
                lineNumber === activeLine
                  ? 'inset 3px 0 0 rgba(34, 211, 238, 0.9)'
                  : 'none',
              transition: 'background-color 180ms ease, box-shadow 180ms ease',
            },
          })}
          lineNumberStyle={(lineNumber) => ({
            minWidth: '2.25rem',
            paddingRight: '1rem',
            color:
              lineNumber === activeLine
                ? 'rgba(103, 232, 249, 0.95)'
                : 'rgba(148, 163, 184, 0.75)',
          })}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
})

export default CodePanel
