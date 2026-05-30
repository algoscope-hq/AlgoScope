import React, { useMemo, useState } from 'react'
import { GitBranch, BarChart3 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import StatusDisplay from '../StatusDisplay'
import { formatComplex } from '../../lib/utils'
import { generateSignal } from '../../algorithms/mathTheory/mathTheorySteps'

// ButterflyDiagram

function ButterflyDiagram({ nodes, butterflies, stage, totalStages }) {
  const n = nodes.length
  const W = 580
  const rowH = Math.max(22, Math.min(56, 320 / Math.max(n, 1)))
  const H = n * rowH + 80
  const cols = totalStages + 1
  const colX = (c) => 52 + c * ((W - 72) / cols)
  const nodeY = (i) => 36 + i * rowH + rowH / 2

  const nodeColor = (s) =>
    ({ active: '#a855f7', computing: '#f59e0b', done: '#10b981' })[s] ??
    '#334155'
  const nodeStroke = (s) =>
    ({ active: '#d8b4fe', computing: '#fde68a', done: '#6ee7b7' })[s] ??
    '#475569'
  const activeSet = new Set(butterflies.flatMap((b) => [b.top, b.bot]))

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      style={{ maxHeight: 360 }}
    >
      {/* Column headers */}
      {Array.from({ length: cols }, (_, c) => (
        <text
          key={c}
          x={colX(c)}
          y={18}
          textAnchor="middle"
          fontSize={9}
          fill="#64748b"
          fontFamily="monospace"
        >
          {c === 0 ? 'input' : `stage ${c}`}
        </text>
      ))}

      {/* Active butterfly connections */}
      {butterflies.map((b, bi) => {
        const x1 = colX(stage - 1),
          x2 = colX(stage)
        const yT = nodeY(b.top),
          yB = nodeY(b.bot)
        return (
          <g key={bi}>
            <line
              x1={x1}
              y1={yT}
              x2={x2}
              y2={yB}
              stroke="#a855f7"
              strokeWidth={1.5}
              strokeDasharray="4 2"
              opacity={0.7}
            />
            <line
              x1={x1}
              y1={yB}
              x2={x2}
              y2={yT}
              stroke="#f59e0b"
              strokeWidth={1.5}
              strokeDasharray="4 2"
              opacity={0.7}
            />
            <line
              x1={x1}
              y1={yT}
              x2={x2}
              y2={yT}
              stroke="#a855f7"
              strokeWidth={0.8}
              opacity={0.35}
            />
            <line
              x1={x1}
              y1={yB}
              x2={x2}
              y2={yB}
              stroke="#f59e0b"
              strokeWidth={0.8}
              opacity={0.35}
            />
            {b.twiddleRe !== undefined && b.twiddleIm !== undefined && (
              <text
                x={(x1 + x2) / 2}
                y={(yT + yB) / 2 - 5}
                textAnchor="middle"
                fontSize={8}
                fill="#94a3b8"
                fontFamily="monospace"
              >
                {formatComplex(b.twiddleRe, b.twiddleIm)}
              </text>
            )}
          </g>
        )
      })}

      {/* Pass-through lines for inactive nodes */}
      {stage > 0 &&
        nodes.map((_, i) => {
          if (activeSet.has(i)) return null
          const y = nodeY(i)
          return (
            <line
              key={i}
              x1={colX(stage - 1)}
              y1={y}
              x2={colX(stage)}
              y2={y}
              stroke="#1e293b"
              strokeWidth={1}
            />
          )
        })}

      {/* Nodes */}
      {nodes.map((node, i) => {
        const cx = colX(stage)
        const cy = nodeY(i)
        return (
          <g key={i}>
            <motion.circle
              cx={cx}
              cy={cy}
              r={rowH * 0.27}
              fill={nodeColor(node.state)}
              stroke={nodeStroke(node.state)}
              strokeWidth={1.5}
              initial={{ scale: 0.6, opacity: 0.3 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25 }}
            />
            <text
              x={cx}
              y={cy}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={rowH * 0.22}
              fill="#f1f5f9"
              fontWeight="700"
              fontFamily="monospace"
            >
              {i}
            </text>
            <text
              x={cx + rowH * 0.38}
              y={cy}
              dominantBaseline="middle"
              fontSize={9}
              fill="#94a3b8"
              fontFamily="monospace"
            >
              {formatComplex(node.re, node.im)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// MagnitudeChart

function MagnitudeChart({ nodes }) {
  const mags = nodes.map((nd) =>
    Math.sqrt((nd.re ?? 0) ** 2 + (nd.im ?? 0) ** 2)
  )
  const maxMag = Math.max(...mags, 1)

  return (
    <div className="w-full space-y-4">
      <p className="text-[10px] text-slate-500 uppercase tracking-widest text-center font-mono">
        |X[k]| — Magnitude spectrum
      </p>

      {/* Bar chart */}
      <div className="relative h-40 w-full">
        <div className="absolute inset-0 flex items-end gap-1.5 px-3 pb-6">
          {mags.map((m, i) => (
            <div
              key={i}
              className="flex-1 flex flex-col items-center justify-end h-full gap-1"
            >
              <motion.div
                className="w-full rounded-t min-h-[2px]"
                style={{ background: `hsl(${180 + i * 15}, 70%, 55%)` }}
                initial={{ height: 0 }}
                animate={{ height: `${(m / maxMag) * 100}%` }}
                transition={{
                  duration: 0.4,
                  type: 'spring',
                  stiffness: 180,
                  damping: 20,
                }}
              />
              <span className="text-[10px] text-slate-500 font-mono leading-none">
                {i}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Value cards */}
      <div className="grid grid-cols-2 gap-2">
        {nodes.slice(0, 8).map((nd, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/40 border border-slate-700/30"
          >
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: `hsl(${180 + i * 15}, 70%, 55%)` }}
            />
            <span className="text-[11px] font-mono text-slate-300 truncate">
              X[{i}] = {formatComplex(nd.re, nd.im)}
            </span>
            <span className="text-[11px] font-mono text-slate-500 ml-auto flex-shrink-0 tabular-nums">
              {mags[i].toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// StatCard

function StatCard({ label, value, color, subtext }) {
  return (
    <div className="rounded-xl bg-slate-800/40 px-4 py-3 border border-slate-700/30 text-center flex flex-col gap-1">
      <p className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold font-mono">
        {label}
      </p>
      <p className={`text-2xl font-bold font-mono ${color}`}>{value}</p>
      {subtext && (
        <p className="text-[9px] text-slate-600 font-mono">{subtext}</p>
      )}
    </div>
  )
}

// CanvasFFT  — main export

export const CanvasFFT = ({ currentStep, fftN, fftType }) => {
  const [view, setView] = useState('butterfly')

  const validN = [4, 8, 16].find((p) => p >= fftN) ?? 8
  const totalStages = Math.log2(validN)

  const idleSignal = generateSignal(validN, fftType)
  const nodes =
    currentStep?.nodes ??
    idleSignal.map((v, i) => ({ index: i, re: v, im: 0, state: 'idle' }))
  const butterflies = currentStep?.butterflies ?? []
  const stage = currentStep?.stage ?? 0
  const naiveOps = currentStep?.variables?.naiveOps ?? validN * validN
  const fftOps = currentStep?.variables?.fftOps ?? 0
  const message =
    currentStep?.message ?? 'Enter signal values and click Visualize.'

  const speedup = useMemo(() => {
    const ops = fftOps || validN * Math.log2(validN)
    return (naiveOps / ops).toFixed(1)
  }, [naiveOps, fftOps, validN])

  const totalFftOps = fftOps || Math.round(validN * Math.log2(validN))

  const TABS = [
    {
      key: 'butterfly',
      label: 'Butterfly',
      icon: <GitBranch size={14} />,
      cls: 'bg-purple-500/20 text-purple-700 border-purple-400 shadow-sm',
    },
    {
      key: 'magnitude',
      label: 'Spectrum',
      icon: <BarChart3 size={14} />,
      cls: 'bg-cyan-500/20 text-cyan-700 border-cyan-400 shadow-sm',
    },
  ]

  return (
    <div className="w-full">
      <div
        className="rounded-2xl border border-white/8 bg-slate-900/60 backdrop-blur-sm
                      shadow-xl shadow-black/30 overflow-hidden"
      >
        {/* Tab bar */}
        <div className="flex items-center justify-between px-5 sm:px-7 pt-5 pb-4 border-b border-white/5">
          <div className="flex bg-slate-950/80 p-1 rounded-xl border border-white/5 gap-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setView(t.key)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide uppercase
                            transition-all duration-200 border flex items-center gap-2
                            ${
                              view === t.key
                                ? `${t.cls} shadow-sm`
                                : 'text-slate-500 border-transparent hover:text-slate-200'
                            }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </div>
          {/* Inline stage pill */}
          <div className="text-xs font-mono text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/30">
            {stage > 0 ? (
              <span>
                stage <span className="text-purple-400 font-bold">{stage}</span>{' '}
                / {totalStages}
              </span>
            ) : (
              <span className="text-slate-600">idle</span>
            )}
          </div>
        </div>

        {/* Content area */}
        <div className="px-5 sm:px-7 py-5 min-h-[300px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {view === 'butterfly' && (
              <motion.div
                key="butterfly"
                className="w-full overflow-x-auto"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <ButterflyDiagram
                  nodes={nodes}
                  butterflies={butterflies}
                  stage={stage}
                  totalStages={totalStages}
                />
              </motion.div>
            )}
            {view === 'magnitude' && (
              <motion.div
                key="magnitude"
                className="w-full"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <MagnitudeChart nodes={nodes} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-3 px-5 sm:px-7 pb-5 border-t border-white/5 pt-4">
          <StatCard
            label="Total FFT Ops"
            value={totalFftOps}
            color="text-cyan-400"
            subtext={`N·log₂N = ${validN}·${totalStages}`}
          />
          <StatCard
            label="Total DFT Ops"
            value={naiveOps}
            color="text-rose-400"
            subtext={`N² = ${validN}²`}
          />
          <StatCard
            label="Speedup"
            value={`${speedup}×`}
            color="text-emerald-400"
            subtext="FFT vs naive DFT"
          />
        </div>
      </div>

      <div className="mt-6">
        <StatusDisplay message={message} />
      </div>
    </div>
  )
}
