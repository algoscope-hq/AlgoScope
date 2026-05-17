import React, { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'

const CodeEditor = ({
  language = 'javascript',
  defaultCode = '// Write your algorithm here...\n',
  theme = 'vs-dark',
  onCodeChange,
  onRun,
}) => {
  const [value, setValue] = useState(defaultCode)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return

    const timeoutId = window.setTimeout(() => {
      setCopied(false)
    }, 1800)

    return () => window.clearTimeout(timeoutId)
  }, [copied])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
    } catch (err) {
      console.error('Failed to copy code: ', err)
    }
  }

  const handleEditorChange = (newValue) => {
    setValue(newValue)
    if (onCodeChange) {
      onCodeChange(newValue)
    }
  }

  const isJavaScript = language === 'javascript'

  return (
    <div className="flex flex-col w-full h-[700px] border border-slate-700/80 rounded-2xl overflow-hidden bg-slate-950/90 shadow-[0_24px_80px_rgba(15,23,42,0.45)] backdrop-blur-xl">
      {/* Editor Header / Toolbar */}
      <div className="flex items-center justify-between px-5 py-4 bg-slate-900/60 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 bg-red-500/80 rounded-full"></div>
            <div className="w-2.5 h-2.5 bg-yellow-500/80 rounded-full"></div>
            <div className="w-2.5 h-2.5 bg-green-500/80 rounded-full"></div>
          </div>
          <div className="flex flex-col">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-400/80">
              Terminal
            </p>
            <span className="text-sm font-semibold text-slate-200">
              {language === 'javascript' ? 'main.js' : `main.${language}`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className={`px-4 py-2 text-sm font-bold transition-all duration-300 rounded-xl flex items-center gap-2 ${
              copied
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/50'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/50'
            }`}
            title="Copy to clipboard"
          >
            {copied ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={() => isJavaScript && onRun && onRun(value)}
            disabled={!isJavaScript}
            className={`px-6 py-2 text-sm font-bold text-white transition-all duration-300 rounded-xl active:scale-95 transform hover:-translate-y-0.5 ${
              isJavaScript
                ? 'bg-cyan-600 hover:bg-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
            }`}
          >
            {isJavaScript ? 'Run Code' : 'Coming Soon'}
          </button>
        </div>
      </div>

      {/* The Actual Monaco Editor */}
      <div className="flex-grow bg-[#1e1e1e]/50">
        <Editor
          height="100%"
          language={language}
          theme={theme}
          value={value}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 20 },
            backgroundColor: 'transparent',
            lineNumbersMinChars: 3,
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            fontLigatures: true,
          }}
        />
      </div>
    </div>
  )
}

export default CodeEditor
