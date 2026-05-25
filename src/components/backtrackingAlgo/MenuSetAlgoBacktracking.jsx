import React from 'react'
import Tooltip from '../Tooltip'

export const MenuSetAlgoBacktracking = ({
  algo,
  setAlgo,
  boardSize,
  setBoardSize,
  diskCount,
  setDiskCount,
  onVisualize,
  onReset,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider pl-1">
        Backtracking Controls
      </h3>

      <div className="space-y-3">
        {/* Algorithm selector */}
        <div>
          <label className="block text-xs text-slate-400 mb-1 pl-1">
            Algorithm
          </label>

          <div className="grid grid-cols-3 rounded-xl overflow-hidden border border-slate-700">
            {['nqueens', 'sudoku', 'hanoi'].map((key) => (
              <button
                key={key}
                onClick={() => setAlgo(key)}
                className={`flex-1 py-2.5 text-xs font-bold transition-all duration-200 ${
                  algo === key
                    ? 'bg-cyan-500 text-black'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {key === 'nqueens'
                  ? 'N-Queens'
                  : key === 'sudoku'
                    ? 'Sudoku'
                    : 'Hanoi'}
              </button>
            ))}
          </div>
        </div>

        {/* N-Queens Board Size */}
        {algo === 'nqueens' && (
          <Tooltip
            content="Larger boards have exponentially more backtracking steps"
            position="right"
            className="w-full"
          >
            <div>
              <label className="block text-xs text-slate-400 mb-1 pl-1">
                Board Size (N)
              </label>

              <select
                value={boardSize}
                onChange={(e) => setBoardSize(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-500"
              >
                {[4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    {n} × {n}
                  </option>
                ))}
              </select>
            </div>
          </Tooltip>
        )}

        {/* Tower of Hanoi Disk Count */}
        {algo === 'hanoi' && (
          <Tooltip
            content="Each extra disk doubles the number of moves"
            position="right"
            className="w-full"
          >
            <div>
              <label className="block text-xs text-slate-400 mb-1 pl-1">
                Disk Count
              </label>

              <select
                value={diskCount}
                onChange={(e) => setDiskCount(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-500"
              >
                {[3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    {n} disks - {2 ** n - 1} moves
                  </option>
                ))}
              </select>
            </div>
          </Tooltip>
        )}

        {/* Sudoku Info */}
        {algo === 'sudoku' && (
          <Tooltip
            content="Edit the grid directly before running the solver"
            position="right"
            className="w-full"
          >
            <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-4">
              <p className="text-sm font-semibold text-cyan-400">Sudoku Mode</p>

              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Enter digits directly into the board, then click{' '}
                <span className="text-white font-semibold">Visualize</span> to
                watch the backtracking solver.
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Supports custom puzzles, default puzzle loading, and live
                backtracking animation.
              </p>
            </div>
          </Tooltip>
        )}

        {/* Visualize */}
        <Tooltip
          content="Start the backtracking animation"
          position="top"
          className="w-full"
        >
          <button
            onClick={onVisualize}
            className="w-full rounded-xl bg-cyan-500 py-3 font-bold text-black transition hover:bg-cyan-400"
          >
            Visualize
          </button>
        </Tooltip>

        {/* Reset */}
        <Tooltip
          content="Reset visualization"
          position="top"
          className="w-full"
        >
          <button
            onClick={onReset}
            className="w-full text-sm font-bold py-3 px-4 rounded-xl transition-all duration-300 bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white"
          >
            Reset
          </button>
        </Tooltip>
      </div>
    </div>
  )
}
