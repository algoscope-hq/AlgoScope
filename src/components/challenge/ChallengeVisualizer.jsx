import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import {
  CATEGORIES,
  DIFFICULTIES,
  QUESTION_BANK,
  pickQuestionsBatch,
} from '../../data/challengeQuestions'

const TIMER_SECONDS = 15

export default function ChallengeVisualizer() {
  // ── Settings State ────────────────────────────────────────────────────────
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [questionCount, setQuestionCount] = useState(10)
  const [adaptiveMode, setAdaptiveMode] = useState(false)
  const [timerEnabled, setTimerEnabled] = useState(true)

  // ── Game State ───────────────────────────────────────────────────────────
  const [seenIds, setSeenIds] = useState(() => new Set())
  const [questions, setQuestions] = useState(() =>
    pickQuestionsBatch({
      category: 'all',
      difficulty: 'all',
      count: 10,
      adaptive: false,
    })
  )

  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxQuizStreak, setMaxQuizStreak] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [speedBonusTotal, setSpeedBonusTotal] = useState(0)

  const [selectedIndex, setSelectedIndex] = useState(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [showResults, setShowResults] = useState(false)

  // Question log for detailed review
  const [userAnswers, setUserAnswers] = useState([])

  // Timer State
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS)
  const timerRef = useRef(null)

  // ── Persisted Stats ──────────────────────────────────────────────────────
  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem('algoscope-challenge-stats')
      return saved
        ? JSON.parse(saved)
        : {
            highScore: 0,
            maxStreak: 0,
            quizzesCompleted: 0,
            totalAnswered: 0,
            totalCorrect: 0,
          }
    } catch {
      return {
        highScore: 0,
        maxStreak: 0,
        quizzesCompleted: 0,
        totalAnswered: 0,
        totalCorrect: 0,
      }
    }
  })

  const [isNewHighScore, setIsNewHighScore] = useState(false)
  const [isNewMaxStreak, setIsNewMaxStreak] = useState(false)

  const current = questions[index] || questions[0]

  const handleTimeOut = useCallback(() => {
    setIsAnswered(true)
    setSelectedIndex(-1) // -1 indicates timeout
    setStreak(0)

    setUserAnswers((prev) => [
      ...prev,
      {
        question: current,
        selectedOpt: -1,
        isCorrect: false,
        isTimeout: true,
        pointsEarned: 0,
      },
    ])
  }, [current])

  // ── Timer Effect ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!timerEnabled || isAnswered || showResults || !current) return

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          handleTimeOut()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [index, isAnswered, showResults, timerEnabled, current, handleTimeOut])

  // ── Start / Restart Quiz ─────────────────────────────────────────────────
  const startNewQuiz = (cat = selectedCategory, diff = selectedDifficulty, cnt = questionCount, adapt = adaptiveMode) => {
    if (timerRef.current) clearInterval(timerRef.current)

    const nextBatch = pickQuestionsBatch({
      category: cat,
      difficulty: diff,
      count: cnt,
      adaptive: adapt,
      seenIds,
    })

    // Track seen questions
    setSeenIds((prev) => {
      const updated = new Set(prev)
      nextBatch.forEach((q) => updated.add(q.id))
      return updated
    })

    setQuestions(nextBatch)
    setIndex(0)
    setScore(0)
    setStreak(0)
    setMaxQuizStreak(0)
    setCorrect(0)
    setSpeedBonusTotal(0)
    setSelectedIndex(null)
    setIsAnswered(false)
    setShowResults(false)
    setUserAnswers([])
    setTimeLeft(TIMER_SECONDS)
    setIsNewHighScore(false)
    setIsNewMaxStreak(false)
  }

  // ── Answer Handler ───────────────────────────────────────────────────────
  const handleSelect = (optIndex) => {
    if (isAnswered) return
    if (timerRef.current) clearInterval(timerRef.current)

    setSelectedIndex(optIndex)
    setIsAnswered(true)

    const isRight = optIndex === current.correctIndex

    let earnedPoints = 0
    let bonus = 0

    if (isRight) {
      const newStreak = streak + 1
      setStreak(newStreak)
      if (newStreak > maxQuizStreak) setMaxQuizStreak(newStreak)
      setCorrect((c) => c + 1)

      // Streak multiplier: 1x, 1.5x (3+), 2x (5+), 3x (8+)
      const multiplier = newStreak >= 8 ? 3 : newStreak >= 5 ? 2 : newStreak >= 3 ? 1.5 : 1
      const basePoints = Math.round(10 * multiplier)

      // Speed Bonus
      if (timerEnabled && timeLeft > 0) {
        bonus = Math.round((timeLeft / TIMER_SECONDS) * 10)
        setSpeedBonusTotal((b) => b + bonus)
      }

      earnedPoints = basePoints + bonus
      setScore((s) => s + earnedPoints)
    } else {
      setStreak(0)
    }

    setUserAnswers((prev) => [
      ...prev,
      {
        question: current,
        selectedOpt: optIndex,
        isCorrect: isRight,
        isTimeout: false,
        pointsEarned: earnedPoints,
      },
    ])
  }

  // ── Navigation ───────────────────────────────────────────────────────────
  const goNext = () => {
    if (!isAnswered) return
    if (index >= questions.length - 1) {
      finishQuiz()
      return
    }
    setIndex((i) => i + 1)
    setSelectedIndex(null)
    setIsAnswered(false)
    setTimeLeft(TIMER_SECONDS)
  }

  const finishQuiz = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setShowResults(true)

    // Update persisted statistics
    const finalScore = score
    const finalMaxStreak = maxQuizStreak

    setStats((prev) => {
      const newHigh = finalScore > prev.highScore
      const newMaxStr = finalMaxStreak > prev.maxStreak

      if (newHigh) setIsNewHighScore(true)
      if (newMaxStr) setIsNewMaxStreak(true)

      const updated = {
        highScore: Math.max(prev.highScore, finalScore),
        maxStreak: Math.max(prev.maxStreak, finalMaxStreak),
        quizzesCompleted: prev.quizzesCompleted + 1,
        totalAnswered: prev.totalAnswered + questions.length,
        totalCorrect: prev.totalCorrect + correct,
      }

      try {
        localStorage.setItem('algoscope-challenge-stats', JSON.stringify(updated))
      } catch (err) {
        console.error('Failed to save challenge stats:', err)
      }

      return updated
    })
  }

  // ── Analytics Computation ────────────────────────────────────────────────
  const categoryPerformance = useMemo(() => {
    if (!showResults || userAnswers.length === 0) return []

    const map = {}
    userAnswers.forEach((ans) => {
      const cat = ans.question.categoryLabel || ans.question.category
      if (!map[cat]) map[cat] = { total: 0, correct: 0, link: ans.question.visualizerLink, name: ans.question.visualizerName }
      map[cat].total += 1
      if (ans.isCorrect) map[cat].correct += 1
    })

    return Object.entries(map).map(([cat, data]) => ({
      category: cat,
      total: data.total,
      correct: data.correct,
      percentage: Math.round((data.correct / data.total) * 100),
      visualizerLink: data.link,
      visualizerName: data.name,
    }))
  }, [showResults, userAnswers])

  const recommendations = useMemo(() => {
    return categoryPerformance.filter((c) => c.percentage < 100)
  }, [categoryPerformance])

  const progressPct = Math.round(((index + 1) / Math.max(1, questions.length)) * 100)

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER: Quiz Complete Screen
  // ─────────────────────────────────────────────────────────────────────────
  if (showResults) {
    const accuracyPct = Math.round((correct / questions.length) * 100)

    return (
      <div className="flex flex-col p-4 items-center justify-center min-h-[70vh] max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-slate-700/80 bg-slate-900/90 p-6 sm:p-10 shadow-2xl w-full relative overflow-hidden backdrop-blur-xl"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 via-purple-500 to-emerald-400" />

          {/* Celebratory Headers */}
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
              Challenge Completed! 🎉
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Great job testing your algorithmic knowledge across AlgoScope.
            </p>

            {(isNewHighScore || isNewMaxStreak) && (
              <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                {isNewHighScore && (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                    🏆 New High Score!
                  </span>
                )}
                {isNewMaxStreak && (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-300 border border-orange-500/40 animate-pulse">
                    🔥 New Best Streak!
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Main Stat Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
            <div className="bg-slate-800/70 rounded-2xl p-4 border border-slate-700 text-center shadow-inner">
              <p className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">
                Final Score
              </p>
              <p className="text-3xl sm:text-4xl font-black text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]">
                {score}
              </p>
            </div>

            <div className="bg-slate-800/70 rounded-2xl p-4 border border-slate-700 text-center shadow-inner">
              <p className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">
                Accuracy
              </p>
              <p className="text-3xl sm:text-4xl font-black text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]">
                {accuracyPct}%
              </p>
            </div>

            <div className="bg-slate-800/70 rounded-2xl p-4 border border-slate-700 text-center shadow-inner">
              <p className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">
                Max Streak
              </p>
              <p className="text-3xl sm:text-4xl font-black text-orange-400 drop-shadow-[0_0_12px_rgba(251,146,60,0.5)]">
                {maxQuizStreak}🔥
              </p>
            </div>

            <div className="bg-slate-800/70 rounded-2xl p-4 border border-slate-700 text-center shadow-inner">
              <p className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">
                Speed Bonus
              </p>
              <p className="text-3xl sm:text-4xl font-black text-purple-400 drop-shadow-[0_0_12px_rgba(192,132,252,0.5)]">
                +{speedBonusTotal}
              </p>
            </div>
          </div>

          {/* Category Performance Breakdown */}
          {categoryPerformance.length > 0 && (
            <div className="mb-8 bg-slate-950/60 rounded-2xl p-5 border border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
                📊 Category Performance
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categoryPerformance.map((item) => (
                  <div
                    key={item.category}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-200">{item.category}</p>
                      <p className="text-[11px] text-slate-400">
                        {item.correct} / {item.total} correct
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-sm font-extrabold ${
                          item.percentage >= 80
                            ? 'text-emerald-400'
                            : item.percentage >= 50
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {item.percentage}%
                      </span>
                      {item.visualizerLink && (
                        <Link
                          to={item.visualizerLink}
                          className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 hover:underline"
                        >
                          Practice →
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Practice Section */}
          {recommendations.length > 0 && (
            <div className="mb-8 bg-cyan-950/30 rounded-2xl p-5 border border-cyan-500/20">
              <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-300 mb-2 flex items-center gap-2">
                💡 Recommended Visualizers for Practice
              </h3>
              <p className="text-xs text-slate-300 mb-4">
                Brush up on these topics using AlgoScope interactive visualizers:
              </p>
              <div className="flex flex-wrap gap-2">
                {recommendations.map((rec) => (
                  <Link
                    key={rec.category}
                    to={rec.visualizerLink || '/concepts'}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 hover:bg-cyan-500/30 transition-all"
                  >
                    <span>{rec.category}</span>
                    <span className="text-[10px] text-cyan-400">({rec.visualizerName}) →</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Question Review */}
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">
              📝 Question Review ({userAnswers.length})
            </h3>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
              {userAnswers.map((ans, idx) => {
                const q = ans.question
                const isRight = ans.isCorrect

                return (
                  <div
                    key={q.id + idx}
                    className={`p-4 rounded-xl border text-left text-xs ${
                      isRight
                        ? 'bg-emerald-950/20 border-emerald-500/30'
                        : 'bg-rose-950/20 border-rose-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-bold text-slate-200 text-sm">
                        Q{idx + 1}. {q.question}
                      </p>
                      <span
                        className={`font-black text-xs px-2 py-0.5 rounded-md ${
                          isRight
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {isRight ? '✅ Correct' : ans.isTimeout ? '⏱️ Timeout' : '❌ Wrong'}
                      </span>
                    </div>

                    <p className="text-slate-400 mb-2">
                      Correct Answer:{' '}
                      <span className="font-bold text-emerald-400">
                        {q.options[q.correctIndex]}
                      </span>
                    </p>

                    <p className="text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-white/5">
                      <span className="font-bold text-slate-200">Explanation:</span> {q.explanation}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => startNewQuiz()}
              className="flex-1 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300 text-base border border-cyan-400/30 text-center"
            >
              Play Again 🔄
            </motion.button>
            <Link
              to="/concepts"
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3.5 px-6 rounded-xl border border-slate-700 transition-all duration-300 text-base text-center"
            >
              Explore Concepts Overview 📖
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER: Active Quiz Screen
  // ─────────────────────────────────────────────────────────────────────────
  const currentDiff = DIFFICULTIES.find((d) => d.id === (current?.difficulty || 'medium'))

  return (
    <div className="flex flex-col p-2 sm:p-4 lg:p-5 mx-auto max-w-5xl">
      {/* Settings Controls Bar */}
      <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        {/* Category Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              const cat = e.target.value
              setSelectedCategory(cat)
              startNewQuiz(cat, selectedDifficulty, questionCount, adaptiveMode)
            }}
            className="bg-slate-950 text-slate-100 border border-slate-700 text-xs rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-cyan-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Level:</label>
          <select
            value={selectedDifficulty}
            onChange={(e) => {
              const diff = e.target.value
              setSelectedDifficulty(diff)
              startNewQuiz(selectedCategory, diff, questionCount, adaptiveMode)
            }}
            className="bg-slate-950 text-slate-100 border border-slate-700 text-xs rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-cyan-500"
          >
            {DIFFICULTIES.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        {/* Question Count Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Count:</label>
          <select
            value={questionCount}
            onChange={(e) => {
              const cnt = Number(e.target.value)
              setQuestionCount(cnt)
              startNewQuiz(selectedCategory, selectedDifficulty, cnt, adaptiveMode)
            }}
            className="bg-slate-950 text-slate-100 border border-slate-700 text-xs rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-cyan-500"
          >
            <option value={5}>5 Questions</option>
            <option value={10}>10 Questions</option>
            <option value={15}>15 Questions</option>
            <option value={20}>20 Questions</option>
          </select>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={adaptiveMode}
              onChange={(e) => {
                const adapt = e.target.checked
                setAdaptiveMode(adapt)
                startNewQuiz(selectedCategory, selectedDifficulty, questionCount, adapt)
              }}
              className="rounded accent-cyan-500 h-4 w-4"
            />
            <span>Smart Adaptive 🧠</span>
          </label>

          <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={timerEnabled}
              onChange={(e) => setTimerEnabled(e.target.checked)}
              className="rounded accent-cyan-500 h-4 w-4"
            />
            <span>Timer ⏱️</span>
          </label>
        </div>
      </div>

      {/* Main Challenge Card */}
      <div className="rounded-3xl border border-slate-700/80 bg-slate-900/60 p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-60 rounded-t-3xl" />

        {/* Scoreboard Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            {/* Question Progress Counter */}
            <div className="flex flex-col items-center justify-center bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700 shadow-inner min-w-[90px]">
              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">
                Q {index + 1}/{questions.length}
              </span>
              <div className="w-full bg-slate-700 h-1.5 rounded-full mt-1 overflow-hidden">
                <div
                  className="bg-cyan-400 h-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* Score Display */}
            <div className="flex flex-col items-center bg-slate-800/80 px-4 py-1.5 rounded-xl border border-slate-700 shadow-inner">
              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Score</span>
              <span className="text-xl font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                {score}
              </span>
            </div>

            {/* Streak Combo Display */}
            <div className="flex flex-col items-center bg-slate-800/80 px-4 py-1.5 rounded-xl border border-slate-700 shadow-inner">
              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Streak</span>
              <span
                className={`text-xl font-bold ${
                  streak >= 8
                    ? 'text-rose-400 drop-shadow-[0_0_12px_rgba(244,63,94,0.9)] animate-bounce'
                    : streak >= 5
                    ? 'text-orange-400 drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]'
                    : streak >= 3
                    ? 'text-amber-400'
                    : 'text-slate-300'
                }`}
              >
                {streak} 🔥
              </span>
            </div>

            {/* High Score Badge */}
            {stats.highScore > 0 && (
              <div className="hidden sm:flex flex-col items-center bg-slate-800/50 px-3 py-1.5 rounded-xl border border-slate-800 text-[10px]">
                <span className="text-slate-400 uppercase tracking-widest font-semibold">Best</span>
                <span className="font-bold text-amber-300">{stats.highScore} pts</span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => startNewQuiz()}
            className="px-4 py-2 rounded-xl text-xs font-bold border border-white/10 text-slate-200 hover:bg-white/10 transition-all"
          >
            Restart 🔄
          </button>
        </div>

        {/* Timer Bar (If Enabled) */}
        {timerEnabled && !isAnswered && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="text-slate-400">Time Remaining:</span>
              <span className={timeLeft <= 5 ? 'text-rose-400 animate-pulse font-black' : 'text-cyan-400'}>
                {timeLeft}s
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
              <motion.div
                className={`h-full ${
                  timeLeft <= 5 ? 'bg-rose-500' : timeLeft <= 8 ? 'bg-amber-500' : 'bg-cyan-500'
                }`}
                initial={{ width: '100%' }}
                animate={{ width: `${(timeLeft / TIMER_SECONDS) * 100}%` }}
                transition={{ duration: 1, ease: 'linear' }}
              />
            </div>
          </div>
        )}

        {/* Category & Difficulty Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-cyan-300 border border-slate-700">
            {current.categoryLabel || current.category}
          </span>
          <span
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
              currentDiff?.color || 'text-slate-300 bg-slate-800 border-slate-700'
            }`}
          >
            {current.difficulty}
          </span>
        </div>

        {/* Question Prompt */}
        <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-3 tracking-tight leading-snug">
          {current.question}
        </h3>

        {/* Syntax Highlighted Code Snippet (If Present) */}
        {current.codeSnippet && (
          <div className="mb-6 rounded-xl overflow-hidden border border-slate-700/80 shadow-lg text-xs">
            <SyntaxHighlighter
              language={current.codeLanguage || 'javascript'}
              style={vscDarkPlus}
              customStyle={{ margin: 0, padding: '1rem', background: '#090d16' }}
            >
              {current.codeSnippet}
            </SyntaxHighlighter>
          </div>
        )}

        {/* MCQ Option Buttons */}
        <div className="flex flex-col gap-3 mt-4">
          <AnimatePresence initial={false}>
            {current.options.map((opt, optIndex) => {
              const isCorrect = optIndex === current.correctIndex
              const isSelected = optIndex === selectedIndex

              let btnClasses =
                'border-slate-700 bg-slate-800/80 text-slate-200 hover:border-cyan-500 hover:bg-slate-800 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]'

              if (isAnswered) {
                if (isCorrect) {
                  btnClasses =
                    'border-emerald-500 bg-emerald-500/20 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                } else if (isSelected) {
                  btnClasses =
                    'border-rose-500 bg-rose-500/20 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.25)]'
                } else {
                  btnClasses = 'border-slate-800 bg-slate-900/40 text-slate-500 opacity-60'
                }
              }

              return (
                <motion.button
                  key={`${current.id}-${optIndex}`}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  whileHover={!isAnswered ? { scale: 1.01, x: 4 } : {}}
                  whileTap={!isAnswered ? { scale: 0.99 } : {}}
                  type="button"
                  onClick={() => handleSelect(optIndex)}
                  disabled={isAnswered}
                  className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-300 font-bold text-sm sm:text-base flex items-center justify-between ${btnClasses}`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-slate-700/60 text-slate-300 border border-slate-600">
                      {String.fromCharCode(65 + optIndex)}
                    </span>
                    <span>{opt}</span>
                  </span>
                  {isAnswered && isCorrect && <span className="text-xl">✅</span>}
                  {isAnswered && isSelected && !isCorrect && <span className="text-xl">❌</span>}
                </motion.button>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Answer Feedback & Explanation Box */}
        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="mt-6 pt-6 border-t border-slate-700/50 flex flex-col gap-4"
            >
              <div
                className={`p-4 rounded-xl text-center font-bold text-base border flex flex-wrap items-center justify-center gap-2 ${
                  selectedIndex === current.correctIndex
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}
              >
                {selectedIndex === current.correctIndex ? (
                  <>
                    <span>Correct Answer! 🎉</span>
                    {streak >= 3 && (
                      <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        {streak >= 8 ? '3x UNSTOPPABLE' : streak >= 5 ? '2x COMBO' : '1.5x STREAK'}
                      </span>
                    )}
                  </>
                ) : selectedIndex === -1 ? (
                  <span>⏱️ Time expired!</span>
                ) : (
                  <span>Wrong answer</span>
                )}
              </div>

              {/* Explanation Text */}
              <div className="text-xs sm:text-sm text-slate-300 bg-slate-950/60 border border-white/10 rounded-xl p-4 leading-relaxed">
                <span className="font-bold text-white">Explanation:</span> {current.explanation}
              </div>

              {/* Practice Link + Next Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-2">
                {current.visualizerLink ? (
                  <Link
                    to={current.visualizerLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 bg-cyan-950/40 hover:bg-cyan-900/50 px-3.5 py-2.5 rounded-xl border border-cyan-500/30 transition-all w-full sm:w-auto justify-center"
                  >
                    <span>Practice in {current.visualizerName}</span>
                    <span>↗</span>
                  </Link>
                ) : (
                  <div />
                )}

                {index < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold border transition-all bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.35)]"
                  >
                    Next Question →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={finishQuiz}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold border transition-all bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-emerald-400/30 shadow-[0_0_20px_rgba(16,185,129,0.35)]"
                  >
                    See Final Results 📊
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
