import React from 'react';
import { motion } from 'framer-motion';

export default function WindowBars({ array, windowStart, windowEnd, maxStartIndex, windowSize }) {
  const maxVal = Math.max(...array);

  return (
    <div className="relative flex h-64 items-end justify-center gap-2 overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-950/40 p-6 backdrop-blur-sm">
      {array.map((val, idx) => {
        const isInside = windowStart !== undefined && idx >= windowStart && idx <= windowEnd;
        const isMax = maxStartIndex !== undefined && idx >= maxStartIndex && idx < maxStartIndex + windowSize;
        
        return (
          <div key={idx} className="relative flex flex-1 flex-col items-center justify-end h-full max-w-[40px]">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(val / maxVal) * 80}%` }}
              className={`w-full rounded-t-md border transition-all duration-500 ${
                isInside
                  ? 'border-cyan-400 bg-cyan-500/40 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                  : isMax
                    ? 'border-emerald-400 bg-emerald-500/40'
                    : 'border-slate-700 bg-slate-800/60'
              }`}
            />
            <span className={`mt-2 text-xs font-bold ${isInside ? 'text-cyan-400' : 'text-slate-500'}`}>
              {val}
            </span>
            
            {/* Visual pointers for window boundaries */}
            {idx === windowStart && (
              <motion.div 
                layoutId="windowStart"
                className="absolute -bottom-2 h-1 w-full bg-cyan-400 rounded-full"
              />
            )}
            {idx === windowEnd && (
              <motion.div 
                layoutId="windowEnd"
                className="absolute -bottom-2 h-1 w-full bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]"
              />
            )}
          </div>
        );
      })}

      {/* Sliding Window Overlay */}
      {windowStart !== undefined && (
        <motion.div
          initial={false}
          animate={{
            left: `${(windowStart / array.length) * 100}%`,
            width: `${(windowSize / array.length) * 100}%`,
          }}
          className="absolute bottom-6 h-[85%] rounded-xl border-2 border-dashed border-cyan-400/30 bg-cyan-400/5 pointer-events-none"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </div>
  );
}
