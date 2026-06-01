import React, { useEffect, useState } from 'react'
import StatusDisplay from '../StatusDisplay'

export const CanvasKadane = ({ numbers, speed }) => {
  const [activeIndex, setActiveIndex] = useState(-1)
  const [maxSum, setMaxSum] = useState(0)
  const [currentSum, setCurrentSum] = useState(0)
  const [bestRange, setBestRange] = useState([0, 0])
  const [status, setStatus] = useState('Enter array and start visualization.')

  useEffect(() => {
    const initTimer = setTimeout(() => {
      setActiveIndex(-1)
      setCurrentSum(0)
      setMaxSum(0)
      setBestRange([0, 0])
      setStatus(
        numbers.length
          ? 'Starting visualization...'
          : 'Enter array and start visualization.'
      )
    }, 0)

    if (!numbers.length) {
      return () => clearTimeout(initTimer)
    }

    let timers = [initTimer]

    let curr = numbers[0]
    let max = numbers[0]

    let start = 0
    let end = 0
    let tempStart = 0

    numbers.forEach((num, i) => {
      const timer = setTimeout(
        () => {
          setActiveIndex(i)

          if (i === 0) {
            setCurrentSum(curr)
            setMaxSum(max)
            setBestRange([0, 0])
            setStatus(`Starting with ${num}`)
            return
          }

          if (curr + num < num) {
            curr = num
            tempStart = i
          } else {
            curr += num
          }

          if (curr > max) {
            max = curr
            start = tempStart
            end = i
          }

          setCurrentSum(curr)
          setMaxSum(max)
          setBestRange([start, end])

          setStatus(
            `Checking index ${i} | Current Sum: ${curr} | Max Sum: ${max}`
          )
        },
        i * (1200 / speed)
      )

      timers.push(timer)
    })

    return () => timers.forEach(clearTimeout)
  }, [numbers, speed])

  const displayActiveIndex = numbers.length ? activeIndex : -1
  const displayCurrentSum = numbers.length ? currentSum : 0
  const displayMaxSum = numbers.length ? maxSum : 0
  const displayBestRange = numbers.length ? bestRange : [0, 0]
  const displayStatus = numbers.length
    ? status
    : 'Enter array and start visualization.'

  return (
    <div className="w-full">
      <div className="rounded-xl border border-white/10 bg-slate-900/50 p-8 shadow-lg min-h-[350px] flex flex-col justify-center">
        <div className="flex flex-wrap justify-center gap-4">
          {numbers.map((num, idx) => {
            const inBest =
              idx >= displayBestRange[0] && idx <= displayBestRange[1]

            return (
              <div
                key={idx}
                className={`w-16 h-16 rounded-xl flex items-center justify-center text-xl font-bold border-2 transition-all duration-500
                ${
                  idx === displayActiveIndex
                    ? 'bg-cyan-500 text-black scale-110 border-white'
                    : inBest
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
            <p className="text-slate-400 text-sm">Current Sum</p>
            <h2 className="text-3xl font-bold text-cyan-400 mt-2">
              {displayCurrentSum}
            </h2>
          </div>

          <div className="rounded-xl bg-slate-800/60 p-5 border border-slate-700">
            <p className="text-slate-400 text-sm">Maximum Sum</p>
            <h2 className="text-3xl font-bold text-emerald-400 mt-2">
              {displayMaxSum}
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
