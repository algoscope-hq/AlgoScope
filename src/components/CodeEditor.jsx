import React, { useState, useEffect, useRef } from 'react'
import Editor from '@monaco-editor/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/useTheme'

const CodeEditor = ({
  language = 'javascript',
  defaultCode = '// Write your algorithm here...\n',
  theme = 'vs-dark',
  onCodeChange,
  onRun,
  height = '700px',
  isRunning = false,
  isDisabled = false,
}) => {
  const [value, setValue] = useState(defaultCode)
  const [copied, setCopied] = useState(false)
  const cardRef = useRef(null)
  const editorRef = useRef(null)
  const { isDark } = useTheme()

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [cursorPos, setCursorPos] = useState({ line: 1, column: 1 })

  useEffect(() => {
    if (!copied) return

    const timeoutId = window.setTimeout(() => {
      setCopied(false)
    }, 1800)

    return () => window.clearTimeout(timeoutId)
  }, [copied])

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
    } catch (err) {
      console.error('Failed to copy code: ', err)
    }
  }

  const handleDownload = () => {
    const extensions = {
      javascript: 'js',
      python: 'py',
      cpp: 'cpp',
      java: 'java',
      c: 'c',
    }

    const extension = extensions[language] || 'txt'

    const safeValue = value ?? ''
    const blob = new Blob([safeValue], {
      type: 'text/plain',
    })

    const url = window.URL.createObjectURL(blob)

    const a = document.createElement('a')

    a.href = url
    a.download = `solution.${extension}`

    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    window.URL.revokeObjectURL(url)
  }

  const handleEditorChange = (newValue) => {
    setValue(newValue)
    if (onCodeChange) {
      onCodeChange(newValue)
    }
  }

  const handleEditorMount = (editor) => {
    editorRef.current = editor
    
    // Listen to cursor position updates
    editor.onDidChangeCursorPosition((e) => {
      setCursorPos({
        line: e.position.lineNumber,
        column: e.position.column
      })
    })
  }

  const getLanguageBadge = (lang) => {
    const configs = {
      javascript: {
        label: 'JS / ESNext',
        bg: 'bg-amber-500/10 dark:bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400',
        dot: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
      },
      python: {
        label: 'Python 3',
        bg: 'bg-blue-500/10 dark:bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-400',
        dot: 'bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.5)]'
      },
      cpp: {
        label: 'C++ 17',
        bg: 'bg-indigo-500/10 dark:bg-indigo-500/10 border-indigo-500/30 text-indigo-700 dark:text-indigo-400',
        dot: 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]'
      },
      java: {
        label: 'Java JDK',
        bg: 'bg-orange-500/10 dark:bg-orange-500/10 border-orange-500/30 text-orange-700 dark:text-orange-400',
        dot: 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]'
      },
      c: {
        label: 'C Lang',
        bg: 'bg-slate-500/10 dark:bg-slate-500/10 border-slate-500/30 text-slate-700 dark:text-slate-400',
        dot: 'bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.5)]'
      }
    }

    const active = configs[lang.toLowerCase()] || {
      label: lang.toUpperCase(),
      bg: 'bg-cyan-500/10 dark:bg-cyan-500/10 border-cyan-500/30 text-cyan-700 dark:text-cyan-400',
      dot: 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]'
    }

    return (
      <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-bold tracking-wider uppercase select-none ${active.bg}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${active.dot}`} />
        <span>{active.label}</span>
      </div>
    )
  }

  const isJavaScript = language === 'javascript'

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`group relative flex flex-col w-full border rounded-2xl overflow-hidden backdrop-blur-xl transition-all duration-300 ${
        isDark
          ? 'border-slate-700/80 bg-slate-950/90 shadow-[0_24px_80px_rgba(15,23,42,0.45)]'
          : 'border-slate-200 bg-white/95 shadow-[0_20px_50px_rgba(0,0,0,0.06)]'
      }`}
      style={{ height }}
    >
      {/* Dynamic Mouse Spotlight Background */}
      <motion.div
        className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: isHovering
            ? `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, ${
                isDark ? 'rgba(6, 182, 212, 0.08)' : 'rgba(6, 182, 212, 0.04)'
              }, transparent 50%)`
            : 'transparent',
        }}
      />

      {/* Dynamic Spotlight Border tracking mouse */}
      <motion.div
        className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
        style={{
          background: isHovering
            ? `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, ${
                isDark ? 'rgba(6, 182, 212, 0.2)' : 'rgba(6, 182, 212, 0.1)'
              }, transparent 45%)`
            : 'transparent',
          WebkitMask:
            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '1px',
        }}
      />

      {/* Editor Header / Toolbar */}
      <div className={`relative z-10 flex flex-col md:flex-row items-center justify-between px-5 py-4 border-b gap-3 md:gap-0 ${
        isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div className="flex gap-1.5 shrink-0">
            <div className="w-2.5 h-2.5 bg-red-500/80 rounded-full"></div>
            <div className="w-2.5 h-2.5 bg-yellow-500/80 rounded-full"></div>
            <div className="w-2.5 h-2.5 bg-green-500/80 rounded-full"></div>
          </div>
          <div className="flex flex-row items-center gap-3">
            <div className="flex flex-col">
              <p className={`text-[10px] font-semibold uppercase tracking-[0.24em] ${isDark ? 'text-cyan-400/80' : 'text-cyan-600'}`}>
                Editor Sandbox
              </p>
              <span className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                {language === 'javascript' ? 'main.js' : `main.${language}`}
              </span>
            </div>
            {getLanguageBadge(language)}
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-2">
          <button
            onClick={handleCopy}
            className={`px-3 py-2 text-sm font-bold transition-all duration-300 rounded-xl flex items-center gap-2 cursor-pointer ${
              copied
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                : isDark
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/50'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'
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

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className={`px-3 py-2 text-sm font-bold border rounded-xl transition-all duration-300 cursor-pointer ${
              isDark
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border-slate-700/50'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'
            }`}
          >
            Download
          </button>

          <button
            onClick={() => isJavaScript && onRun && onRun(value)}
            disabled={!isJavaScript || isRunning || isDisabled}
            className={`px-6 py-2 text-sm font-bold text-white transition-all duration-300 rounded-xl active:scale-95 transform hover:-translate-y-0.5 cursor-pointer ${
              isJavaScript && !isRunning && !isDisabled
                ? 'bg-cyan-600 hover:bg-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : isDark
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-50'
            }`}
          >
            {isRunning ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Running...</span>
              </span>
            ) : isJavaScript ? (
              'Run Code'
            ) : (
              'Coming Soon'
            )}
          </button>
        </div>
      </div>

      {/* Viewport: Editor + Shortcuts overlay container */}
      <div className="relative z-10 flex-grow min-h-0 flex flex-row">
        {/* The Actual Monaco Editor */}
        <div className={`flex-grow h-full ${isDark ? 'bg-[#1e1e1e]/50' : 'bg-slate-50/50'}`}>
          <Editor
            height="100%"
            language={language}
            theme={theme}
            value={value}
            onChange={handleEditorChange}
            onMount={handleEditorMount}
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

        {/* Shortcuts Cheat Sheet Side Drawer */}
        <AnimatePresence>
          {showShortcuts && (
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`absolute top-0 right-0 h-full w-80 z-20 border-l shadow-2xl backdrop-blur-xl p-5 overflow-y-auto select-none ${
                isDark
                  ? 'bg-slate-950/95 border-slate-800 text-slate-200 shadow-[0_0_30px_rgba(0,0,0,0.5)]'
                  : 'bg-white/95 border-slate-200 text-slate-800 shadow-[0_0_20px_rgba(0,0,0,0.08)]'
              }`}
            >
              <div className="flex items-center justify-between border-b pb-3 mb-4 border-slate-800/10 dark:border-slate-800/60">
                <div className="flex items-center gap-2">
                  <svg className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-wider">Keyboard Shortcuts</span>
                </div>
                <button
                  onClick={() => setShowShortcuts(false)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4 text-[11px] font-mono">
                <div className="space-y-2">
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Editing</p>
                  <div className="flex justify-between items-center py-1 border-b border-slate-800/10 dark:border-slate-800/30">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Toggle Comment</span>
                    <kbd className={`px-1.5 py-0.5 rounded border text-[9px] font-bold ${
                      isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}>Ctrl + /</kbd>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-800/10 dark:border-slate-800/30">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Trigger Suggestion</span>
                    <kbd className={`px-1.5 py-0.5 rounded border text-[9px] font-bold ${
                      isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}>Ctrl + Space</kbd>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-800/10 dark:border-slate-800/30">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Move Line Up/Down</span>
                    <kbd className={`px-1.5 py-0.5 rounded border text-[9px] font-bold ${
                      isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}>Alt + ↑/↓</kbd>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-800/10 dark:border-slate-800/30">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Copy Line Up/Down</span>
                    <kbd className={`px-1.5 py-0.5 rounded border text-[9px] font-bold ${
                      isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}>Shift + Alt + ↑/↓</kbd>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Search & Nav</p>
                  <div className="flex justify-between items-center py-1 border-b border-slate-800/10 dark:border-slate-800/30">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Find Search</span>
                    <kbd className={`px-1.5 py-0.5 rounded border text-[9px] font-bold ${
                      isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}>Ctrl + F</kbd>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-800/10 dark:border-slate-800/30">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Replace Search</span>
                    <kbd className={`px-1.5 py-0.5 rounded border text-[9px] font-bold ${
                      isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}>Ctrl + H</kbd>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-800/10 dark:border-slate-800/30">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Go to Line</span>
                    <kbd className={`px-1.5 py-0.5 rounded border text-[9px] font-bold ${
                      isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}>Ctrl + G</kbd>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Advanced</p>
                  <div className="flex justify-between items-center py-1 border-b border-slate-800/10 dark:border-slate-800/30">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Add Cursor Above/Below</span>
                    <kbd className={`px-1.5 py-0.5 rounded border text-[9px] font-bold ${
                      isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}>Ctrl + Alt + ↑/↓</kbd>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-800/10 dark:border-slate-800/30">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Multi-Select Symbols</span>
                    <kbd className={`px-1.5 py-0.5 rounded border text-[9px] font-bold ${
                      isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}>Ctrl + D</kbd>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-800/10 dark:border-slate-800/30">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Select All Occurrences</span>
                    <kbd className={`px-1.5 py-0.5 rounded border text-[9px] font-bold ${
                      isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}>Ctrl + F2</kbd>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dynamic Status HUD Bar */}
      <div className={`relative z-10 flex items-center justify-between px-5 py-2 border-t select-none text-[10px] font-mono ${
        isDark
          ? 'bg-slate-950/80 border-slate-900/80 text-slate-400'
          : 'bg-slate-50 border-slate-200 text-slate-500'
      }`}>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse`} />
            <span>Ready</span>
          </span>
          <span className="opacity-40">|</span>
          <span>{value.split('\n').length} lines</span>
          <span className="opacity-40">|</span>
          <span>{(value || '').length} chars</span>
        </div>

        <div className="flex items-center gap-4">
          <span>Ln {cursorPos.line}, Col {cursorPos.column}</span>
          <span className="opacity-40">|</span>
          <button
            onClick={() => setShowShortcuts(!showShortcuts)}
            className={`flex items-center gap-1 font-bold uppercase tracking-wider text-[9px] transition-colors cursor-pointer ${
              isDark ? 'hover:text-cyan-400 text-slate-400' : 'hover:text-cyan-600 text-slate-600'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            <span>Shortcuts</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CodeEditor
