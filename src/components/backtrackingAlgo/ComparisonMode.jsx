import React, { useEffect, useRef, useState } from 'react'
import { calculateStepDelay } from '../../lib/utils'
import StatusDisplay from '../StatusDisplay'

// Inline mini-board so ComparisonMode is self-contained
function generateFrames(n) {
  const board = Array.from({ length: n }, () => Array(n).fill(''))
  const frames = []
  let solutions = 0,
    backtracks = 0

  function isSafe(row, col) {
    for (let i = 0; i < row; i++) if (board[i][col] === 'Q') return false
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--)
      if (board[i][j] === 'Q') return false
    for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++)
      if (board[i][j] === 'Q') return false
    return true
  }

  function snap(type, row, col, message) {
    frames.push({
      board: board.map((r) => [...r]),
      type,
      activeRow: row,
      activeCol: col,
      message,
      solutions,
      backtracks,
    })
  }

  function solve(row) {
    if (row === n) {
      solutions++
      snap('solution', -1, -1, `✓ Solution #${solutions}`)
      return
    }
    for (let col = 0; col < n; col++) {
      if (!isSafe(row, col)) continue
      board[row][col] = 'Q'
      snap('place', row, col, `Row ${row + 1}: placed at col ${col + 1}`)
      solve(row + 1)
      board[row][col] = ''
      backtracks++
      snap(
        'backtrack',
        row,
        col,
        `Row ${row + 1}: backtrack from col ${col + 1}`
      )
    }
  }
  solve(0)
  return frames
}

function MiniBoard({ n, frames, speed, trigger, accent }) {
  const [frame, setFrame] = useState(null)
  const [solutions, setSolutions] = useState(0)
  const [backtracks, setBacktracks] = useState(0)
  const [done, setDone] = useState(false)
  const [prevTrigger, setPrevTrigger] = useState(trigger)

  if (trigger !== prevTrigger) {
    setPrevTrigger(trigger)
    setFrame(null)
    setSolutions(0)
    setBacktracks(0)
    setDone(false)
  }

  // Single live timer handle — never more than one pending setTimeout at a time.
  const timerRef = useRef(null)

  useEffect(() => {
    clearTimeout(timerRef.current)
    if (trigger === 0) return

    const total = frames.length
    const delay = calculateStepDelay(100, speed)

    function playTick(i) {
      timerRef.current = setTimeout(() => {
        const f = frames[i]
        setFrame(f)
        setSolutions(f.solutions)
        setBacktracks(f.backtracks)
        if (i === total - 1) {
          setDone(true)
        } else {
          playTick(i + 1)
        }
      }, delay)
    }

    playTick(0)

    return () => clearTimeout(timerRef.current)
  }, [trigger, frames, speed])

  const board =
    frame?.board ?? Array.from({ length: n }, () => Array(n).fill(''))
  const cellPx = Math.min(44, Math.floor(280 / n))

  const cellStyle = (r, c) => {
    const hasQueen = board[r]?.[c] === 'Q'
    const isActive = frame?.activeRow === r && frame?.activeCol === c
    const isLight = (r + c) % 2 === 0

    if (isActive && frame?.type === 'backtrack')
      return 'bg-orange-500/50 border-orange-400'
    if (hasQueen && frame?.type === 'solution')
      return 'bg-emerald-500 border-emerald-300'
    if (hasQueen) return `border-white scale-105`
    return isLight
      ? 'bg-slate-700 border-slate-600'
      : 'bg-slate-800 border-slate-700'
  }

  return (
    <div
      className="flex-1 rounded-xl border bg-slate-900/60 overflow-hidden"
      style={{ borderColor: accent + '44' }}
    >
      {/* Panel header */}
      <div
        className="px-5 py-3 flex items-center justify-between border-b"
        style={{ borderColor: accent + '33', background: accent + '11' }}
      >
        <span className="text-sm font-bold" style={{ color: accent }}>
          {n}×{n} Board
        </span>
        {done && (
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: accent + '22', color: accent }}
          >
            ✓ {solutions} solutions
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col items-center gap-5">
        {/* Board */}
        <div
          className="grid gap-0.5"
          style={{ gridTemplateColumns: `repeat(${n}, ${cellPx}px)` }}
        >
          {board.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                style={{ width: cellPx, height: cellPx }}
                className={`flex items-center justify-center rounded border transition-all duration-150 text-base font-bold ${cellStyle(r, c)}`}
              >
                {cell === 'Q' ? (
                  <span
                    style={{
                      color: frame?.type === 'solution' ? '#000' : accent,
                    }}
                  >
                    ♛
                  </span>
                ) : (
                  ''
                )}
              </div>
            ))
          )}
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-2 gap-3 w-full">
          <div className="rounded-lg bg-slate-800/60 p-3 border border-slate-700 text-center">
            <p className="text-slate-400 text-xs">Solutions</p>
            <h3 className="text-xl font-bold mt-0.5" style={{ color: accent }}>
              {solutions}
            </h3>
          </div>
          <div className="rounded-lg bg-slate-800/60 p-3 border border-slate-700 text-center">
            <p className="text-slate-400 text-xs">Backtracks</p>
            <h3 className="text-xl font-bold text-orange-400 mt-0.5">
              {backtracks}
            </h3>
          </div>
        </div>

        <StatusDisplay
          message={
            frame?.message ?? `${n}×${n} N-Queens — click Run Both to start`
          }
        />
      </div>
    </div>
  )
}

