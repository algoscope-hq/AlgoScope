import { useState } from 'react'
import { DEFAULT_GREEDY_ALGORITHM, GREEDY_ALGORITHMS } from '../../data/greedyAlgorithms'
import { useStepPlayback } from '../visualizer/useStepPlayback'
import GreedyAlgorithmSelector from './GreedyAlgorithmSelector'
import GreedyCodeViewer from './GreedyCodeViewer'
import GreedyComplexityCard from './GreedyComplexityCard'
import GreedyInformationPanel from './GreedyInformationPanel'
import GreedyInputEditor from './GreedyInputEditor'
import GreedyPlaybackControls from './GreedyPlaybackControls'
import GreedyPseudocodePanel from './GreedyPseudocodePanel'
import GreedySidebar from './GreedySidebar'
import GreedyTimeline from './GreedyTimeline'
import GreedyVisualizationArea from './GreedyVisualizationArea'
import { generateSteps, VISUALIZER_CONFIG } from './greedyStepGenerators'

export default function GreedyAlgorithmsPage() {
  const [selectedId, setSelectedId] = useState(DEFAULT_GREEDY_ALGORITHM.id)
  const [speed, setSpeed] = useState(1)
  const [inputError, setInputError] = useState('')
  const config = VISUALIZER_CONFIG[selectedId]
  const [input, setInput] = useState(config.sample)
  const [source, setSource] = useState(config.source ?? 'A')
  const selectedAlgorithm = GREEDY_ALGORITHMS.find((algorithm) => algorithm.id === selectedId) ?? DEFAULT_GREEDY_ALGORITHM
  const playback = useStepPlayback({ speed })

  const handleAlgorithmSelect = (nextId) => {
    const nextConfig = VISUALIZER_CONFIG[nextId]
    playback.clear()
    setSelectedId(nextId)
    setInput(nextConfig.sample)
    setSource(nextConfig.source ?? 'A')
    setInputError('')
  }

  const handleStart = () => {
    try {
      const steps = generateSteps(selectedId, input, source)
      playback.loadSteps(steps, { autoPlay: true })
      setInputError('')
    } catch (error) {
      playback.clear()
      setInputError(error instanceof Error ? error.message : 'Unable to create visualization steps.')
    }
  }

  const handleReset = () => {
    playback.clear()
    setInput(config.sample)
    setSource(config.source ?? 'A')
    setInputError('')
  }

  const handleRandom = () => {
    playback.clear()
    setInput(config.random())
    setInputError('')
  }

  const handleInputChange = (nextInput) => {
    playback.clear()
    setInput(nextInput)
    setInputError('')
  }

  const handleSourceChange = (nextSource) => {
    playback.clear()
    setSource(nextSource)
    setInputError('')
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-2 py-4 sm:px-4 sm:py-6">
      <header className="mb-6 rounded-2xl border bg-gradient-to-br from-emerald-500/15 via-transparent to-cyan-500/10 p-6 sm:p-8 theme-border"><p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-400">AlgoScope learning module</p><h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl theme-text-strong">Greedy Algorithms</h1><p className="mt-3 max-w-3xl text-sm leading-6 sm:text-base theme-text-muted">Build intuition by changing the input, then follow every greedy decision through a controlled step-by-step visualization.</p></header>
      <div className="grid gap-5 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <GreedySidebar algorithms={GREEDY_ALGORITHMS} selectedId={selectedAlgorithm.id} onSelect={handleAlgorithmSelect} />
        <div className="min-w-0 space-y-5">
          <GreedyAlgorithmSelector algorithms={GREEDY_ALGORITHMS} selectedId={selectedAlgorithm.id} onSelect={handleAlgorithmSelect} />
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_19rem]">
            <div className="min-w-0 space-y-5"><GreedyVisualizationArea algorithm={selectedAlgorithm} step={playback.currentStep} stepIndex={playback.currentStepIndex} stepCount={playback.steps.length} /><GreedyTimeline steps={playback.steps} currentIndex={playback.currentStepIndex} onSelect={playback.goToStep} /></div>
            <div className="space-y-5"><GreedyInputEditor config={config} input={input} source={source} error={inputError} onChange={handleInputChange} onSourceChange={handleSourceChange} onRandom={handleRandom} /><GreedyPlaybackControls hasSteps={playback.hasSteps} isPlaying={playback.isPlaying} isComplete={playback.isComplete} index={playback.currentStepIndex} total={playback.steps.length} speed={speed} onStart={handleStart} onPause={playback.pause} onResume={playback.play} onReset={handleReset} onBack={playback.stepBackward} onForward={playback.stepForward} onSpeedChange={setSpeed} /><GreedyComplexityCard complexity={selectedAlgorithm.complexity} /></div>
          </div>
          <GreedyPseudocodePanel lines={config.pseudocode} activeLine={playback.currentStep?.line} />
          <GreedyInformationPanel algorithm={selectedAlgorithm} />
          <GreedyCodeViewer algorithm={selectedAlgorithm} />
        </div>
      </div>
    </main>
  )
}
