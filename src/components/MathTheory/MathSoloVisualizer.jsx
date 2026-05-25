import React, { useMemo, useState } from 'react'
import SpeedSlider from '../SpeedSlider'
import ComplexityCard from '../ComplexityCard'
import CodePanel from '../visualizer/CodePanel'
import Tooltip from '../Tooltip'
import { useStepPlayback } from '../visualizer/useStepPlayback'
import { CanvasGCD } from './CanvasGCD'
import { CanvasFastExpo } from './CanvasFastExpo.jsx'
import { CanvasBitManip } from './CanvasBitManip.jsx'
import { CanvasSieve } from './CanvasSieve.jsx'
import { CanvasFibonacci } from './CanvasFibonacci.jsx'
import {
  generateEuclideanGCDSteps,
  generateFastExpoSteps,
  generateBitOpSteps,
  generateSieveSteps,
  generateFibonacciSteps,
} from '../../algorithms/mathTheory/mathTheorySteps'
import {
  getGCDSource,
  getFastExpoSource,
  getBitManipSource,
  getSieveSource,
  getFibonacciSource,
  resolveGCDLine,
  resolveFastExpoLine,
  resolveBitManipLine,
  resolveSieveLine,
  resolveFibonacciLine,
} from '../../algorithms/mathTheory/mathTheorySources'

const ALGO_TABS = [
  { key: 'gcd', label: 'Euclidean GCD', complexityKey: 'gcd' },
  { key: 'expo', label: 'Fast Exponentiation', complexityKey: 'fastexpo' },
  { key: 'bits', label: 'Bit Manipulation', complexityKey: 'bitmanip' },
  { key: 'sieve', label: 'Sieve of Eratosthenes', complexityKey: 'sieve' },
  { key: 'fibonacci', label: 'Fibonacci Sequence', complexityKey: 'fibonacci' },
]

