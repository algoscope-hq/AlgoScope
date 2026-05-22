import React, { useEffect, useRef, useState } from 'react'
import StatusDisplay from '../StatusDisplay'
import { calculateStepDelay } from '../../lib/utils'

// Streams every animation frame via onFrame callback instead of collecting into
// an array, so memory stays O(board) rather than O(total frames).
function streamNQueensFrames(n, onFrame) {
  const board = Array.from({ length: n }, () => Array(n).fill(''))

  function isSafe(row, col) {
    for (let i = 0; i < row; i++) if (board[i][col] === 'Q') return false
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--)
      if (board[i][j] === 'Q') return false
    for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++)
      if (board[i][j] === 'Q') return false
    return true
  }

  function snapshot(type, row, col, message) {
    onFrame({
      board: board.map((r) => [...r]),
      type, // 'try' | 'conflict' | 'place' | 'backtrack' | 'solution'
      activeRow: row,
      activeCol: col,
      message,
    })
  }

  let solutions = 0

  function solve(row) {
    if (row === n) {
      solutions++
      snapshot('solution', -1, -1, `✓ Solution #${solutions} found!`)
      return
    }
    for (let col = 0; col < n; col++) {
      snapshot('try', row, col, `Row ${row + 1}: trying column ${col + 1}…`)

      if (!isSafe(row, col)) {
        snapshot(
          'conflict',
          row,
          col,
          `Row ${row + 1}, col ${col + 1}: conflict — backtracking`
        )
        continue
      }

      board[row][col] = 'Q'
      snapshot(
        'place',
        row,
        col,
        `Row ${row + 1}: placed queen at column ${col + 1}`
      )
      solve(row + 1)

      board[row][col] = ''
      snapshot(
        'backtrack',
        row,
        col,
        `Row ${row + 1}: removed queen from col ${col + 1} (backtrack)`
      )
    }
  }

  solve(0)
}

export const CanvasNQueens = ({ n = 4, speed = 1, trigger = 0 }) => {
  const [frame, setFrame] = useState(null)
  const [solutions, setSolutions] = useState(0)
  const [backtracks, setBacktracks] = useState(0)
  const [done, setDone] = useState(false)
  const frames = React.useMemo(() => {
    if (trigger === 0) return []
    const f = []
    streamNQueensFrames(n, (frame) => f.push(frame))
    return f
  }, [trigger, n])

  const [prevTrigger, setPrevTrigger] = useState(trigger)

  // Adjust state during rendering if trigger changes
  if (trigger !== prevTrigger) {
    setPrevTrigger(trigger)
    setFrame(null)
    setSolutions(0)
    setBacktracks(0)
    setDone(false)
  }

  // Single live timer handle instead of an array of O(totalFrames) handles.
  const timerRef = useRef(null)

  useEffect(() => {
    clearTimeout(timerRef.current)

    if (trigger === 0 || frames.length === 0) return

    const total = frames.length
    const delay = calculateStepDelay(120, speed)

    function scheduleNext(i) {
      if (i >= total) return
      timerRef.current = setTimeout(() => {
        const f = frames[i]
        setFrame(f)
        if (f.type === 'solution') setSolutions((s) => s + 1)
        if (f.type === 'backtrack') setBacktracks((b) => b + 1)
        if (i === total - 1) {
          setDone(true)
        } else {
          scheduleNext(i + 1)
        }
      }, delay)
    }

    scheduleNext(0)

    return () => clearTimeout(timerRef.current)
  }, [trigger, n, speed, frames])

  const board =
    frame?.board ?? Array.from({ length: n }, () => Array(n).fill(''))
  const cellPx = Math.min(56, Math.floor(380 / n))

  const cellStyle = (r, c) => {
    const hasQueen = board[r]?.[c] === 'Q'
    const isActive = frame?.activeRow === r && frame?.activeCol === c
    const isLight = (r + c) % 2 === 0

    if (isActive && frame?.type === 'conflict')
      return 'bg-red-500/70 border-red-400 scale-105 shadow-[0_0_10px_rgba(239,68,68,0.6)]'
    if (isActive && frame?.type === 'backtrack')
      return 'bg-orange-500/50 border-orange-400'
    if (isActive && frame?.type === 'try')
      return 'bg-cyan-500/30 border-cyan-400'
    if (hasQueen && frame?.type === 'solution')
      return 'bg-emerald-500 border-emerald-300 scale-105 shadow-[0_0_10px_rgba(52,211,153,0.6)]'
    if (hasQueen)
      return 'bg-cyan-500 border-white scale-105 shadow-[0_0_10px_rgba(6,182,212,0.5)]'
    return isLight
      ? 'bg-slate-700 border-slate-600'
      : 'bg-slate-800 border-slate-700'
  }

  const status = frame?.message ?? 'Set board size and click Visualize.'

  return (
    <div className="w-full">
      <div className="rounded-xl border border-white/10 bg-slate-900/50 p-8 shadow-lg min-h-[350px] flex flex-col items-center justify-center gap-8">
        {/* Board */}
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${n}, ${cellPx}px)` }}
        >
          {board.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                style={{ width: cellPx, height: cellPx }}
                className={`flex items-center justify-center rounded-md border-2 text-xl font-bold transition-all duration-200 ${cellStyle(r, c)}`}
              >
                {cell === 'Q' ? '♛' : ''}
              </div>
            ))
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
          <div className="rounded-xl bg-slate-800/60 p-4 border border-slate-700 text-center">
            <p className="text-slate-400 text-xs">Board</p>
            <h2 className="text-2xl font-bold text-cyan-400 mt-1">
              {n}×{n}
            </h2>
          </div>
          <div className="rounded-xl bg-slate-800/60 p-4 border border-slate-700 text-center">
            <p className="text-slate-400 text-xs">Solutions</p>
            <h2 className="text-2xl font-bold text-emerald-400 mt-1">
              {solutions}
            </h2>
          </div>
          <div className="rounded-xl bg-slate-800/60 p-4 border border-slate-700 text-center">
            <p className="text-slate-400 text-xs">Backtracks</p>
            <h2 className="text-2xl font-bold text-orange-400 mt-1">
              {backtracks}
            </h2>
          </div>
        </div>

        {done && (
          <p className="text-emerald-400 font-bold text-sm">
            ✓ Complete — {solutions} solution{solutions !== 1 ? 's' : ''} found,{' '}
            {backtracks} backtracks
          </p>
        )}
      </div>

      <div className="mt-8 mb-2">
        <StatusDisplay message={status} />
      </div>
    </div>
  )
}
