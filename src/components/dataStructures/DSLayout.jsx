import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import StackIV from './stackIV'
import QueueIV from './queueIV'
import TreeIV from './treeIV'
import BinaryHeapIV from './binaryHeapIV'
import PriorityQueueIV from './priorityQueueIV'
import DSUIV from './dsuIV'
import LinkedListIV from './LinkedListIV'
import CodePanel from '../visualizer/CodePanel'
import { adtSources } from './adtSources'
import ComparisonMode from './ComparisonMode'

const tabs = [
  { id: 'stack', label: 'Stack' },
  { id: 'queue', label: 'Queue' },
  { id: 'tree', label: 'Binary Tree' },
  { id: 'heap', label: 'Binary Heap' },
  { id: 'priority-queue', label: 'Priority Queue' },
  { id: 'dsu', label: 'Disjoint Set Union' },
  { id: 'linked-list', label: 'Linked List' },
  { id: 'graph', label: 'Graph Builder' },
]

export const DSLayout = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('type') || 'stack'
  const mode = searchParams.get('mode') === 'compare' ? 'compare' : 'solo'
  const [selectedLang, setSelectedLang] = useState('javascript')

  const [stackMode, setStackMode] = useState('standard stack')
  const [treeTraversal, setTreeTraversal] = useState('inorder')
  const [activeLine, setActiveLine] = useState(null)

  const setMode = useCallback(
    (newMode) => {
      const newParams = new URLSearchParams(searchParams)
      if (newMode === 'compare') {
        newParams.set('mode', 'compare')
      } else {
        newParams.delete('mode')
      }
      setSearchParams(newParams)
    },
    [searchParams, setSearchParams]
  )

  const setActiveTab = (tabId) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('type', tabId)
    newParams.delete('mode')
    setSearchParams(newParams)
  }

  useEffect(() => {
    if (!searchParams.get('type')) {
      setSearchParams({ type: 'stack' }, { replace: true })
    }
  }, [searchParams, setSearchParams])

  useEffect(() => {
    if (!['stack', 'queue', 'tree'].includes(activeTab) && mode === 'compare') {
      setTimeout(() => setMode('solo'), 0)
    }
  }, [activeTab, mode, setMode])

  useEffect(() => {
    const handleGlobalChange = (e) => {
      if (e.target && e.target.tagName === 'SELECT') {
        if (!e.target.hasAttribute('data-layout-lang')) {
          const rawValue = e.target.value.toLowerCase().trim()
          if (activeTab === 'stack' && adtSources.stack[rawValue]) {
            setStackMode(rawValue)
          }
        }
      }
    }

    const handleGlobalClick = (e) => {
      if (activeTab === 'tree') {
        const targetText = e.target.innerText?.toLowerCase().trim() || ''
        if (['inorder', 'preorder', 'postorder'].includes(targetText)) {
          setTreeTraversal(targetText)
        }
      }
    }

    window.addEventListener('change', handleGlobalChange)
    window.addEventListener('click', handleGlobalClick)

    return () => {
      window.removeEventListener('change', handleGlobalChange)
      window.removeEventListener('click', handleGlobalClick)
    }
  }, [activeTab])

  const activeCode = useMemo(() => {
    if (activeTab === 'graph') return ''

    if (activeTab === 'dsu') {
      return adtSources.dsu['union find']?.[selectedLang] || ''
    }

    if (activeTab === 'stack') {
      const modeData =
        adtSources.stack[stackMode] || adtSources.stack['standard stack']
      return modeData[selectedLang] || ''
    }

    if (activeTab === 'queue') {
      return adtSources.queue['standard queue']?.[selectedLang] || ''
    }

    if (activeTab === 'tree') {
      const treeData =
        adtSources.tree[treeTraversal] || adtSources.tree['inorder']
      return treeData[selectedLang] || ''
    }

    if (activeTab === 'heap') {
      return adtSources.heap['binary heap']?.[selectedLang] || ''
    }

    if (activeTab === 'priority-queue') {
      return adtSources.priorityQueue['priority queue']?.[selectedLang] || ''
    }

    if (activeTab === 'linked-list') {
      return adtSources.linkedList?.['singly linked list']?.[selectedLang] || ''
    }

    return ''
  }, [activeTab, selectedLang, stackMode, treeTraversal])

  const getTabTitle = () => {
    if (activeTab === 'stack') return `Stack (${stackMode.toUpperCase()})`
    if (activeTab === 'tree')
      return `Binary Tree (${treeTraversal.toUpperCase()})`
    if (activeTab === 'heap') return 'Binary Heap'
    if (activeTab === 'priority-queue') return 'Priority Queue'
    if (activeTab === 'dsu') return 'Disjoint Set Union'
    if (activeTab === 'linked-list') return 'Singly Linked List'
    return 'Queue'
  }

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 text-slate-200">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 justify-center p-2 bg-slate-900/50 rounded-xl border border-white/5 backdrop-blur-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id)
            }}
            className={`px-6 py-2 rounded-lg font-mono text-sm transition-all duration-300 relative ${
              activeTab === tab.id
                ? 'text-cyan-400 bg-cyan-950/30 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabGlow"
                className="absolute inset-0 rounded-lg bg-cyan-400/10"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Mode Toggle (only for stack/queue/tree) */}
      {['stack', 'queue', 'tree'].includes(activeTab) && (
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setMode('solo')}
            className={`px-4 py-1 rounded-lg text-xs font-bold transition-all ${
              mode === 'solo'
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            Solo
          </button>

          <button
            onClick={() => setMode('compare')}
            className={`px-4 py-1 rounded-lg text-xs font-bold transition-all ${
              mode === 'compare'
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            Compare
          </button>
        </div>
      )}

      {/* Visualization Area */}
      <div className="relative w-full bg-slate-950/80 rounded-2xl border border-slate-800 p-6 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-10 pointer-events-none"></div>

        {activeTab === 'stack' && mode === 'solo' && (
          <StackIV onStepChange={setActiveLine} />
        )}

        {activeTab === 'queue' && mode === 'solo' && <QueueIV />}

        {activeTab === 'tree' && mode === 'solo' && <TreeIV />}

        {activeTab === 'heap' && mode === 'solo' && <BinaryHeapIV />}

        {activeTab === 'priority-queue' && mode === 'solo' && (
          <PriorityQueueIV />
        )}

        {activeTab === 'dsu' && mode === 'solo' && <DSUIV />}

        {activeTab === 'linked-list' && mode === 'solo' && <LinkedListIV />}

        {activeTab === 'graph' && (
          <div className="flex items-center justify-center min-h-[300px] text-slate-500">
            Graph Playground Coming Soon
          </div>
        )}

        {/* Comparison Mode */}
        {['stack', 'queue', 'tree'].includes(activeTab) &&
          mode === 'compare' && <ComparisonMode />}
      </div>

      {/* Code Panel */}
      {activeTab !== 'graph' && mode === 'solo' && (
        <div className="w-full flex flex-col lg:flex-row gap-6 items-start">
          <div className="w-full lg:w-1/4 p-4 flex flex-col bg-slate-900/80 shadow-xl rounded-xl border border-white/5 backdrop-blur-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
              Code Language
            </p>
            <select
              data-layout-lang="true"
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 transition focus:border-cyan-500 focus:outline-none cursor-pointer"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="c">C</option>
              <option value="rust">Rust</option>
              <option value="go">Go</option>
            </select>
          </div>

          <div className="w-full lg:w-3/4 flex flex-col gap-6">
            <CodePanel
              title={`${getTabTitle()} Implementation`}
              code={activeCode || ''}
              language={selectedLang}
              activeLine={activeLine}
            />
          </div>
        </div>
      )}
    </div>
  )
}
