import React, { useState, useEffect } from 'react'

const StatusDisplay = ({ message }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(timer)
  }, [message])

  return (
    <div
      className={`
      flex items-center gap-4
      w-full
      px-4 py-3 mt-4
      rounded-xl border-l-4 border-l-cyan-500
      border border-slate-700/50
      bg-slate-900/80 backdrop-blur-md
      shadow-lg shadow-cyan-900/20
      transition-all duration-500 ease-out
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      <div className="flex-shrink-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-cyan-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <div className="font-medium text-slate-200">{message}</div>
    </div>
  )
}

export default StatusDisplay
