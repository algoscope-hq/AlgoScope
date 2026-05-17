import React, { useState, useRef, useEffect } from 'react'
import { animate } from 'animejs'

const MODES = {
  STANDARD: 'standard stack',
  BROWSER: 'browser history',
  REVERSAL: 'string reversal',
  PARENTHESES: 'parentheses checker',
  POSTFIX: 'postfix evaluator',
}

const SLEEP_MS = 800

export default function StackIV({ onStepChange }) {
  const [stack, setStack] = useState([])
  const [mode, setMode] = useState(MODES.STANDARD)
  const [inputValue, setInputValue] = useState('')
  const [consoleOutput, setConsoleOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const containerRef = useRef(null)

  const stackRef = useRef([])

  const handleModeChange = (newMode) => {
    setMode(newMode)
    setStack([])
    stackRef.current = []
    setInputValue('')
    setConsoleOutput('')
    setIsRunning(false)
    if (onStepChange) onStepChange(null)
  }

  useEffect(() => {
    if (onStepChange) onStepChange(null)
  }, [mode, onStepChange])

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  const runAnimation = (el, params) => {
    return new Promise((resolve) => {
      animate(el, {
        ...params,
        onComplete: resolve,
      })
    })
  }

  const pushItem = async (val) => {
    if (stackRef.current.length >= 8) {
      setConsoleOutput((prev) => prev + '\nStack Overflow!')
      return false
    }

    const newItem = { id: Date.now() + Math.random(), value: val }
    stackRef.current.push(newItem)
    setStack((prev) => [...prev, newItem])

    await sleep(50)
    const el = document.getElementById(`stack-item-${newItem.id}`)
    if (el) {
      await runAnimation(el, {
        translateY: [-200, 0],
        opacity: [0, 1],
        scale: [0.5, 1],
        ease: 'spring(1, 80, 10, 0)',
      })
    }
    return true
  }

  const popItem = async () => {
    if (stackRef.current.length === 0) return null

    const itemToRemove = stackRef.current[stackRef.current.length - 1]
    const el = document.getElementById(`stack-item-${itemToRemove.id}`)

    if (el) {
      await runAnimation(el, {
        translateX: [0, 100],
        opacity: [1, 0],
        ease: 'inExpo',
        duration: 300,
      })
    }

    const popped = stackRef.current.pop()
    setStack((prev) => prev.slice(0, -1))
    return popped ? popped.value : null
  }

  const handleStandardPush = async () => {
    if (!inputValue) return
    if (onStepChange) onStepChange(6)
    await pushItem(inputValue)
    setInputValue('')
    if (onStepChange) onStepChange(null)
  }

  const handleStandardPop = async () => {
    if (onStepChange) onStepChange(10)
    await popItem()
    if (onStepChange) onStepChange(null)
  }

  const handleBrowserVisit = async () => {
    if (!inputValue) return
    if (onStepChange) onStepChange(6)
    await pushItem(inputValue)
    setInputValue('')
    if (onStepChange) onStepChange(null)
  }

  const handleBrowserBack = async () => {
    if (onStepChange) onStepChange(10)
    const page = await popItem()
    if (page) setConsoleOutput(`Went back from: ${page}`)
    if (onStepChange) onStepChange(null)
  }

  const runReversal = async () => {
    if (!inputValue) return
    setIsRunning(true)
    setConsoleOutput('Starting Reversal...')

    if (onStepChange) onStepChange(1)
    for (const char of inputValue.split('')) {
      if (onStepChange) onStepChange(6)
      await pushItem(char)
      await sleep(SLEEP_MS / 2)
    }

    setConsoleOutput('Stack filled. Popping to reverse...')
    await sleep(SLEEP_MS)

    let reversed = ''
    if (onStepChange) onStepChange(10)
    while (stackRef.current.length > 0) {
      if (onStepChange) onStepChange(11)
      const char = await popItem()
      reversed += char
      setConsoleOutput(`Reversed: ${reversed}`)
      await sleep(SLEEP_MS / 2)
    }

    setIsRunning(false)
    if (onStepChange) onStepChange(null)
  }

  const runParentheses = async () => {
    if (!inputValue) return
    setIsRunning(true)
    setConsoleOutput('Checking Balance...')

    const openMap = { '(': ')', '{': '}', '[': ']' }
    const closeMap = { ')': '(', '}': '{', ']': '[' }
    let isValid = true

    for (const char of inputValue.split('')) {
      if (openMap[char]) {
        if (onStepChange) onStepChange(6)
        await pushItem(char)
        setConsoleOutput(`Found opener '${char}'. Pushed.`)
      } else if (closeMap[char]) {
        if (onStepChange) onStepChange(10)
        setConsoleOutput(`Found closer '${char}'. Checking stack...`)
        const popped = await popItem()

        if (!popped || popped !== closeMap[char]) {
          setConsoleOutput(
            `Error: '${char}' does not match '${popped || 'empty'}'.`
          )
          isValid = false
          break
        }
        setConsoleOutput(`Match: '${popped}' cancels '${char}'.`)
      }
      await sleep(SLEEP_MS)
    }

    if (isValid && stackRef.current.length === 0) {
      setConsoleOutput('Result: BALANCED ✅')
    } else if (isValid && stackRef.current.length > 0) {
      setConsoleOutput('Result: UNBALANCED (Stack not empty) ❌')
    } else if (!isValid) {
      setConsoleOutput('Result: UNBALANCED ❌')
    }

    setIsRunning(false)
    if (onStepChange) onStepChange(null)
  }

  const runPostfix = async () => {
    if (!inputValue) return
    setIsRunning(true)
    setConsoleOutput('Evaluating Postfix...')

    const tokens = inputValue.trim().split(/\s+/)

    for (const token of tokens) {
      if (!isNaN(token)) {
        setConsoleOutput(`Pushing number: ${token}`)
        if (onStepChange) onStepChange(6)
        await pushItem(Number(token))
      } else {
        setConsoleOutput(`Operator '${token}' found. Popping 2 operands...`)
        if (onStepChange) onStepChange(10)
        const val2 = await popItem()
        const val1 = await popItem()

        if (val1 === null || val2 === null) {
          setConsoleOutput('Error: Insufficient operands!')
          setIsRunning(false)
          if (onStepChange) onStepChange(null)
          return
        }

        let res = 0
        switch (token) {
          case '+':
            res = val1 + val2
            break
          case '-':
            res = val1 - val2
            break
          case '*':
            res = val1 * val2
            break
          case '/':
            res = Math.floor(val1 / val2)
            break
          default:
            res = 0
        }

        setConsoleOutput(`${val1} ${token} ${val2} = ${res}. Pushing result.`)
        await sleep(SLEEP_MS)
        if (onStepChange) onStepChange(6)
        await pushItem(res)
      }
      await sleep(SLEEP_MS)
    }

    if (onStepChange) onStepChange(10)
    const finalResult = await popItem()
    if (stackRef.current.length === 0) {
      setConsoleOutput(`Final Result: ${finalResult} 🎉`)
      if (onStepChange) onStepChange(6)
      await pushItem(finalResult)
    } else {
      setConsoleOutput('Error: Stack not empty after evaluation.')
    }

    setIsRunning(false)
    if (onStepChange) onStepChange(null)
  }

  const renderControls = () => {
    switch (mode) {
      case MODES.BROWSER:
        return (
          <>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="github.com"
              className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none w-48"
              disabled={isRunning}
            />
            <button
              onClick={handleBrowserVisit}
              className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg shadow-lg"
              disabled={isRunning}
            >
              Visit
            </button>
            <button
              onClick={handleBrowserBack}
              className="px-6 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg shadow-lg"
              disabled={isRunning}
            >
              Back
            </button>
          </>
        )
      case MODES.REVERSAL:
        return (
          <>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter string (e.g. hello)"
              className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none w-64"
              disabled={isRunning}
            />
            <button
              onClick={runReversal}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg shadow-lg"
              disabled={isRunning}
            >
              Reverse String
            </button>
          </>
        )
      case MODES.PARENTHESES:
        return (
          <>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="(a + {b}) * c"
              className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none w-64"
              disabled={isRunning}
            />
            <button
              onClick={runParentheses}
              className="px-6 py-2 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg shadow-lg"
              disabled={isRunning}
            >
              Check Balance
            </button>
          </>
        )
      case MODES.POSTFIX:
        return (
          <>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="5 3 + 2 *"
              className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none w-64"
              disabled={isRunning}
            />
            <button
              onClick={runPostfix}
              className="px-6 py-2 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-lg shadow-lg"
              disabled={isRunning}
            >
              Evaluate
            </button>
          </>
        )
      default:
        return (
          <>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Value"
              className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none w-32"
              onKeyDown={(e) => e.key === 'Enter' && handleStandardPush()}
              disabled={isRunning}
            />
            <button
              onClick={handleStandardPush}
              className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg shadow-lg"
              disabled={isRunning}
            >
              Push
            </button>
            <button
              onClick={handleStandardPop}
              className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg shadow-lg"
              disabled={isRunning}
            >
              Pop
            </button>
          </>
        )
    }
  }

  return (
    <div className="flex flex-col h-full items-center">
      <div className="mb-6 w-full max-w-2xl flex lg:flex-row flex-col items-center justify-between bg-slate-800/50 p-4 rounded-xl border border-slate-700">
        <label className="text-slate-300 font-bold mr-4">
          Application Mode:
        </label>
        <select
          value={mode}
          onChange={(e) => handleModeChange(e.target.value)}
          className="bg-slate-900 text-cyan-400 font-mono border border-slate-600 rounded px-3 py-1 outline-none focus:border-cyan-500"
          disabled={isRunning}
        >
          <option value={MODES.STANDARD}>Standard Stack</option>
          <option value={MODES.BROWSER}>Browser History</option>
          <option value={MODES.REVERSAL}>String Reversal</option>
          <option value={MODES.PARENTHESES}>Parentheses Checker</option>
          <option value={MODES.POSTFIX}>Postfix Evaluator</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-4 mb-4 justify-center z-10 min-h-[50px]">
        {renderControls()}
      </div>

      <div className="h-16 w-full max-w-md text-center mb-4">
        {consoleOutput && (
          <div className="bg-black/40 text-green-400 font-mono text-sm p-2 rounded border border-green-900/50 whitespace-pre-wrap animate-pulse">
            {consoleOutput}
          </div>
        )}
      </div>

      <div
        className="flex-1 flex items-end justify-center pb-10 w-full"
        ref={containerRef}
      >
        <div className="relative w-48 min-h-[400px] border-b-4 border-l-4 border-r-4 border-slate-600 rounded-b-xl bg-slate-900/30 backdrop-blur-sm flex flex-col-reverse items-center p-2 gap-2 transition-all duration-500">
          <div className="absolute -bottom-10 text-slate-500 font-mono text-sm uppercase tracking-widest text-center w-full">
            {mode === MODES.BROWSER ? 'History (LIFO)' : 'Stack Memory'}
          </div>

          {stack.map((item, index) => (
            <div
              key={item.id}
              id={`stack-item-${item.id}`}
              className={`w-full h-12 rounded-md flex items-center justify-center text-white font-bold shadow-lg border border-white/10 relative z-10 transition-colors duration-300 ${
                mode === MODES.BROWSER
                  ? 'bg-gradient-to-r from-green-600 to-emerald-800'
                  : mode === MODES.POSTFIX
                    ? 'bg-gradient-to-r from-pink-600 to-rose-800'
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600'
              }`}
            >
              <span className="truncate px-2">{item.value}</span>
              <span className="absolute right-2 text-[10px] text-white/30 font-mono">
                {index}
              </span>

              {index === stack.length - 1 && (
                <div className="absolute -right-20 lg:-right-30 top-11 lg:top-1/2 -translate-y-1/2 flex lg:flex-row flex-col items-center gap-3">
                  <svg
                    className="w-12 h-12 text-yellow-400 filter drop-shadow-[0_0_8px_rgba(250,204,21,0.6)] animate-pulse"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M7 16l-4-4m0 0l4-4m-4 4h18"
                    />
                  </svg>
                  <div className="flex lg:flex-row flex-col text-yellow-400 font-black font-mono text-xl tracking-wider drop-shadow-md whitespace-nowrap">
                    TOP
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
