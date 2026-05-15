import { motion } from 'framer-motion'

const iterativeArray = [1, 2, 3, 4, 5, 6]

const recursiveCalls = [
  'search(8)',
  'search(4)',
  'search(2)',
  'return true',
]

export default function IterativeVsRecursive() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-white px-6 py-16">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 h-96 w-96 bg-cyan-500/20 blur-[140px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 h-96 w-96 bg-purple-500/20 blur-[140px] rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md mb-8">
            <div className="h-3 w-3 rounded-full bg-cyan-400 animate-pulse"></div>
            <span className="text-cyan-300 font-mono text-sm tracking-wider uppercase">
              Interactive Visualization
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Iterative vs Recursive
            </span>
          </h1>

          <p className="mt-8 text-slate-400 text-xl max-w-4xl mx-auto leading-9">
            Understand how loops traverse data step-by-step while recursive
            algorithms repeatedly divide problems into smaller subproblems
            using elegant self-calling functions.
          </p>
        </motion.div>

        {/* Main Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Iterative Section */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            whileHover={{
              scale: 1.02,
              boxShadow: '0px 0px 40px rgba(34,211,238,0.25)',
            }}
            className="rounded-3xl border border-cyan-500/20 bg-slate-900/60 backdrop-blur-xl p-8"
          >
            <div className="flex items-center gap-4 mb-8">
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="h-5 w-5 rounded-full bg-cyan-400"
              ></motion.div>

              <h2 className="text-4xl font-bold text-cyan-300">
                Iterative Approach
              </h2>
            </div>

            <p className="text-slate-300 leading-8 mb-10 text-lg">
              Iterative algorithms repeatedly execute instructions using loops.
              A pointer moves through data structures sequentially until the
              desired result is found.
            </p>

            {/* Array Traversal */}
            <div className="mb-12">
              <h3 className="text-2xl font-semibold mb-6 text-cyan-200">
                Array Traversal Animation
              </h3>

              <div className="flex flex-wrap justify-center gap-4">
                {iterativeArray.map((num, index) => (
                  <motion.div
                    key={index}
                    animate={{
                      y: [0, -20, 0],
                      boxShadow: [
                        '0px 0px 0px rgba(34,211,238,0)',
                        '0px 0px 30px rgba(34,211,238,0.8)',
                        '0px 0px 0px rgba(34,211,238,0)',
                      ],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      delay: index * 0.25,
                    }}
                    whileHover={{ scale: 1.1 }}
                    className="h-20 w-20 rounded-2xl border border-cyan-400 bg-cyan-500/10 flex items-center justify-center text-2xl font-bold"
                  >
                    {num}
                  </motion.div>
                ))}
              </div>

              <p className="text-center text-slate-400 mt-6">
                The loop pointer traverses one element at a time.
              </p>
            </div>

            {/* Iterative Flow */}
            <div className="flex items-center justify-center gap-4 flex-wrap mb-10">
              {['Start', 'Loop', 'Process', 'Increment', 'End'].map(
                (step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.2 }}
                    className="flex items-center gap-3"
                  >
                    <div className="px-5 py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                      {step}
                    </div>

                    {index !== 4 && (
                      <motion.div
                        animate={{ x: [0, 10, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                        }}
                        className="text-cyan-300 text-2xl"
                      >
                        →
                      </motion.div>
                    )}
                  </motion.div>
                )
              )}
            </div>

            {/* Code */}
            <pre className="bg-black/40 border border-cyan-500/20 rounded-2xl p-6 overflow-x-auto text-cyan-300 text-sm">
{`function linearSearch(arr, target) {
  for(let i = 0; i < arr.length; i++) {
    if(arr[i] === target) {
      return true;
    }
  }

  return false;
}`}
            </pre>
          </motion.div>

          {/* Recursive Section */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            whileHover={{
              scale: 1.02,
              boxShadow: '0px 0px 40px rgba(168,85,247,0.25)',
            }}
            className="rounded-3xl border border-purple-500/20 bg-slate-900/60 backdrop-blur-xl p-8"
          >
            <div className="flex items-center gap-4 mb-8">
              <motion.div
                animate={{ rotate: [0, 180, 360] }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: 'linear',
                }}
                className="h-5 w-5 rounded-full bg-purple-400"
              ></motion.div>

              <h2 className="text-4xl font-bold text-purple-300">
                Recursive Approach
              </h2>
            </div>

            <p className="text-slate-300 leading-8 mb-10 text-lg">
              Recursive algorithms solve problems by calling themselves on
              smaller subproblems until a base condition is reached.
            </p>

            {/* Binary Tree */}
            <div className="mb-14">
              <h3 className="text-2xl font-semibold mb-10 text-purple-200 text-center">
                Binary Tree Recursive Search
              </h3>

              <div className="flex flex-col items-center">
                <motion.div
                  animate={{
                    scale: [1, 1.15, 1],
                    boxShadow: [
                      '0px 0px 0px rgba(168,85,247,0)',
                      '0px 0px 35px rgba(168,85,247,0.9)',
                      '0px 0px 0px rgba(168,85,247,0)',
                    ],
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="h-20 w-20 rounded-full border border-purple-400 bg-purple-500/10 flex items-center justify-center text-2xl font-bold"
                >
                  8
                </motion.div>

                <div className="flex gap-24 mt-10">
                  <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                    }}
                    className="h-20 w-20 rounded-full border border-purple-400 bg-purple-500/10 flex items-center justify-center text-2xl font-bold"
                  >
                    4
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      delay: 0.5,
                    }}
                    className="h-20 w-20 rounded-full border border-purple-400 bg-purple-500/10 flex items-center justify-center text-2xl font-bold"
                  >
                    12
                  </motion.div>
                </div>
              </div>

              <p className="text-center text-slate-400 mt-8">
                Recursive traversal repeatedly explores child nodes.
              </p>
            </div>

            {/* Recursion Stack */}
            <div className="space-y-4 mb-10">
              {recursiveCalls.map((call, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.25 }}
                  whileHover={{ scale: 1.03 }}
                  className="bg-purple-500/10 border border-purple-500/20 rounded-xl px-5 py-4 flex items-center justify-between"
                >
                  <span>{call}</span>

                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                    }}
                    className="text-purple-300"
                  >
                    ↺
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Code */}
            <pre className="bg-black/40 border border-purple-500/20 rounded-2xl p-6 overflow-x-auto text-purple-300 text-sm">
{`function binarySearch(node, target) {
  if(node === null) return false;

  if(node.value === target) return true;

  if(target < node.value) {
    return binarySearch(node.left, target);
  }

  return binarySearch(node.right, target);
}`}
            </pre>
          </motion.div>
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-24 rounded-3xl overflow-hidden border border-slate-700 bg-slate-900/50 backdrop-blur-xl"
        >
          <div className="p-8 border-b border-slate-700">
            <h2 className="text-4xl font-bold">
              Quick Comparison
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/70">
                <tr>
                  <th className="p-5 text-left">Feature</th>
                  <th className="p-5 text-left text-cyan-300">
                    Iterative
                  </th>
                  <th className="p-5 text-left text-purple-300">
                    Recursive
                  </th>
                </tr>
              </thead>

              <tbody>
                {[
                  ['Technique', 'Loops', 'Self-calling functions'],
                  ['Memory Usage', 'Lower', 'Higher due to stack'],
                  ['Performance', 'Usually faster', 'Can be slower'],
                  [
                    'Best For',
                    'Sequential traversal',
                    'Trees & divide-conquer',
                  ],
                  ['Debugging', 'Simpler', 'Can be complex'],
                ].map((row, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.15 }}
                    className="border-t border-slate-700 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-5">{row[0]}</td>
                    <td className="p-5 text-slate-300">{row[1]}</td>
                    <td className="p-5 text-slate-300">{row[2]}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
      {/* Time Complexity Section */}
<motion.div
  initial={{ opacity: 0, y: 80 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4 }}
  className="mt-24"
>
  <div className="text-center mb-14">
    <h2 className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
      Time Complexity Analysis
    </h2>

    <p className="mt-6 text-slate-400 text-lg max-w-3xl mx-auto leading-8">
      Compare the computational efficiency of iterative and recursive
      approaches using Big-O complexity analysis.
    </p>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
    {/* Iterative Complexity */}
    <motion.div
      whileHover={{
        scale: 1.02,
        boxShadow: '0px 0px 35px rgba(34,211,238,0.2)',
      }}
      className="rounded-3xl border border-cyan-500/20 bg-slate-900/60 backdrop-blur-xl p-8"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="h-4 w-4 rounded-full bg-cyan-400 animate-pulse"></div>

        <h3 className="text-3xl font-bold text-cyan-300">
          Iterative Complexity
        </h3>
      </div>

      <div className="space-y-8">
        {/* Time */}
        <div>
          <div className="flex justify-between mb-3">
            <span className="text-slate-300">Time Complexity</span>

            <span className="text-cyan-300 font-bold">O(n)</span>
          </div>

          <div className="h-5 rounded-full bg-slate-800 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '75%' }}
              transition={{ duration: 1.5 }}
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-cyan-600"
            />
          </div>
        </div>

        {/* Space */}
        <div>
          <div className="flex justify-between mb-3">
            <span className="text-slate-300">Space Complexity</span>

            <span className="text-cyan-300 font-bold">O(1)</span>
          </div>

          <div className="h-5 rounded-full bg-slate-800 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '25%' }}
              transition={{ duration: 1.5, delay: 0.2 }}
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-cyan-600"
            />
          </div>
        </div>
      </div>

      <p className="mt-10 text-slate-400 leading-8">
        Iterative algorithms usually consume less memory because they avoid
        maintaining recursive call stacks.
      </p>
    </motion.div>

    {/* Recursive Complexity */}
    <motion.div
      whileHover={{
        scale: 1.02,
        boxShadow: '0px 0px 35px rgba(168,85,247,0.2)',
      }}
      className="rounded-3xl border border-purple-500/20 bg-slate-900/60 backdrop-blur-xl p-8"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="h-4 w-4 rounded-full bg-purple-400 animate-pulse"></div>

        <h3 className="text-3xl font-bold text-purple-300">
          Recursive Complexity
        </h3>
      </div>

      <div className="space-y-8">
        {/* Time */}
        <div>
          <div className="flex justify-between mb-3">
            <span className="text-slate-300">Time Complexity</span>

            <span className="text-purple-300 font-bold">O(log n)</span>
          </div>

          <div className="h-5 rounded-full bg-slate-800 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '45%' }}
              transition={{ duration: 1.5 }}
              className="h-full rounded-full bg-gradient-to-r from-purple-400 to-purple-600"
            />
          </div>
        </div>

        {/* Space */}
        <div>
          <div className="flex justify-between mb-3">
            <span className="text-slate-300">Space Complexity</span>

            <span className="text-purple-300 font-bold">O(log n)</span>
          </div>

          <div className="h-5 rounded-full bg-slate-800 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '55%' }}
              transition={{ duration: 1.5, delay: 0.2 }}
              className="h-full rounded-full bg-gradient-to-r from-purple-400 to-purple-600"
            />
          </div>
        </div>
      </div>

      <p className="mt-10 text-slate-400 leading-8">
        Recursive algorithms can be elegant and efficient for divide-and-conquer
        problems, but require additional stack memory.
      </p>
    </motion.div>
  </div>
</motion.div>
    </div>
  )
}