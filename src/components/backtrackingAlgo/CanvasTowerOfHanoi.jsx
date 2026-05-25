import React, { useEffect, useMemo, useRef, useState } from 'react'
import StatusDisplay from '../StatusDisplay'
import { calculateStepDelay } from '../../lib/utils'

const RODS = ['A', 'B', 'C']

function generateHanoiFrames(diskCount) {
  const rods = {
    A: Array.from({ length: diskCount }, (_, index) => diskCount - index),
    B: [],
    C: [],
  }
  const frames = []
  let moveNumber = 0

  function snapshot(type, message, active = {}) {
    frames.push({
      rods: {
        A: [...rods.A],
        B: [...rods.B],
        C: [...rods.C],
      },
      type,
      message,
      moveNumber,
      ...active,
    })
  }

  function moveDisk(from, to) {
    const disk = rods[from].pop()
    rods[to].push(disk)
    moveNumber += 1
    snapshot('move', `Move disk ${disk} from rod ${from} to rod ${to}.`, {
      from,
      to,
      disk,
    })
  }

  function solve(n, source, auxiliary, destination, depth = 1) {
    snapshot(
      'call',
      n === 1
        ? `Base case: move disk 1 from ${source} to ${destination}.`
        : `Move ${n - 1} disk${n - 1 === 1 ? '' : 's'} from ${source} to ${auxiliary} first.`,
      { source, auxiliary, destination, depth, activeN: n }
    )

    if (n === 1) {
      moveDisk(source, destination)
      return
    }

    solve(n - 1, source, destination, auxiliary, depth + 1)
    moveDisk(source, destination)
    solve(n - 1, auxiliary, source, destination, depth + 1)
  }

  snapshot('start', `Starting Tower of Hanoi with ${diskCount} disks.`)
  solve(diskCount, 'A', 'B', 'C')
  snapshot('complete', `Complete in ${moveNumber} moves.`)

  return frames
}

export const CanvasTowerOfHanoi = ({
  diskCount = 4,
  speed = 1,
  trigger = 0,
}) => {
  const [frame, setFrame] = useState(null)
  const [doneTrigger, setDoneTrigger] = useState(null)
  const timerRef = useRef(null)

  const frames = useMemo(() => {
    if (trigger === 0) return []
    return generateHanoiFrames(diskCount)
  }, [trigger, diskCount])

  useEffect(() => {
    clearTimeout(timerRef.current)

    if (trigger === 0 || frames.length === 0) return

    const delay = calculateStepDelay(260, speed)

    function scheduleNext(index) {
      if (index >= frames.length) return

      timerRef.current = setTimeout(() => {
        setFrame({ ...frames[index], trigger })
        if (index === frames.length - 1) {
          setDoneTrigger(trigger)
        } else {
          scheduleNext(index + 1)
        }
      }, delay)
    }

    scheduleNext(0)

    return () => clearTimeout(timerRef.current)
  }, [trigger, speed, frames])

  const activeFrame = frame?.trigger === trigger ? frame : null
  const done = doneTrigger === trigger && trigger !== 0
  const displayRods = activeFrame?.rods ?? {
    A: Array.from({ length: diskCount }, (_, index) => diskCount - index),
    B: [],
    C: [],
  }
  const totalMoves = 2 ** diskCount - 1
  const currentMove = Math.min(activeFrame?.moveNumber ?? 0, totalMoves)
  const status =
    activeFrame?.message ??
    'Choose disk count and click Visualize to watch the recursive moves.'

  const diskClass = (rodKey, disk) => {
    if (
      activeFrame?.type === 'move' &&
      activeFrame?.to === rodKey &&
      activeFrame?.disk === disk
    ) {
      return 'bg-cyan-400 text-slate-950 shadow-[0_0_18px_rgba(34,211,238,0.55)]'
    }

    if (
      activeFrame?.type === 'move' &&
      activeFrame?.from === rodKey &&
      activeFrame?.disk === disk
    ) {
      return 'bg-orange-400 text-slate-950'
    }

    return 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white'
  }

  return (
    <div className="w-full">
      <div className="rounded-xl border border-white/10 bg-slate-900/50 p-5 sm:p-8 shadow-lg min-h-[350px] flex flex-col items-center justify-center gap-6">
        <div className="grid w-full max-w-4xl grid-cols-1 gap-5 sm:grid-cols-3">
          {RODS.map((rodKey) => {
            const isActive =
              activeFrame?.from === rodKey ||
              activeFrame?.to === rodKey ||
              activeFrame?.source === rodKey ||
              activeFrame?.destination === rodKey ||
              activeFrame?.auxiliary === rodKey

            return (
              <div
                key={rodKey}
                className={`relative flex h-72 flex-col justify-end rounded-xl border p-4 transition-all duration-200 ${
                  isActive
                    ? 'border-cyan-400/70 bg-cyan-500/10'
                    : 'border-slate-700 bg-slate-950/50'
                }`}
              >
                <div className="absolute bottom-5 left-1/2 h-56 w-2 -translate-x-1/2 rounded-full bg-slate-600" />
                <div className="absolute bottom-4 left-6 right-6 h-3 rounded-full bg-slate-600" />

                <div className="relative z-10 flex min-h-56 flex-col-reverse items-center justify-start gap-1 pb-4">
                  {displayRods[rodKey].map((disk) => {
                    const width = 34 + disk * 13
                    return (
                      <div
                        key={`${rodKey}-${disk}`}
                        className={`h-7 rounded-lg border border-white/30 text-center text-xs font-extrabold leading-7 transition-all duration-300 ${diskClass(
                          rodKey,
                          disk
                        )}`}
                        style={{
                          width: `${Math.min(width, 132)}px`,
                        }}
                      >
                        {disk}
                      </div>
                    )
                  })}
                </div>

                <div className="relative z-10 mt-3 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                    Rod {rodKey}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid w-full max-w-xl grid-cols-3 gap-4">
          <div className="rounded-xl bg-slate-800/60 p-4 border border-slate-700 text-center">
            <p className="text-slate-400 text-xs">Disks</p>
            <h2 className="text-2xl font-bold text-cyan-400 mt-1">
              {diskCount}
            </h2>
          </div>

          <div className="rounded-xl bg-slate-800/60 p-4 border border-slate-700 text-center">
            <p className="text-slate-400 text-xs">Move</p>
            <h2 className="text-2xl font-bold text-emerald-400 mt-1">
              {currentMove}/{totalMoves}
            </h2>
          </div>

          <div className="rounded-xl bg-slate-800/60 p-4 border border-slate-700 text-center">
            <p className="text-slate-400 text-xs">Recursive N</p>
            <h2 className="text-2xl font-bold text-orange-400 mt-1">
              {activeFrame?.activeN ?? '-'}
            </h2>
          </div>
        </div>

        {activeFrame?.type === 'call' && (
          <div className="w-full max-w-xl rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-100">
            <span className="font-bold text-cyan-300">Call depth:</span>{' '}
            {activeFrame.depth} | move {activeFrame.activeN} disk
            {activeFrame.activeN === 1 ? '' : 's'} from {activeFrame.source} to{' '}
            {activeFrame.destination} using {activeFrame.auxiliary}.
          </div>
        )}

        {done && (
          <p className="text-emerald-400 font-bold text-sm">
            Complete in {totalMoves} moves.
          </p>
        )}
      </div>

      <div className="mt-8 mb-2">
        <StatusDisplay message={status} />
      </div>
    </div>
  )
}
