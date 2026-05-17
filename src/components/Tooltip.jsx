import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

/* Props:
   content   {string}  – tooltip text
   position  {string}  – 'top' | 'bottom' | 'left' | 'right'  (default: 'top')
   className {string}  – extra classes applied to the wrapper <div>
*/

const Tooltip = ({ content, children, position = 'top', className = '' }) => {
  const [visible, setVisible] = useState(false)

  // Positioning classes for the tooltip bubble
  const positionMap = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  // Arrow pointer classes
  const arrowMap = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-slate-700',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-slate-700',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-slate-700',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-slate-700',
  }

  const motionInitial = {
    top: { opacity: 0, y: 6, scale: 0.94 },
    bottom: { opacity: 0, y: -6, scale: 0.94 },
    left: { opacity: 0, x: 6, scale: 0.94 },
    right: { opacity: 0, x: -6, scale: 0.94 },
  }

  const motionAnimate = { opacity: 1, y: 0, x: 0, scale: 1 }
  const motionExit = { opacity: 0, scale: 0.9 }

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}

      <AnimatePresence>
        {visible && content && (
          <motion.div
            role="tooltip"
            initial={motionInitial[position] ?? motionInitial.top}
            animate={motionAnimate}
            exit={motionExit}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className={`pointer-events-none absolute z-50 ${positionMap[position] ?? positionMap.top}`}
          >
            {/* Bubble */}
            <div className="relative whitespace-nowrap rounded-lg border border-slate-700 bg-slate-900/95 px-3 py-1.5 text-xs font-mono font-medium text-cyan-300 shadow-2xl backdrop-blur-md">
              {content}
              {/* Arrow */}
              <span
                className={`absolute border-4 ${arrowMap[position] ?? arrowMap.top}`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Tooltip