import React, { useState } from 'react'
import { useSignUp } from '@clerk/clerk-react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, ShieldAlert, ArrowRight, CheckCircle2, KeyRound } from 'lucide-react'

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Handle Form Submission for Initial Signup
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isLoaded) return
    setError('')

    // 1. Password Confirmation Match Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      // 2. Create the User Sign-Up
      await signUp.create({
        emailAddress,
        password,
      })

      // 3. Send the verification code (OTP) via email
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // 4. Set state to show the OTP entry form
      setPendingVerification(true)
    } catch (err) {
      console.error('Sign up error:', err)
      setError(err.errors?.[0]?.longMessage || err.message || 'An error occurred during sign up.')
    } finally {
      setLoading(false)
    }
  }

  // Handle Verification OTP Code Submission
  const handleVerify = async (e) => {
    e.preventDefault()
    if (!isLoaded) return
    setError('')
    setLoading(true)

    try {
      // 5. Attempt to verify the code
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      })

      // 6. Complete status check and set session active
      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId })
        navigate('/')
      } else {
        console.error('Verification status not complete:', completeSignUp)
        setError('Verification not complete. Please check the code or request a new one.')
      }
    } catch (err) {
      console.error('Verification error:', err)
      setError(err.errors?.[0]?.longMessage || err.message || 'Invalid or expired verification code.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#020617] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md z-10"
      >
        <div className="backdrop-blur-md bg-slate-950/60 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              {pendingVerification ? 'Verify your email' : 'Create an account'}
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              {pendingVerification
                ? `We sent a code to ${emailAddress}`
                : 'Join AlgoScope to track your visualizer progress'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-200 text-sm">
                  <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!pendingVerification ? (
            /* Signup Form Stage */
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 h-5 text-slate-500" />
                  </div>
                  <input
                    type="email"
                    required
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="name@example.com"
                    className="block w-full pl-10 pr-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 h-5 text-slate-500" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 h-5 text-slate-500" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full relative group overflow-hidden rounded-xl bg-indigo-600 hover:bg-indigo-500 py-3 text-sm font-bold text-white transition-all duration-300 active:scale-95 shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? 'Creating account...' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </span>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>

              <div className="text-center pt-2">
                <p className="text-sm text-slate-400">
                  Already have an account?{' '}
                  <Link
                    to="/sign-in"
                    className="text-indigo-400 hover:text-indigo-300 font-semibold transition duration-200"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          ) : (
            /* OTP Verification Stage */
            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Verification Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound className="h-5 h-5 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="block w-full pl-10 pr-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-200 text-center tracking-[0.25em] font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full relative group overflow-hidden rounded-xl bg-cyan-600 hover:bg-cyan-500 py-3 text-sm font-bold text-white transition-all duration-300 active:scale-95 shadow-lg shadow-cyan-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? 'Verifying...' : 'Verify Code'}
                  <CheckCircle2 className="w-4 h-4" />
                </span>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setPendingVerification(false)}
                  className="text-sm text-slate-400 hover:text-slate-200 transition duration-200"
                >
                  Change email address
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}
