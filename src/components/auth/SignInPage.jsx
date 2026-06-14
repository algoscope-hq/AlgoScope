import React from 'react'
import { SignIn } from '@clerk/clerk-react'
import { motion } from 'framer-motion'

export default function SignInPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#020617] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md z-10 flex justify-center"
      >
        <SignIn
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/"
          forceRedirectUrl="/"
        />
      </motion.div>
    </div>
  )
}
