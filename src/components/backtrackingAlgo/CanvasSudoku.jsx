import React, { useEffect, useRef, useState } from 'react'
import StatusDisplay from '../StatusDisplay'
import { calculateStepDelay } from '../../lib/utils'
import { DEFAULT_PUZZLE, generateSudokuFrames } from './sudokuUtils'

export const CanvasSudoku = ({ speed = 1, trigger = 0 }) => {
  const [grid, setGrid] = useState(DEFAULT_PUZZLE.map((r) => [...r]))
  const [frame, setFrame] = useState(null)
  const [tryCount, setTryCount] = useState(0)
  const [backCount, setBackCount] = useState(0)
  const [done, setDone] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [locked, setLocked] = useState(
    DEFAULT_PUZZLE.map((r) => r.map((c) => c !== '.'))
  )
  const [prevTrigger, setPrevTrigger] = useState(trigger)

  const frames = React.useMemo(() => {
    if (trigger === 0) return []
    return generateSudokuFrames(grid)
  }, [trigger, grid])

  if (trigger !== prevTrigger) {
    setPrevTrigger(trigger)
    setFrame(null)
    setTryCount(0)
    setBackCount(0)
    setDone(false)

    if (trigger === 0 || frames.length === 0) {
      setIsRunning(false)
    } else {
      setIsRunning(true)
      setLocked(grid.map((r) => r.map((c) => c !== '.')))
    }
  }

  const timersRef = useRef([])

  useEffect(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []

    if (trigger === 0 || frames.length === 0) return

    frames.forEach((f, i) => {
      const t = setTimeout(
        () => {
          setFrame(f)
          setTryCount(f.tries)
          setBackCount(f.backtracks)

          if (i === frames.length - 1) {
            setDone(true)
            setIsRunning(false)
          }
        },
        i * calculateStepDelay(80, speed)
      )

      timersRef.current.push(t)
    })

    return () => {
      timersRef.current.forEach(clearTimeout)
    }
  }, [trigger, speed, frames])

  const handleCellChange = (r, c, val) => {
    if (isRunning) return

    const digit = val.replace(/[^1-9]/g, '').slice(-1)

    const next = grid.map((row) => [...row])
    next[r][c] = digit === '' ? '.' : digit

    setGrid(next)
    setFrame(null)
    setDone(false)
  }

  const handleLoadDefault = () => {
    timersRef.current.forEach(clearTimeout)

    setGrid(DEFAULT_PUZZLE.map((r) => [...r]))
    setFrame(null)
    setTryCount(0)
    setBackCount(0)
    setDone(false)
    setIsRunning(false)
  }

  const handleClear = () => {
    timersRef.current.forEach(clearTimeout)

    setGrid(Array.from({ length: 9 }, () => Array(9).fill('.')))
    setFrame(null)
    setTryCount(0)
    setBackCount(0)
    setDone(false)
    setIsRunning(false)
  }

  const displayBoard = frame?.board ?? grid

  const cellClass = (r, c) => {
    const isActive = frame?.activeR === r && frame?.activeC === c
    const isLocked = isRunning && locked[r]?.[c]
    const boxShade = (Math.floor(r / 3) + Math.floor(c / 3)) % 2 === 0

    if (isActive && frame?.type === 'backtrack') {
      return 'bg-orange-400/70 text-white border-orange-400'
    }

    if (isActive && frame?.type === 'place') {
      return 'bg-cyan-500 text-black border-white shadow-[0_0_8px_rgba(6,182,212,0.6)]'
    }

    if (
      frame?.type === 'solution' &&
      locked[r]?.[c] === false &&
      displayBoard[r][c] !== '.'
    ) {
      return 'bg-emerald-500/30 text-emerald-300 border-emerald-500/50'
    }

    if (isLocked) {
      return boxShade
        ? 'bg-slate-600 text-white border-slate-500 font-extrabold'
        : 'bg-slate-700 text-white border-slate-600 font-extrabold'
    }

    return boxShade
      ? 'bg-slate-800/80 text-cyan-300 border-slate-700'
      : 'bg-slate-900/80 text-cyan-300 border-slate-800'
  }

  const thickR = (r) =>
    r === 2 || r === 5 ? 'border-b-2 border-b-slate-400' : ''

  const thickC = (c) =>
    c === 2 || c === 5 ? 'border-r-2 border-r-slate-400' : ''

  const status =
    frame?.message ??
    (isRunning
      ? 'Solving…'
      : 'Click any empty cell to enter a digit, or use the default puzzle.')

  return (
    <div className="w-full">
      <div className="rounded-xl border border-white/10 bg-slate-900/50 p-6 shadow-lg min-h-[350px] flex flex-col items-center justify-center gap-5">
        {/* 9x9 grid — editable before run, animated during run */}
        <div className="border-2 border-slate-400 rounded-lg overflow-hidden">
          {displayBoard.map((row, r) => (
            <div key={r} className={`flex ${thickR(r)}`}>
              {row.map((cell, c) => (
                <div
                  key={c}
                  className={`relative w-9 h-9 border transition-all duration-150 ${cellClass(r, c)} ${thickC(c)}`}
                >
                  {isRunning ? (
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                      {cell !== '.' ? cell : ''}
                    </span>
                  ) : (
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={grid[r][c] !== '.' ? grid[r][c] : ''}
                      onChange={(e) => handleCellChange(r, c, e.target.value)}
                      className="absolute inset-0 w-full h-full text-center text-sm font-bold bg-transparent outline-none caret-cyan-400"
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Grid action buttons — hidden while running */}
        {!isRunning && (
          <div className="flex gap-3">
            <button
              onClick={handleLoadDefault}
              className="px-4 py-1.5 text-xs font-bold rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            >
              Load Default
            </button>

            <button
              onClick={handleClear}
              className="px-4 py-1.5 text-xs font-bold rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            >
              Clear Grid
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
          <div className="rounded-xl bg-slate-800/60 p-4 border border-slate-700 text-center">
            <p className="text-slate-400 text-xs">Tries</p>
            <h2 className="text-2xl font-bold text-cyan-400 mt-1">
              {tryCount}
            </h2>
          </div>

          <div className="rounded-xl bg-slate-800/60 p-4 border border-slate-700 text-center">
            <p className="text-slate-400 text-xs">Backtracks</p>
            <h2 className="text-2xl font-bold text-orange-400 mt-1">
              {backCount}
            </h2>
          </div>
        </div>

        {done && (
          <p className="text-emerald-400 font-bold text-sm">
            Solved! {tryCount} tries, {backCount} backtracks
          </p>
        )}
      </div>

      <div className="mt-8 mb-2">
        <StatusDisplay message={status} />
      </div>
    </div>
  )
}
