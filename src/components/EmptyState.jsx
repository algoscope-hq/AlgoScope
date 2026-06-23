import { motion } from 'framer-motion'

export default function EmptyState({ title = 'Coming Soon', message, icon = '🚧' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 px-6 text-center"
    >
      <span className="text-6xl mb-6">{icon}</span>
      <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 max-w-md leading-relaxed">
        {message || 'This visualizer is being built. Check back soon for interactive examples and step-by-step animations.'}
      </p>
    </motion.div>
  )
}
