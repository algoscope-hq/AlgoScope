import React, { useState, useRef, useEffect } from 'react'
import CodeEditor from './CodeEditor'
import { motion } from 'framer-motion'

const Terminal = React.forwardRef(function Terminal({ logs, onClear }, ref) {
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  return (
    <div
      ref={ref}
      className="mt-8 flex flex-col w-full scroll-mt-24 bg-slate-950 border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl"
    >
      <div className="flex items-center justify-between px-5 py-3 bg-slate-900/80 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-cyan-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Output Console
          </span>
        </div>
        <button
          onClick={onClear}
          className="text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-cyan-400 transition-colors"
        >
          Clear Logs
        </button>
      </div>
      <div
        ref={scrollRef}
        className="p-5 h-48 overflow-y-auto font-mono text-sm space-y-2 custom-scrollbar"
      >
        {logs.length === 0 ? (
          <p className="text-slate-600 italic text-xs">
            No output yet. Click &quot;Run Code&quot; to execute your
            JavaScript.
          </p>
        ) : (
          logs.map((log, i) => (
            <div
              key={i}
              className={`flex gap-3 ${log.type === 'error' ? 'text-red-400' : 'text-slate-300'}`}
            >
              <span className="text-slate-600 shrink-0 text-xs">
                [{new Date().toLocaleTimeString([], { hour12: false })}]
              </span>
              <span className="break-all whitespace-pre-wrap">
                {log.content}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
})

const runCodeInWorker = (userCode, inputVal) => {
  return new Promise((resolve) => {
    const executionToken =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2) + Date.now().toString(36)

    const workerCode = `
      self.onmessage = function(e) {
        const { code, input, token } = e.data;
        const logs = [];
        
        const originalLog = self.console.log;
        const originalError = self.console.error;
        const originalPostMessage = self.postMessage;
        
        // 1. Completely remove communication APIs from prototype chain
        let currentProto = self;
        while (currentProto) {
          ['postMessage', 'close', 'importScripts'].forEach(method => {
            if (currentProto.hasOwnProperty(method)) {
               try { delete currentProto[method]; } catch(e) {}
            }
          });
          currentProto = Object.getPrototypeOf(currentProto);
        }

        // 2. Shadow dangerous globals on the instance
        self.postMessage = undefined;
        self.close = undefined;
        self.importScripts = undefined;
        self.onmessage = undefined;
        self.WorkerGlobalScope = undefined;
        self.DedicatedWorkerGlobalScope = undefined;
        
        self.console.log = function(...args) {
          const content = args.map(arg => {
            if (arg === null) return 'null';
            if (arg === undefined) return 'undefined';
            return typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg);
          }).join(' ');
          logs.push({ type: 'info', content });
          originalLog.apply(self.console, args);
        };
        
        self.console.error = function(...args) {
          const content = args.map(arg => {
            if (arg === null) return 'null';
            if (arg === undefined) return 'undefined';
            return typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg);
          }).join(' ');
          logs.push({ type: 'error', content });
          originalError.apply(self.console, args);
        };
        
        const startTime = self.performance.now();
        try {
          // 3. Wrap execution in an IIFE that shadows common aliases in local scope
          const wrappedCode = "\\n(function(self, globalThis, postMessage, close, importScripts, onmessage) {\\n" + code + "\\n})();\\n";
          const runner = new Function('input', wrappedCode);
          runner(input);
          const endTime = self.performance.now();
          originalPostMessage.call(self, { __token: token, status: 'success', logs, duration: endTime - startTime });
        } catch (err) {
          const endTime = self.performance.now();
          originalPostMessage.call(self, { __token: token, status: 'error', error: err.message, logs, duration: endTime - startTime });
        } finally {
          self.console.log = originalLog;
          self.console.error = originalError;
        }
      };
    `
    const blob = new Blob([workerCode], { type: 'application/javascript' })
    const workerURL = URL.createObjectURL(blob)
    const worker = new Worker(workerURL)

    const timeout = setTimeout(() => {
      worker.terminate()
      URL.revokeObjectURL(workerURL)
      resolve({
        status: 'timeout',
        duration: 3000,
        logs: [
          {
            type: 'error',
            content:
              'Execution Timeout: Code took longer than 3000ms and was terminated.',
          },
        ],
      })
    }, 3000)

    worker.onmessage = (e) => {
      if (e.data && e.data.__token === executionToken) {
        clearTimeout(timeout)
        worker.terminate()
        URL.revokeObjectURL(workerURL)
        const { __token, ...safeData } = e.data
        resolve(safeData)
      }
    }

    worker.onerror = (err) => {
      clearTimeout(timeout)
      worker.terminate()
      URL.revokeObjectURL(workerURL)
      resolve({
        status: 'error',
        error: err.message,
        duration: 0,
        logs: [
          { type: 'error', content: `Syntax/Runtime Error: ${err.message}` },
        ],
      })
    }

    worker.postMessage({
      code: userCode,
      input: inputVal,
      token: executionToken,
    })
  })
}

const fibonacciIterative = `// Editor A: Iterative Fibonacci (O(N) Time, O(1) Space)
function fibonacci(n) {
  if (n <= 1) return n;
  let prev = 0, curr = 1;
  for (let i = 2; i <= n; i++) {
    let next = prev + curr;
    prev = curr;
    curr = next;
  }
  return curr;
}

// Running the algorithm with the shared input
console.log("Input:", input);
console.log("Result:", fibonacci(input));
`

const fibonacciRecursive = `// Editor B: Recursive Fibonacci (O(2^N) Time, O(N) Space)
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Running the algorithm with the shared input
console.log("Input:", input);
console.log("Result:", fibonacci(input));
`

const defaultTemplates = {
  javascript: {
    a: fibonacciIterative,
    b: fibonacciRecursive,
  },
  python: {
    a: `# Editor A: Iterative approach\n`,
    b: `# Editor B: Recursive approach\n`,
  },
  java: {
    a: `// Editor A\n`,
    b: `// Editor B\n`,
  },
  cpp: {
    a: `// Editor A\n`,
    b: `// Editor B\n`,
  },
}

const PracticePage = () => {
  const consoleRef = useRef(null)
  const consoleRefA = useRef(null)
  const consoleRefB = useRef(null)

  const [isCompareMode, setIsCompareMode] = useState(false)
  const [codeA, setCodeA] = useState('')
  const [codeB, setCodeB] = useState('')
  const [logsA, setLogsA] = useState([])
  const [logsB, setLogsB] = useState([])
  const [sharedInput, setSharedInput] = useState('35')
  const [isComparing, setIsComparing] = useState(false)
  const [benchmarkResults, setBenchmarkResults] = useState(null)

  const [language, setLanguage] = useState('javascript')
  const [theme, setTheme] = useState(
    () => localStorage.getItem('practiceEditorTheme') || 'vs-dark'
  )
  const [code, setCode] = useState(
    '// Write your algorithm here...\nconsole.log("Hello from AlgoScope!");\n'
  )
  const [logs, setLogs] = useState([])

  const languages = [
    {
      label: 'JavaScript',
      value: 'javascript',
      default:
        '// Write your algorithm here...\nconsole.log("Hello from AlgoScope!");\n',
    },
    {
      label: 'Python',
      value: 'python',
      default: '# Write your algorithm here...\n',
    },
    {
      label: 'Java',
      value: 'java',
      default:
        'public class Main {\n  public static void main(String[] args) {\n    // Write your algorithm here...\n  }\n}\n',
    },
    {
      label: 'C++',
      value: 'cpp',
      default:
        '#include <iostream>\n\nint main() {\n  // Write your algorithm here...\n  return 0;\n}\n',
    },
  ]

  const themes = [
    { label: 'Dark', value: 'vs-dark' },
    { label: 'Light', value: 'light' },
    { label: 'High Contrast', value: 'hc-black' },
  ]

  const handleCompareModeChange = (mode) => {
    setIsCompareMode(mode)
    if (mode) {
      setCodeA(defaultTemplates[language]?.a || '')
      setCodeB(defaultTemplates[language]?.b || '')
    }
  }

  const handleLanguageChange = (e) => {
    const selectedLang = languages.find((lang) => lang.value === e.target.value)
    setLanguage(selectedLang.value)
    setCode(selectedLang.default)
    if (isCompareMode) {
      setCodeA(defaultTemplates[selectedLang.value]?.a || '')
      setCodeB(defaultTemplates[selectedLang.value]?.b || '')
    }
  }

  const handleThemeChange = (e) => {
    setTheme(e.target.value)
    localStorage.setItem('practiceEditorTheme', e.target.value)
  }

  const handleCodeChange = (newCode) => {
    setCode(newCode)
  }

  const scrollConsoleIntoView = () => {
    // Defer until after this tick so layout / React commit can settle (helps with
    // tall editor + sticky navbar + scrollIntoView).
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (consoleRef.current) {
          consoleRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }
      })
    })
  }

  const parseSharedInput = () => {
    let parsedInput = undefined
    try {
      parsedInput = JSON.parse(sharedInput)
    } catch {
      if (!isNaN(sharedInput) && sharedInput.trim() !== '') {
        parsedInput = Number(sharedInput)
      } else {
        parsedInput = sharedInput
      }
    }
    return parsedInput
  }

  const handleRunCode = async (userCode) => {
    setLogs((prev) => [
      ...prev,
      { type: 'info', content: 'Executing user code...' },
    ])
    const result = await runCodeInWorker(userCode, undefined)
    setLogs((prev) => [...prev, ...result.logs])
    if (result.status === 'error') {
      setLogs((prev) => [
        ...prev,
        { type: 'error', content: `Runtime Error: ${result.error}` },
      ])
    }
    scrollConsoleIntoView()
  }

  const handleRunCodeA = async (userCode) => {
    setLogsA((prev) => [
      ...prev,
      { type: 'info', content: 'Executing Code A...' },
    ])
    const inputVal = parseSharedInput()
    const result = await runCodeInWorker(userCode, inputVal)
    setLogsA((prev) => [...prev, ...result.logs])
    if (result.status === 'error') {
      setLogsA((prev) => [
        ...prev,
        { type: 'error', content: `Runtime Error: ${result.error}` },
      ])
    }
  }

  const handleRunCodeB = async (userCode) => {
    setLogsB((prev) => [
      ...prev,
      { type: 'info', content: 'Executing Code B...' },
    ])
    const inputVal = parseSharedInput()
    const result = await runCodeInWorker(userCode, inputVal)
    setLogsB((prev) => [...prev, ...result.logs])
    if (result.status === 'error') {
      setLogsB((prev) => [
        ...prev,
        { type: 'error', content: `Runtime Error: ${result.error}` },
      ])
    }
  }

  const handleCompareBenchmark = async () => {
    setIsComparing(true)
    setBenchmarkResults(null)
    setLogsA((prev) => [
      ...prev,
      { type: 'info', content: 'Starting comparison run for Code A...' },
    ])
    setLogsB((prev) => [
      ...prev,
      { type: 'info', content: 'Starting comparison run for Code B...' },
    ])

    const inputVal = parseSharedInput()

    const [resA, resB] = await Promise.all([
      runCodeInWorker(codeA, inputVal),
      runCodeInWorker(codeB, inputVal),
    ])

    setLogsA((prev) => [...prev, ...resA.logs])
    if (resA.status === 'error') {
      setLogsA((prev) => [
        ...prev,
        { type: 'error', content: `Runtime Error: ${resA.error}` },
      ])
    }

    setLogsB((prev) => [...prev, ...resB.logs])
    if (resB.status === 'error') {
      setLogsB((prev) => [
        ...prev,
        { type: 'error', content: `Runtime Error: ${resB.error}` },
      ])
    }

    setBenchmarkResults({
      durationA: resA.duration,
      durationB: resB.duration,
      statusA: resA.status,
      statusB: resB.status,
      errorA: resA.error,
      errorB: resB.error,
    })

    setIsComparing(false)
  }

  return (
    <motion.div
      className="w-full bg-slate-950/50 min-h-screen shadow-2xl rounded-2xl border border-white/10 backdrop-blur-xl p-4 sm:p-8 lg:p-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-full mx-auto">
        <div className="mb-10 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm mb-4">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
            <span className="text-xs font-mono text-cyan-400 tracking-wider uppercase">
              Beta Feature
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            Practice Sandbox
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl font-light leading-relaxed">
            Hone your algorithm skills by writing code in your favorite language
            with our integrated high-performance editor.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10">
          {/* Controls Panel */}
          <div className="flex flex-col gap-6">
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] shadow-xl">
              <label className="block text-xs font-bold uppercase tracking-widest text-cyan-400/80 mb-4">
                Select Language
              </label>
              <div className="relative">
                <select
                  value={language}
                  onChange={handleLanguageChange}
                  className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all appearance-none cursor-pointer"
                >
                  {languages.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] shadow-xl">
              <label className="block text-xs font-bold uppercase tracking-widest text-cyan-400/80 mb-4">
                Select Theme
              </label>
              <div className="relative">
                <select
                  value={theme}
                  onChange={handleThemeChange}
                  className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all appearance-none cursor-pointer"
                >
                  {themes.map((editorTheme) => (
                    <option key={editorTheme.value} value={editorTheme.value}>
                      {editorTheme.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Execution Mode Selector */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] shadow-xl">
              <label className="block text-xs font-bold uppercase tracking-widest text-cyan-400/80 mb-4">
                Execution Mode
              </label>
              <div className="flex items-center justify-between p-1 bg-slate-950/80 border border-slate-700 rounded-xl">
                <button
                  type="button"
                  onClick={() => handleCompareModeChange(false)}
                  className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all ${
                    !isCompareMode
                      ? 'bg-cyan-600 text-white shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Single Run
                </button>
                <button
                  type="button"
                  onClick={() => handleCompareModeChange(true)}
                  className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all ${
                    isCompareMode
                      ? 'bg-cyan-600 text-white shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Compare Mode
                </button>
              </div>
            </div>

            {/* Compare Settings Card */}
            {isCompareMode && (
              <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] shadow-xl space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-cyan-400/80">
                      Shared Input
                    </label>
                    <span className="text-[10px] text-slate-500 font-mono">
                      const input = ...
                    </span>
                  </div>
                  <textarea
                    value={sharedInput}
                    onChange={(e) => setSharedInput(e.target.value)}
                    rows={3}
                    placeholder="Enter JSON, array, or number..."
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-3 font-mono text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all custom-scrollbar"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    This input is automatically injected into both editors.
                  </p>
                </div>

                <button
                  onClick={handleCompareBenchmark}
                  disabled={isComparing || language !== 'javascript'}
                  className={`w-full py-3.5 px-4 text-xs font-bold text-white rounded-xl active:scale-[0.98] transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer ${
                    language === 'javascript'
                      ? 'bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                  }`}
                >
                  {isComparing ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Comparing...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      <span>Run Benchmark Compare</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Guide Card */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] shadow-xl">
              <h3 className="text-sm font-bold uppercase tracking-widest text-cyan-400/80 mb-6 flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Guide
              </h3>
              <ul className="text-sm text-slate-300 space-y-6 font-light">
                {isCompareMode ? (
                  <>
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.6)]"></div>
                      <span>
                        Write two competing algorithms in Editor A and B.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.6)]"></div>
                      <span>
                        Input parameters in the Shared Input field. They will be
                        passed as a global variable <code>input</code>.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.6)]"></div>
                      <span>
                        Click &quot;Run Benchmark Compare&quot; to execute both
                        and get relative performance timing.
                      </span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.6)]"></div>
                      <span>Select your preferred programming language.</span>
                    </li>
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.6)]"></div>
                      <span>
                        Professional editor with syntax highlighting,
                        IntelliSense, and ligatures.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.6)]"></div>
                      <span>
                        Execute JavaScript directly and see results in the
                        real-time console below.
                      </span>
                    </li>
                  </>
                )}
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5 shrink-0"></div>
                  <span className="text-slate-500 italic">
                    (Coming Soon) Native execution for Python, Java, and C++.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Editor Panel */}
          <div className="w-full min-w-0">
            {!isCompareMode ? (
              <>
                <CodeEditor
                  language={language}
                  theme={theme}
                  defaultCode={code}
                  onCodeChange={handleCodeChange}
                  onRun={handleRunCode}
                  key={language}
                />
                <Terminal
                  ref={consoleRef}
                  logs={logs}
                  onClear={() => setLogs([])}
                />
              </>
            ) : (
              <div className="flex flex-col gap-8">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full min-w-0">
                  {/* Editor A Column */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-cyan-400">
                          Algorithm A
                        </h4>
                      </div>
                    </div>
                    <CodeEditor
                      language={language}
                      theme={theme}
                      defaultCode={codeA}
                      onCodeChange={(newVal) => setCodeA(newVal)}
                      onRun={handleRunCodeA}
                      height="500px"
                      key={`${language}-A`}
                    />
                    <Terminal
                      ref={consoleRefA}
                      logs={logsA}
                      onClear={() => setLogsA([])}
                    />
                  </div>

                  {/* Editor B Column */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-purple-400">
                          Algorithm B
                        </h4>
                      </div>
                    </div>
                    <CodeEditor
                      language={language}
                      theme={theme}
                      defaultCode={codeB}
                      onCodeChange={(newVal) => setCodeB(newVal)}
                      onRun={handleRunCodeB}
                      height="500px"
                      key={`${language}-B`}
                    />
                    <Terminal
                      ref={consoleRefB}
                      logs={logsB}
                      onClear={() => setLogsB([])}
                    />
                  </div>
                </div>

                {/* Benchmark Performance Display */}
                {benchmarkResults && (
                  <motion.div
                    className="bg-slate-900/40 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] shadow-xl"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h3 className="text-sm font-bold uppercase tracking-widest text-cyan-400 mb-6 flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-cyan-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2"
                        />
                      </svg>
                      Benchmark Results
                    </h3>

                    {/* Comparison metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Algorithm A Result */}
                      <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                            Algorithm A
                          </span>
                          <div className="text-3xl font-black text-white mt-1">
                            {benchmarkResults.statusA === 'timeout'
                              ? 'Timeout (3s)'
                              : benchmarkResults.statusA === 'error'
                                ? 'Error'
                                : `${benchmarkResults.durationA.toFixed(3)} ms`}
                          </div>
                        </div>
                        {benchmarkResults.statusA === 'success' && (
                          <div className="text-xs text-slate-500 mt-2 font-mono">
                            Completed successfully
                          </div>
                        )}
                      </div>

                      {/* Algorithm B Result */}
                      <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                            Algorithm B
                          </span>
                          <div className="text-3xl font-black text-white mt-1">
                            {benchmarkResults.statusB === 'timeout'
                              ? 'Timeout (3s)'
                              : benchmarkResults.statusB === 'error'
                                ? 'Error'
                                : `${benchmarkResults.durationB.toFixed(3)} ms`}
                          </div>
                        </div>
                        {benchmarkResults.statusB === 'success' && (
                          <div className="text-xs text-slate-500 mt-2 font-mono">
                            Completed successfully
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Visual Comparison Bars */}
                    {benchmarkResults.statusA === 'success' &&
                      benchmarkResults.statusB === 'success' && (
                        <div className="space-y-4">
                          <div className="relative pt-1">
                            <div className="flex mb-4 items-center justify-between text-xs">
                              <span className="text-slate-400 font-medium">
                                Relative Speed Ratio
                              </span>
                              <span className="font-bold text-cyan-400">
                                {benchmarkResults.durationA <
                                benchmarkResults.durationB
                                  ? `Algorithm A is ${(benchmarkResults.durationB / Math.max(0.001, benchmarkResults.durationA)).toFixed(1)}x faster`
                                  : benchmarkResults.durationB <
                                      benchmarkResults.durationA
                                    ? `Algorithm B is ${(benchmarkResults.durationA / Math.max(0.001, benchmarkResults.durationB)).toFixed(1)}x faster`
                                    : 'Both algorithms are equally fast'}
                              </span>
                            </div>

                            {(() => {
                              const maxDuration = Math.max(
                                benchmarkResults.durationA,
                                benchmarkResults.durationB,
                                0.001
                              )
                              const widthA =
                                (benchmarkResults.durationA / maxDuration) * 100
                              const widthB =
                                (benchmarkResults.durationB / maxDuration) * 100
                              return (
                                <div className="space-y-3 font-mono text-xs">
                                  <div>
                                    <div className="flex justify-between mb-1">
                                      <span className="text-cyan-400">
                                        Algorithm A
                                      </span>
                                      <span className="text-slate-400">
                                        {benchmarkResults.durationA.toFixed(3)}{' '}
                                        ms
                                      </span>
                                    </div>
                                    <div className="w-full bg-slate-950 rounded-full h-2.5 border border-slate-800/80 overflow-hidden">
                                      <div
                                        className="bg-cyan-500 h-2.5 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                                        style={{ width: `${widthA}%` }}
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <div className="flex justify-between mb-1">
                                      <span className="text-purple-400">
                                        Algorithm B
                                      </span>
                                      <span className="text-slate-400">
                                        {benchmarkResults.durationB.toFixed(3)}{' '}
                                        ms
                                      </span>
                                    </div>
                                    <div className="w-full bg-slate-950 rounded-full h-2.5 border border-slate-800/80 overflow-hidden">
                                      <div
                                        className="bg-purple-500 h-2.5 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.6)]"
                                        style={{ width: `${widthB}%` }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              )
                            })()}
                          </div>
                        </div>
                      )}
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default PracticePage
