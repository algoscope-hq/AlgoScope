/**
 * Marks a vis-network instance as ready via async callback (lint-safe).
 * Uses stabilization event when available, with a setTimeout fallback because
 * stabilizationIterationsDone often does not fire when physics is disabled.
 */
export function scheduleNetworkReady(network, onReady) {
  let called = false

  const call = () => {
    if (called) return
    called = true
    onReady()
  }

  const timer = window.setTimeout(call, 0)
  const onStabilized = () => {
    window.clearTimeout(timer)
    call()
  }

  network.once('stabilizationIterationsDone', onStabilized)

  return () => {
    called = true
    window.clearTimeout(timer)
    network.off('stabilizationIterationsDone', onStabilized)
  }
}