export const MathSoloVisualizer = () => {
  const [algo, setAlgo] = useState('gcd')
  const [speed, setSpeed] = useState(1)
  const [language, setLanguage] = useState('javascript')

  // GCD state
  const [gcdA, setGcdA] = useState(48)
  const [gcdB, setGcdB] = useState(18)

  // Fast expo state
  const [expoBase, setExpoBase] = useState(2)
  const [expoExp, setExpoExp] = useState(10)

  // Bit manip state
  const [bitA, setBitA] = useState(42)
  const [bitB, setBitB] = useState(15)
  const [bitOp, setBitOp] = useState('AND')

  // Sieve state
  const [sieveLimit, setSieveLimit] = useState(30)

  // Fibonacci state
  const [fibLimit, setFibLimit] = useState(6)
  const [isStepMode, setIsStepMode] = useState(false)

  const {
    currentStep,
    currentStepIndex,
    hasSteps,
    isPlaying,
    isComplete,
    loadSteps,
    clear,
    play,
    pause,
    replay,
    stepForward,
    stepBackward,
  } = useStepPlayback({ speed })

  const handleVisualize = () => {
    clear()
    if (algo === 'gcd') {
      loadSteps(generateEuclideanGCDSteps(Number(gcdA), Number(gcdB)), {
        autoPlay: !isStepMode,
      })
    } else if (algo === 'expo') {
      loadSteps(generateFastExpoSteps(Number(expoBase), Number(expoExp)), {
        autoPlay: !isStepMode,
      })
    } else if (algo === 'sieve') {
      loadSteps(generateSieveSteps(Number(sieveLimit)), {
        autoPlay: !isStepMode,
      })
    } else if (algo === 'fibonacci') {
      loadSteps(generateFibonacciSteps(Number(fibLimit)), {
        autoPlay: !isStepMode,
      })
    } else {
      loadSteps(generateBitOpSteps(Number(bitA), Number(bitB), bitOp), {
        autoPlay: !isStepMode,
      })
    }
  }

  const handleReset = () => {
    clear()
  }

  const currentSource = useMemo(() => {
    if (algo === 'gcd') return getGCDSource(language)
    if (algo === 'expo') return getFastExpoSource(language)
    if (algo === 'sieve') return getSieveSource(language)
    if (algo === 'fibonacci') return getFibonacciSource(language)
    return getBitManipSource(language)
  }, [algo, language])

  const activeLine = useMemo(() => {
    if (!currentStep?.lineKey) return undefined
    if (algo === 'gcd') return resolveGCDLine(language, currentStep.lineKey)
    if (algo === 'expo')
      return resolveFastExpoLine(language, currentStep.lineKey)
    if (algo === 'sieve') return resolveSieveLine(language, currentStep.lineKey)
    if (algo === 'fibonacci')
      return resolveFibonacciLine(language, currentStep.lineKey)
    if (algo === 'bits')
      return resolveBitManipLine(language, currentStep.lineKey)
    return undefined
  }, [algo, currentStep, language])

  const activeComplexityKey = ALGO_TABS.find(
    (t) => t.key === algo
  )?.complexityKey

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6">
      {/* Sidebar */}
      <div className="w-full lg:w-1/4 xl:w-1/5 p-4 flex flex-col gap-5 bg-slate-900/80 shadow-xl rounded-xl border border-white/5 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-center text-white border-b border-white/10 pb-4 tracking-tight">
          Controls
        </h2>

        {/* Algorithm sub-tabs */}
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80 mb-2">
            Algorithm
          </p>
          {ALGO_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setAlgo(t.key)
                clear()
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                ${
                  algo === t.key
                    ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300'
                    : 'bg-slate-800/60 border border-transparent text-slate-400 hover:text-white hover:bg-slate-700/60'
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Inputs per algorithm */}
        {algo === 'gcd' && (
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Inputs
            </p>
            <Tooltip content="First number" position="right" className="w-full">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">A</label>
                <input
                  type="number"
                  min={1}
                  max={9999}
                  value={gcdA}
                  onChange={(e) => setGcdA(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm"
                />
              </div>
            </Tooltip>
            <Tooltip
              content="Second number"
              position="right"
              className="w-full"
            >
              <div>
                <label className="text-xs text-slate-500 mb-1 block">B</label>
                <input
                  type="number"
                  min={1}
                  max={9999}
                  value={gcdB}
                  onChange={(e) => setGcdB(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm"
                />
              </div>
            </Tooltip>
          </div>
        )}

        {algo === 'expo' && (
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Inputs
            </p>
            <Tooltip content="Base value" position="right" className="w-full">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  Base
                </label>
                <input
                  type="number"
                  min={2}
                  max={20}
                  value={expoBase}
                  onChange={(e) => setExpoBase(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm"
                />
              </div>
            </Tooltip>
            <Tooltip
              content="Exponent (keep ≤ 15 for readability)"
              position="right"
              className="w-full"
            >
              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  Exponent
                </label>
                <input
                  type="number"
                  min={1}
                  max={15}
                  value={expoExp}
                  onChange={(e) => setExpoExp(Math.min(15, e.target.value))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm"
                />
              </div>
            </Tooltip>
          </div>
        )}

        {algo === 'bits' && (
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Inputs
            </p>
            <Tooltip
              content="First operand (0–255)"
              position="right"
              className="w-full"
            >
              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  A (0–255)
                </label>
                <input
                  type="number"
                  min={0}
                  max={255}
                  value={bitA}
                  onChange={(e) =>
                    setBitA(Math.min(255, Math.max(0, e.target.value)))
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm"
                />
              </div>
            </Tooltip>
            <Tooltip
              content="Second operand (not used for NOT, shifts)"
              position="right"
              className="w-full"
            >
              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  B (0–255)
                </label>
                <input
                  type="number"
                  min={0}
                  max={255}
                  value={bitB}
                  onChange={(e) =>
                    setBitB(Math.min(255, Math.max(0, e.target.value)))
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm"
                />
              </div>
            </Tooltip>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">
                Operation
              </label>
              <select
                value={bitOp}
                onChange={(e) => setBitOp(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm"
              >
                {['AND', 'OR', 'XOR', 'NOT', 'LSHIFT', 'RSHIFT'].map((op) => (
                  <option key={op} value={op}>
                    {op}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {algo === 'sieve' && (
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Inputs
            </p>
            <Tooltip
              content="Limit value (10–100)"
              position="right"
              className="w-full"
            >
              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  Limit (N)
                </label>
                <input
                  type="number"
                  min={10}
                  max={100}
                  value={sieveLimit}
                  onChange={(e) =>
                    setSieveLimit(
                      Math.min(100, Math.max(10, Number(e.target.value)))
                    )
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm"
                />
              </div>
            </Tooltip>
          </div>
        )}

        {algo === 'fibonacci' && (
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Inputs
            </p>
            <Tooltip
              content="Limit (N): keeps tree readable (2–8)"
              position="right"
              className="w-full"
            >
              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  Limit (N)
                </label>
                <input
                  type="number"
                  min={2}
                  max={8}
                  value={fibLimit}
                  onChange={(e) =>
                    setFibLimit(
                      Math.min(8, Math.max(2, Number(e.target.value)))
                    )
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm"
                />
              </div>
            </Tooltip>
          </div>
        )}

        <div className="space-y-3 pt-2 pb-2 border-t border-white/10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-2">
              Speed
            </p>
            <SpeedSlider value={speed} onChange={(e, v) => setSpeed(v)} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-2">
              Language
            </p>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-white outline-none focus:border-cyan-500 text-sm"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
          </div>
        </div>
        <div className="flex rounded-xl overflow-hidden border border-slate-700 mb-2">
          <button
            type="button"
            onClick={() => {
              setIsStepMode(false)
              clear()
            }}
            className={`flex-1 py-2 text-xs font-semibold transition-all ${!isStepMode ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
          >
            Auto
          </button>
          <button
            type="button"
            onClick={() => {
              setIsStepMode(true)
              clear()
            }}
            className={`flex-1 py-2 text-xs font-semibold transition-all ${isStepMode ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
          >
            Step
          </button>
        </div>
        {/* Playback buttons */}
        <div className="space-y-2">
          <Tooltip
            content="Run visualization"
            position="top"
            className="w-full"
          >
            <button
              onClick={handleVisualize}
              className="w-full rounded-xl bg-cyan-500 py-3 font-bold text-black transition hover:bg-cyan-400"
            >
              Visualize
            </button>
          </Tooltip>

          {hasSteps && (
            <div className="flex flex-col gap-2">
              <button
                onClick={isPlaying ? pause : play}
                className="w-full text-sm font-bold py-2.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all"
              >
                {isPlaying ? '⏸ Pause' : '▶ Play'}
              </button>
              <div className="flex gap-2">
                <button
                  onClick={stepBackward}
                  disabled={currentStepIndex <= 0}
                  className="flex-1 text-xs font-bold py-2.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all disabled:opacity-40"
                >
                  ← Step
                </button>
                <button
                  onClick={stepForward}
                  className="flex-1 text-xs font-bold py-2.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all"
                >
                  Step →
                </button>
              </div>
            </div>
          )}

          {isComplete && (
            <button
              onClick={replay}
              className="w-full text-sm font-bold py-2.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all"
            >
              ↺ Replay
            </button>
          )}

          <button
            onClick={handleReset}
            className="w-full text-sm font-bold py-2.5 px-4 rounded-xl transition-all duration-300 bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white"
          >
            Reset
          </button>
        </div>

        <ComplexityCard algorithm={activeComplexityKey} />
      </div>

      {/* Main canvas area */}
      <div className="w-full lg:w-3/4 xl:w-4/5 flex flex-col gap-6">
        {algo === 'gcd' && (
          <CanvasGCD
            currentStep={currentStep}
            inputA={Number(gcdA)}
            inputB={Number(gcdB)}
          />
        )}
        {algo === 'expo' && (
          <CanvasFastExpo
            currentStep={currentStep}
            inputBase={Number(expoBase)}
            inputExp={Number(expoExp)}
          />
        )}
        {algo === 'bits' && (
          <CanvasBitManip
            currentStep={currentStep}
            inputA={Number(bitA)}
            inputB={Number(bitB)}
            operation={bitOp}
          />
        )}
        {algo === 'sieve' && (
          <CanvasSieve
            currentStep={currentStep}
            inputLimit={Number(sieveLimit)}
          />
        )}
        {algo === 'fibonacci' && (
          <CanvasFibonacci
            currentStep={currentStep}
            inputLimit={Number(fibLimit)}
          />
        )}

        <CodePanel
          title={`${ALGO_TABS.find((t) => t.key === algo)?.label} Implementation`}
          code={currentSource}
          language={language}
          activeLine={activeLine}
          onLanguageChange={setLanguage}
        />
      </div>
    </div>
  )
}
