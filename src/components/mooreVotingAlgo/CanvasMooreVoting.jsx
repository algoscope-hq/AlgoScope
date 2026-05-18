import React, { useEffect, useState } from 'react'
import StatusDisplay from '../StatusDisplay'

export const CanvasMooreVoting = ({ numbers, speed }) => {
  const [activeIndex, setActiveIndex] = useState(-1)
  const [candidate, setCandidate] = useState(null)
  const [count, setCount] = useState(0)
  const [status, setStatus] = useState('Enter array and start visualization.')

  useEffect(() => {
    if (!numbers.length) {
      return
    }

    let timers = []
    let currentCandidate = null
    let currentCount = 0

    numbers.forEach((num, i) => {
      const timer = setTimeout(
        () => {
          setActiveIndex(i)

          let actionsMessage = ''

          if (currentCount === 0) {
            currentCandidate = num
            currentCount = 1
            actionsMessage = `Count is 0. New candidate picked: ${num}. Count reset to 1.`
          } else if (num === currentCandidate) {
            currentCount++
            actionsMessage = `Matches candidate (${num}). Count increased to ${currentCount}.`
          } else {
            currentCount--
            actionsMessage = `Different from candidate. Count decreased to ${currentCount}.`
          }

          setCandidate(currentCandidate)
          setCount(currentCount)

          setStatus(`Checking index ${i} (Value: ${num}) | ${actionsMessage}`)
        },
        i * (1200 / speed)
      )

      timers.push(timer)
    })

    return () => timers.forEach(clearTimeout)
  }, [numbers, speed])

  const displayActiveIndex = numbers.length ? activeIndex : -1
  const displayCandidate =
    numbers.length && candidate !== null ? candidate : 'None'
  const displayCount = numbers.length ? count : 0
  const displayStatus = numbers.length
    ? status
    : 'Enter array and start visualization.'

  return (
    <div className="w-full">
      <div className="rounded-xl border border-white/10 bg-slate-900/50 p-8 shadow-lg min-h-[350px] flex flex-col justify-center">
        <div className="flex flex-wrap justify-center gap-4">
          {numbers.map((num, idx) => {
            // Highlights elements that match the currently selected candidate
            const isMatchingCandidate = candidate !== null && num === candidate

            return (
              <div
                key={idx}
                className={`w-16 h-16 rounded-xl flex items-center justify-center text-xl font-bold border-2 transition-all duration-500
                ${
                  idx === displayActiveIndex
                    ? 'bg-cyan-500 text-black scale-110 border-white'
                    : isMatchingCandidate
                      ? 'bg-emerald-500/30 border-emerald-400 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-200'
                }`}
              >
                {num}
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
          <div className="rounded-xl bg-slate-800/60 p-5 border border-slate-700">
            <p className="text-slate-400 text-sm">Current Candidate</p>
            <h2 className="text-3xl font-bold text-cyan-400 mt-2">
              {displayCandidate}
            </h2>
          </div>

          <div className="rounded-xl bg-slate-800/60 p-5 border border-slate-700">
            <p className="text-slate-400 text-sm">Count</p>
            <h2 className="text-3xl font-bold text-emerald-400 mt-2">
              {displayCount}
            </h2>
          </div>
        </div>
      </div>

      <div className="mt-8 mb-2">
        <StatusDisplay message={displayStatus} />
      </div>
    </div>
  )
}
