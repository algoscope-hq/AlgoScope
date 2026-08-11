import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAIAssistant } from './useAIAssistant'

// ─── Icons ────────────────────────────────────────────────────────────────────

const SparkleIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M5 3l.5 2L7 5.5 5.5 6 5 8l-.5-2L3 5.5 4.5 5 5 3zm9 0l.5 2 1.5.5-1.5.5-.5 2-.5-2L12 5.5l1.5-.5L14 3zm-4 6l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" />
  </svg>
)

const HintIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
)

const BookIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
)

const SendIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
)

const XIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const ChevronIcon = ({ open }) => (
  <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
    fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

const StopIcon = () => (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
    <rect x="6" y="6" width="12" height="12" rx="2" />
  </svg>
)

// ─── Typing indicator ─────────────────────────────────────────────────────────

const TypingIndicator = () => (
  <div className="flex items-center gap-1 px-4 py-3">
    {[0, 1, 2].map((i) => (
      <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-cyan-400"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
    ))}
  </div>
)

// ─── Single message bubble ─────────────────────────────────────────────────────

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user'
  return (
    <motion.div
      className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Avatar */}
      <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5
        ${isUser
          ? 'bg-slate-700 text-slate-300'
          : 'bg-gradient-to-br from-cyan-500 to-purple-600 text-white'}`}>
        {isUser ? 'U' : 'AI'}
      </div>

      {/* Bubble */}
      <div className={`max-w-[82%] rounded-2xl px-3 py-2.5 text-sm leading-relaxed
        ${isUser
          ? 'bg-slate-700/70 text-slate-200 rounded-tr-sm'
          : message.isError
            ? 'bg-red-950/60 border border-red-800/50 text-red-300 rounded-tl-sm'
            : 'bg-slate-800/80 border border-slate-700/50 text-slate-200 rounded-tl-sm'}`}>
        {message.content}
        <div className={`text-[10px] mt-1.5 ${isUser ? 'text-slate-500 text-right' : 'text-slate-600'}`}>
          {message.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Hint progress dots ────────────────────────────────────────────────────────

const HintProgress = ({ level }) => (
  <div className="flex items-center gap-1.5">
    <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Hints</span>
    {[1, 2, 3].map((n) => (
      <div key={n} className={`w-2 h-2 rounded-full transition-all duration-300
        ${n <= level
          ? 'bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.7)]'
          : 'bg-slate-700'}`} />
    ))}
  </div>
)

// ─── Quick action chips ────────────────────────────────────────────────────────

const QuickChips = ({ onSend, disabled }) => {
  const chips = [
    'Why did my algorithm fail?',
    'Explain time complexity here',
    'What should I try next?',
    'How does this data structure work?',
  ]
  return (
    <div className="flex flex-wrap gap-1.5 px-3 pb-2">
      {chips.map((chip) => (
        <button key={chip} onClick={() => onSend(chip)} disabled={disabled}
          className="text-[10px] px-2.5 py-1 rounded-full border border-slate-700 text-slate-400
            hover:border-cyan-500/50 hover:text-cyan-400 hover:bg-cyan-500/5 transition-all
            disabled:opacity-40 disabled:cursor-not-allowed">
          {chip}
        </button>
      ))}
    </div>
  )
}

// ─── Main AIAssistantPanel ─────────────────────────────────────────────────────

const AIAssistantPanel = ({ code = '', executionMode = 'single', language = 'javascript' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [showQuickChips, setShowQuickChips] = useState(true)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const handleOpen = useCallback(() => setIsOpen(true), [])

  const {
    messages,
    isLoading,
    hintLevel,
    requestHint,
    explainAlgorithm,
    sendMessage,
    resetHints,
    clearMessages,
    cancelRequest,
  } = useAIAssistant({ isOpen, onOpen: handleOpen })

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200)
    }
  }, [isOpen])

  const handleSend = (text) => {
    const trimmed = (text || inputValue).trim()
    if (!trimmed || isLoading) return
    setShowQuickChips(false)
    sendMessage(trimmed, code, executionMode, language)
    setInputValue('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleHint = () => {
    if (hintLevel >= 3 || isLoading) return
    setShowQuickChips(false)
    requestHint(code, executionMode, language)
  }

  const handleExplain = () => {
    setShowQuickChips(false)
    explainAlgorithm(null, code)
  }

  const handleClear = () => {
    clearMessages()
    resetHints()
    setShowQuickChips(true)
  }

  // Determine algorithm name from code for context
  const algoHint = code?.slice(0, 200)?.match(/function\s+(\w+)/)?.[1] || 'algorithm'

  return (
    <>
      {/* ── Floating trigger button ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl
              bg-gradient-to-r from-cyan-600 to-purple-600 text-white text-sm font-bold
              shadow-[0_0_24px_rgba(6,182,212,0.4)] hover:shadow-[0_0_32px_rgba(6,182,212,0.6)]
              hover:-translate-y-0.5 active:scale-95 transition-all"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            title="AI Assistant (Ctrl+H)"
          >
            <SparkleIcon />
            <span>AI Assistant</span>
            <span className="text-[10px] opacity-60 font-mono">Ctrl+H</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Slide-in panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-0 right-0 z-50 flex flex-col
              w-full sm:w-[420px] h-[600px] sm:h-[620px] sm:bottom-6 sm:right-6
              bg-slate-950 border border-slate-700/60 sm:rounded-3xl
              shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5
              bg-slate-900/80 border-b border-slate-800 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600
                  flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.4)]">
                  <SparkleIcon />
                </div>
                <div>
                  <div className="text-sm font-bold text-white leading-none">AI Assistant</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 font-mono">AlgoScope Tutor</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <HintProgress level={hintLevel} />
                {messages.length > 0 && (
                  <button onClick={handleClear}
                    className="text-[10px] text-slate-600 hover:text-slate-400 transition-colors px-1.5 py-1
                      rounded-lg hover:bg-slate-800 font-mono uppercase tracking-wider">
                    Clear
                  </button>
                )}
                <button onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl text-slate-500 hover:text-white hover:bg-slate-800 transition-all">
                  <XIcon />
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 px-3 py-2.5 border-b border-slate-800/60 flex-shrink-0">
              <button onClick={handleHint}
                disabled={hintLevel >= 3 || isLoading}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold
                  transition-all active:scale-95
                  ${hintLevel >= 3 || isLoading
                    ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
                    : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/50'}`}>
                <HintIcon />
                {hintLevel >= 3 ? 'Max Hints' : `Hint ${hintLevel + 1}/3`}
              </button>
              <button onClick={handleExplain} disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold
                  bg-purple-500/10 border border-purple-500/30 text-purple-400
                  hover:bg-purple-500/20 hover:border-purple-500/50 transition-all active:scale-95
                  disabled:opacity-50 disabled:cursor-not-allowed">
                <BookIcon />
                Explain Algo
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
              {messages.length === 0 && (
                <motion.div className="flex flex-col items-center justify-center h-full text-center gap-3 pb-4"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20
                    border border-cyan-500/20 flex items-center justify-center">
                    <SparkleIcon />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-300">Your AI tutor is ready</p>
                    <p className="text-xs text-slate-600 mt-1 max-w-[260px]">
                      Ask a question, request a hint, or get an algorithm explained — without spoiling the solution.
                    </p>
                  </div>
                  <div className="text-[10px] text-slate-700 font-mono mt-1">
                    Ctrl+H · anytime
                  </div>
                </motion.div>
              )}

              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}

              {isLoading && (
                <motion.div className="flex gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600
                    flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white mt-0.5">
                    AI
                  </div>
                  <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl rounded-tl-sm">
                    <TypingIndicator />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick chips */}
            {showQuickChips && messages.length === 0 && (
              <QuickChips onSend={handleSend} disabled={isLoading} />
            )}

            {/* Input */}
            <div className="px-3 pb-3 pt-2 border-t border-slate-800/60 flex-shrink-0">
              <div className="flex gap-2 items-end bg-slate-900/60 border border-slate-700/50
                rounded-2xl px-3 py-2 focus-within:border-cyan-500/40 transition-colors">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything about your code or algorithm…"
                  rows={1}
                  disabled={isLoading}
                  className="flex-1 bg-transparent text-sm text-white placeholder-slate-600 resize-none
                    focus:outline-none leading-relaxed max-h-24 overflow-y-auto custom-scrollbar
                    disabled:opacity-50"
                  style={{ fieldSizing: 'content' }}
                />
                {isLoading ? (
                  <button onClick={cancelRequest}
                    className="flex-shrink-0 p-1.5 rounded-xl bg-red-500/20 text-red-400
                      hover:bg-red-500/30 transition-all active:scale-95">
                    <StopIcon />
                  </button>
                ) : (
                  <button onClick={() => handleSend()}
                    disabled={!inputValue.trim()}
                    className="flex-shrink-0 p-1.5 rounded-xl bg-cyan-500/20 text-cyan-400
                      hover:bg-cyan-500/30 disabled:opacity-30 disabled:cursor-not-allowed
                      transition-all active:scale-95">
                    <SendIcon />
                  </button>
                )}
              </div>
              <p className="text-[9px] text-slate-700 text-center mt-1.5 font-mono">
                Enter to send · Shift+Enter for newline · Ctrl+H to toggle
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AIAssistantPanel