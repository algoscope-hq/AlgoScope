import { motion } from 'framer-motion'
import Visualizer from './Visualizer'

const ArrayVisualizerPage = () => {
  return (
    <motion.div
      className="w-full bg-slate-950/50 min-h-screen shadow-2xl rounded-2xl border border-white/10 backdrop-blur-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
    >
      <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
          Array Search Visualizer
        </p>
      </div>
      <Visualizer />
    </motion.div>
  )
}

export default ArrayVisualizerPage
