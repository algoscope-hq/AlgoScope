import React from 'react'
import EmptyState from '../EmptyState'

export default function DiskSchedulingPage() {
  return (
    <div className="min-h-screen px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">Disk Scheduling</h1>
      <EmptyState
        icon="💾"
        title="Under Development"
        message="The Disk Scheduling visualizer is coming soon! We're building interactive simulations for SCAN, C-SCAN, SSTF, and other disk scheduling algorithms."
      />
    </div>
  )
}
