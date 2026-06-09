import { useState, useCallback, useEffect, useRef } from 'react'

export function useAIAssistant({ isOpen, onOpen }) {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [hintLevel, setHintLevel] = useState(0)
  const [currentContext, setCurrentContext] = useState(null)
  const abortRef = useRef(null)

  // Ctrl+H keyboard shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        const tag = document.activeElement?.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
        e.preventDefault()
        onOpen?.()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onOpen])

  const buildSystemPrompt = () => `
You are an expert algorithm tutor embedded in AlgoScope, an interactive algorithm visualizer and practice platform.

Your role is to help students understand algorithms WITHOUT giving away full solutions. You:
- Give progressive hints (gentle nudge → concept reminder → direct pointer)
- Explain mistakes as micro-learning moments
- Use simple, beginner-friendly language
- Reference the current code/algorithm context when available
- Keep responses concise (2-4 sentences max for hints, slightly more for explanations)
- Never write the complete solution for them
- Use encouraging, patient tone

AlgoScope covers: Sorting (Bubble, Merge, Quick, Heap, etc.), Searching (Binary, Linear, BFS, DFS), 
Shortest Path (Dijkstra, A*, BFS), Backtracking (N-Queens, Sudoku, Graph Coloring), 
Dynamic Programming, Kadane's Algorithm, Moore Voting, String Algorithms (KMP, Rabin-Karp, Z), 
Math Theory (GCD, Sieve, FFT, Fibonacci), Data Structures (Stack, Queue, Heap, DSU, Tree).
`.trim()

  const callAPI = useCallback(async (userMessage, contextInfo = null) => {
    setIsLoading(true)

    const systemPrompt = buildSystemPrompt()
    const contextNote = contextInfo
      ? `\n\n[Student context: ${contextInfo}]`
      : ''

    const apiMessages = [
      ...messages
        .filter((m) => m.role !== 'system')
        .slice(-8) // keep last 8 messages for context window
        .map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: userMessage + contextNote },
    ]

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])

    try {
      const controller = new AbortController()
      abortRef.current = controller

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: systemPrompt,
          messages: apiMessages,
        }),
      })

      const data = await response.json()
      const text =
        data.content
          ?.filter((b) => b.type === 'text')
          .map((b) => b.text)
          .join('') || 'Sorry, I could not generate a response. Please try again.'

      const assistantMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: text,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch (err) {
      if (err.name !== 'AbortError') {
        const errMsg = {
          id: Date.now() + 1,
          role: 'assistant',
          content:
            'I ran into a connection issue. Please check your network and try again.',
          timestamp: new Date(),
          isError: true,
        }
        setMessages((prev) => [...prev, errMsg])
      }
    } finally {
      setIsLoading(false)
      abortRef.current = null
    }
  }, [messages])

  const requestHint = useCallback(
    (code, executionMode, language) => {
      const level = hintLevel + 1
      setHintLevel(level)

      const hintPrompts = {
        1: `Give me a gentle nudge hint (Hint 1/3) — just point me in the right direction without revealing the answer.`,
        2: `Give me a conceptual reminder hint (Hint 2/3) — explain the underlying concept I might be missing.`,
        3: `Give me a more direct pointer hint (Hint 3/3) — be more specific about what I should do next, but still don't write the full solution.`,
      }

      const prompt = hintPrompts[Math.min(level, 3)]
      const context = `Mode: ${executionMode}, Language: ${language}${
        code ? `, Current code snippet (first 300 chars): ${code.slice(0, 300)}` : ''
      }`

      callAPI(prompt, context)
    },
    [hintLevel, callAPI]
  )

  const explainAlgorithm = useCallback(
    (algorithmName, code) => {
      const context = code
        ? `Current code (first 300 chars): ${code.slice(0, 300)}`
        : null
      callAPI(
        `Explain the ${algorithmName || 'algorithm I am currently working on'} in simple terms. Focus on the key insight and how it works step by step.`,
        context
      )
    },
    [callAPI]
  )

  const explainMistake = useCallback(
    (errorMessage, code) => {
      const context = `Error: ${errorMessage}${
        code ? `, Code (first 300 chars): ${code.slice(0, 300)}` : ''
      }`
      callAPI(
        `I got this error. Instead of just telling me the fix, explain what concept I'm misunderstanding and guide me toward the solution.`,
        context
      )
    },
    [callAPI]
  )

  const sendMessage = useCallback(
    (text, code, executionMode, language) => {
      const context =
        code || executionMode
          ? `Mode: ${executionMode || 'single'}, Language: ${language || 'javascript'}${
              code ? `, Code (first 300 chars): ${code.slice(0, 300)}` : ''
            }`
          : null
      callAPI(text, context)
    },
    [callAPI]
  )

  const resetHints = useCallback(() => setHintLevel(0), [])

  const clearMessages = useCallback(() => {
    setMessages([])
    setHintLevel(0)
  }, [])

  const cancelRequest = useCallback(() => {
    abortRef.current?.abort()
    setIsLoading(false)
  }, [])

  return {
    messages,
    isLoading,
    hintLevel,
    requestHint,
    explainAlgorithm,
    explainMistake,
    sendMessage,
    resetHints,
    clearMessages,
    cancelRequest,
  }
}