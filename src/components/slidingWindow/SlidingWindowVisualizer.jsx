import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateFixedWindowSteps } from '../../algorithms/slidingWindow/fixedWindowSteps';
import { useStepPlayback } from '../visualizer/useStepPlayback';
import WindowBars from './WindowBars';
import ControlPanel from './ControlPanel';
import InfoPanel from './InfoPanel';
import CodeDisplay from './CodeDisplay';

const createRandomArray = (size = 10) =>
  Array.from({ length: size }, () => Math.floor(Math.random() * 20) + 1);

export default function SlidingWindowVisualizer() {
  const [array, setArray] = useState([2, 1, 5, 1, 3, 2, 8, 4, 9, 1]);
  const [windowSize, setWindowSize] = useState(3);
  const [speed, setSpeed] = useState(1);
  const [language, setLanguage] = useState('javascript');
  const [customInput, setCustomInput] = useState('');

  const {
    currentStep,
    currentStepIndex,
    steps,
    hasSteps,
    isComplete,
    isPlaying,
    loadSteps,
    clear,
    pause,
    play,
    replay,
    stepForward,
    goToStep,
  } = useStepPlayback({ speed });

  const handleStart = () => {
    clear();
    const newSteps = generateFixedWindowSteps(array, windowSize);
    loadSteps(newSteps);
  };

  const handleCustomInputSubmit = () => {
    const parsed = customInput.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    if (parsed.length > 0) {
      clear();
      setArray(parsed);
      setCustomInput('');
    }
  };

  const handleGenerateArray = () => {
    clear();
    setArray(createRandomArray(10));
  };

  const handleReset = () => {
    clear();
  };

  return (
    <motion.div 
      className="flex flex-col p-2 sm:p-4 lg:p-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="grid w-full gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(340px,0.7fr)]">
        <div className="flex flex-col gap-6">
          {/* Main Visualization Area */}
          <div className="rounded-2xl border border-slate-700/80 bg-slate-900/55 p-4 sm:p-6 shadow-xl backdrop-blur-md">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-100">Sliding Window Visualization</h3>
                <p className="text-sm text-slate-400">Fixed Size: {windowSize}</p>
              </div>
              <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-cyan-400">
                {currentStep?.type ? currentStep.type.replace('_', ' ') : 'Ready'}
              </div>
            </div>

            <WindowBars 
              array={array}
              windowStart={currentStep?.windowStart}
              windowEnd={currentStep?.windowEnd}
              maxStartIndex={currentStep?.maxStartIndex}
              windowSize={windowSize}
              type={currentStep?.type}
            />

            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {array.map((val, idx) => {
                const isInside = currentStep && idx >= currentStep.windowStart && idx <= currentStep.windowEnd;
                const isMax = currentStep && idx >= currentStep.maxStartIndex && idx < currentStep.maxStartIndex + windowSize;
                
                return (
                  <div
                    key={idx}
                    className={`flex h-12 w-12 items-center justify-center rounded-lg border font-mono text-sm font-bold transition-all duration-300 ${
                      isInside 
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-100 shadow-[0_0_15px_rgba(34,211,238,0.3)] scale-110 z-10' 
                        : isMax && isComplete
                          ? 'border-emerald-400 bg-emerald-500/20 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                          : 'border-slate-700 bg-slate-800 text-slate-400'
                    }`}
                  >
                    {val}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <InfoPanel currentStep={currentStep} />
            <CodeDisplay 
              language={language} 
              onLanguageChange={setLanguage}
              activeLine={currentStep?.highlightLines?.[0]} 
            />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <ControlPanel 
            isRunning={isPlaying}
            hasSteps={hasSteps}
            isComplete={isComplete}
            windowSize={windowSize}
            setWindowSize={(v) => { clear(); setWindowSize(v); }}
            speed={speed}
            setSpeed={setSpeed}
            onStart={handleStart}
            onGenerate={handleGenerateArray}
            onReset={handleReset}
            onPlayPause={isPlaying ? pause : play}
            onStep={stepForward}
            onReplay={replay}
            goToStep={goToStep}
            currentStepIndex={currentStepIndex}
            totalSteps={steps.length}
            customInput={customInput}
            setCustomInput={setCustomInput}
            onCustomInputSubmit={handleCustomInputSubmit}
          />
        </div>
      </div>
    </motion.div>
  );
}
