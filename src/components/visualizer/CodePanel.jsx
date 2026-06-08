import React, { useEffect, useState, useRef, memo, useContext } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import * as themes from 'react-syntax-highlighter/dist/esm/styles/prism'
import { ThemeContext } from '../../context/theme'

const CodePanel = memo(function CodePanel({
  title,
  code,
  language = 'javascript',
  activeLine,
  onLanguageChange,
}) {
  const scrollContainerRef = useRef(null)

  const { isDark } = useContext(ThemeContext)

  const defaultLightTheme = 'materialLight'
  const [manualTheme, setManualTheme] = useState(null)
  const [copied, setCopied] = useState(false)

  const theme = manualTheme ?? (isDark ? 'vscDarkPlus' : defaultLightTheme)
  const activeTheme = themes[theme] ?? themes.vscDarkPlus

  useEffect(() => {
    if (!activeLine || !scrollContainerRef.current) return

    const activeNode = scrollContainerRef.current.querySelector(
      `[data-line-number="${activeLine}"]`
    )

    if (activeNode) {
      const container = scrollContainerRef.current

      const containerTop = container.scrollTop
      const containerBottom = containerTop + container.clientHeight

      const nodeTop = activeNode.offsetTop
      const nodeBottom = nodeTop + activeNode.clientHeight

      if (nodeTop < containerTop) {
        container.scrollTo({ top: nodeTop - 20, behavior: 'smooth' })
      } else if (nodeBottom > containerBottom) {
        container.scrollTo({
          top: nodeBottom - container.clientHeight + 20,
          behavior: 'smooth',
        })
      }
    }
  }, [activeLine])

  useEffect(() => {
    if (!copied) return

    const timeoutId = window.setTimeout(() => {
      setCopied(false)
    }, 1800)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [copied])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)

      setCopied(true)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDownload = () => {
    const extensions = {
      javascript: 'js',
      python: 'py',
      cpp: 'cpp',
      java: 'java',
      c: 'c',
      go: 'go',
      rust: 'rs',
    }

    const ext = extensions[language?.toLowerCase()] || 'txt'

    const cleanTitle = title?.replace(/[^a-zA-Z0-9\s]/g, '') || 'algorithm'

    const words = cleanTitle.trim().split(/\s+/)

    const algoName =
      words.length === 1
        ? words[0].toLowerCase()
        : words[0].toLowerCase() +
          words
            .slice(1)
            .map(
              (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join('')

    const blob = new Blob([code], {
      type: 'text/plain',
    })

    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')

    link.href = url
    link.download = `${algoName}.${ext}`

    document.body.appendChild(link)

    link.click()

    document.body.removeChild(link)

    URL.revokeObjectURL(url)
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

        <div className="flex flex-col gap-3 overflow-hidden">
          {onLanguageChange ? (
            <select
              value={language}
              onChange={(event) => onLanguageChange(event.target.value)}
              className="h-10 w-[140px] rounded-xl border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 transition focus:border-cyan-500 focus:outline-none"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="c">C</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
            </select>
          ) : (
            <div className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-300">
              {language}
            </div>
          )}

          <div className="overflow-x-auto">
            <div className="flex min-w-max items-center gap-3 pb-1">
              <select
                value={theme}
                onChange={(event) => {
                  setManualTheme(event.target.value)
                }}
                className="h-10 min-w-[140px] rounded-xl border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 transition focus:border-cyan-500 focus:outline-none"
              >
                <option value="vscDarkPlus">VSC Dark Plus</option>
                <option value="oneDark">One Dark</option>
                <option value="dracula">Dracula</option>
                <option value="coldarkDark">Coldark Dark</option>
                <option value="materialDark">Material Dark</option>
                <option value="prism">Prism (Light)</option>
                <option value="materialLight">Material Light</option>
              </select>

              <button
                type="button"
                onClick={handleDownload}
                className="h-10 whitespace-nowrap rounded-xl border border-slate-700 bg-slate-900 px-3 text-sm font-medium text-slate-100 transition hover:border-cyan-500 hover:text-cyan-200"
              >
                Download
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className={`h-10 whitespace-nowrap rounded-xl border border-slate-700 bg-slate-900 px-3 text-sm font-medium text-slate-100 transition hover:border-cyan-500 hover:text-cyan-200 ${
                  copied ? 'bg-emerald-600 text-white border-emerald-600' : ''
                }`}
              >
                {copied ? 'Copied' : 'Copy Code'}
              </button>
            </div>
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
            background: isDark ? 'transparent' : 'rgba(15, 23, 42, 0.94)',
            color: isDark ? undefined : '#f8fafc',
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