const SIZE_PAIRS = [
  { left: 4, right: 6 },
  { left: 5, right: 7 },
  { left: 6, right: 8 },
]

export const ComparisonMode = () => {
  const [pair, setPair] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [trigger, setTrigger] = useState(0)

  const { left, right } = SIZE_PAIRS[pair]
  const leftFrames = React.useMemo(() => generateFrames(left), [left])
  const rightFrames = React.useMemo(() => generateFrames(right), [right])

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-6">
      {/* Controls bar */}
      <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-white/5">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">
            Board size pair
          </label>
          <div className="flex rounded-xl overflow-hidden border border-slate-700">
            {SIZE_PAIRS.map((p, i) => (
              <button
                key={i}
                onClick={() => {
                  setPair(i)
                  setTrigger(0)
                }}
                className={`px-4 py-2 text-xs font-bold transition-all duration-200 ${
                  pair === i
                    ? 'bg-cyan-500 text-black'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {p.left}×{p.left} vs {p.right}×{p.right}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">Speed</label>
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white text-sm outline-none focus:border-cyan-500"
          >
            <option value={0.5}>0.5×</option>
            <option value={1}>1×</option>
            <option value={2}>2×</option>
            <option value={4}>4×</option>
          </select>
        </div>

        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => setTrigger((t) => t + 1)}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 text-black font-bold text-sm hover:bg-cyan-400 transition"
          >
            ▶ Run Both
          </button>
          <button
            onClick={() => setTrigger(0)}
            className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 font-bold text-sm hover:bg-slate-700 hover:text-white transition"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Side-by-side boards */}
      <div className="flex flex-col lg:flex-row gap-4">
        <MiniBoard
          n={left}
          frames={leftFrames}
          speed={speed}
          trigger={trigger}
          accent="#06b6d4"
        />
        <MiniBoard
          n={right}
          frames={rightFrames}
          speed={speed}
          trigger={trigger}
          accent="#a855f7"
        />
      </div>

      {/* Step count insight */}
      {trigger > 0 && (
        <div className="rounded-xl bg-slate-900/50 border border-white/5 p-5">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">
            Complexity Insight
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 rounded-xl bg-slate-800/60 p-4 border border-cyan-500/20 text-center">
              <p className="text-slate-400 text-xs">
                {left}×{left} total frames
              </p>
              <h2 className="text-3xl font-bold text-cyan-400 mt-1">
                {leftFrames.length}
              </h2>
            </div>
            <div className="flex-1 rounded-xl bg-slate-800/60 p-4 border border-purple-500/20 text-center">
              <p className="text-slate-400 text-xs">
                {right}×{right} total frames
              </p>
              <h2 className="text-3xl font-bold text-purple-400 mt-1">
                {rightFrames.length}
              </h2>
            </div>
            <div className="flex-1 rounded-xl bg-emerald-500/10 p-4 border border-emerald-500/20 text-center">
              <p className="text-slate-400 text-xs">Frame ratio</p>
              <h2 className="text-3xl font-bold text-emerald-400 mt-1">
                {(rightFrames.length / Math.max(leftFrames.length, 1)).toFixed(
                  1
                )}
                ×
              </h2>
              <p className="text-slate-500 text-xs mt-1">
                more work for +{right - left} rows
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
