import React, { useState } from 'react';
import HuffmanVisualizer from './HuffmanVisualizer';
import JobSequencingVisualizer from './JobSequencingVisualizer';

export default function GreedyAlgorithms() {
  const [selected, setSelected] = useState('huffman');

  return (
    <div className="w-full p-4">
      {/* Simple Tab Buttons */}
      <div className="flex gap-4 mb-6 border-b border-slate-700 pb-2">
        <button
          onClick={() => setSelected('huffman')}
          className={`px-4 py-2 rounded-lg font-bold transition ${
            selected === 'huffman'
              ? 'bg-cyan-600 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Huffman Coding
        </button>
        <button
          onClick={() => setSelected('jobsequencing')}
          className={`px-4 py-2 rounded-lg font-bold transition ${
            selected === 'jobsequencing'
              ? 'bg-cyan-600 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Job Sequencing
        </button>
      </div>

      {/* Show selected visualizer */}
      {selected === 'huffman' ? <HuffmanVisualizer /> : <JobSequencingVisualizer />}
    </div>
  );
}