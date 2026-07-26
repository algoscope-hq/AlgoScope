import { useState } from "react";
import { CODE_EXAMPLES } from "../../data/codeExample";
import CodeViewer from "../CodeViewer";
import GreedyVisualizer from "./GreedyVisualizer";

const ALGORITHMS = [
  "Activity Selection",
  "Fractional Knapsack",
  "Huffman Coding",
  "Dijkstra's Algorithm",
];

export default function Visualizer() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(ALGORITHMS[0]);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const languages = ["javascript", "python", "java", "cpp"];
  const currentCode = CODE_EXAMPLES[selectedAlgorithm]?.[selectedLanguage] || "";

  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  const [startTimes, setStartTimes] = useState("");
  const [finishTimes, setFinishTimes] = useState("");
  const [weights, setWeights] = useState("");
  const [values, setValues] = useState("");
  const [capacity, setCapacity] = useState("");
  const [chars, setChars] = useState("");
  const [freqs, setFreqs] = useState("");
  const [edgesText, setEdgesText] = useState("");
  const [sourceNode, setSourceNode] = useState("");

  const handleReset = () => {
    setSteps([]);
    setCurrentStepIndex(-1);
    setIsPlaying(false);
  };

  const handleRun = () => {
    handleReset();
    let stepsArr = [];

    if (selectedAlgorithm === "Activity Selection") {
      const starts = startTimes.split(",").map((s) => Number(s.trim()));
      const finishes = finishTimes.split(",").map((s) => Number(s.trim()));
      if (starts.length !== finishes.length) return alert("Start/Finish arrays must match length");

      const activities = starts
        .map((start, i) => ({ id: `A${i + 1}`, start, finish: finishes[i] }))
        .sort((a, b) => a.finish - b.finish);

      const snapshot = activities.map((a) => ({ ...a, status: "pending" }));
      stepsArr.push({
        snapshot: snapshot.map((a) => ({ ...a })),
        activeIndex: -1,
        message: "Sorted by finish time. Starting selection.",
      });

      let lastFinish = -Infinity;
      activities.forEach((act, idx) => {
        if (act.start >= lastFinish) {
          snapshot[idx].status = "selected";
          lastFinish = act.finish;
          stepsArr.push({
            snapshot: snapshot.map((a) => ({ ...a })),
            activeIndex: idx,
            message: `${act.id} SELECTED`,
          });
        } else {
          snapshot[idx].status = "rejected";
          stepsArr.push({
            snapshot: snapshot.map((a) => ({ ...a })),
            activeIndex: idx,
            message: `${act.id} REJECTED (overlaps)`,
          });
        }
      });
    }

    if (selectedAlgorithm === "Fractional Knapsack") {
      const w = weights.split(",").map((x) => Number(x.trim()));
      const v = values.split(",").map((x) => Number(x.trim()));
      const cap = Number(capacity);
      if (w.length !== v.length) return alert("Weights/Values arrays must match length");

      let remaining = cap;
      let totalValue = 0;
      const items = w
        .map((weight, i) => ({ id: `I${i + 1}`, weight, value: v[i], ratio: v[i] / weight }))
        .sort((a, b) => b.ratio - a.ratio);

      stepsArr.push({
        items,
        remaining,
        totalValue,
        currentId: null,
        message: `Sorted by ratio. Capacity = ${cap}`,
      });

      items.forEach((item) => {
        if (remaining <= 0) {
          stepsArr.push({
            items,
            remaining,
            totalValue,
            currentId: item.id,
            fraction: 0,
            message: `Full — skip ${item.id}`,
          });
          return;
        }
        const take = Math.min(item.weight, remaining);
        const fraction = take / item.weight;
        totalValue += fraction * item.value;
        remaining -= take;
        stepsArr.push({
          items,
          remaining,
          totalValue,
          currentId: item.id,
          fraction,
          message: `Took ${(fraction * 100).toFixed(0)}% of ${item.id}`,
        });
      });
    }

    if (selectedAlgorithm === "Huffman Coding") {
      const c = chars.split(",").map((x) => x.trim());
      const f = freqs.split(",").map((x) => Number(x.trim()));
      if (c.length !== f.length) return alert("Characters/Frequencies must match length");

      let nodes = c.map((ch, i) => ({ id: ch, freq: f[i] }));
      stepsArr.push({ nodes: [...nodes], merged: null, message: "Initial frequencies loaded" });

      while (nodes.length > 1) {
        nodes.sort((a, b) => a.freq - b.freq);
        const left = nodes.shift();
        const right = nodes.shift();
        const merged = { id: `(${left.id}${right.id})`, freq: left.freq + right.freq };
        nodes.push(merged);
        stepsArr.push({
          nodes: [...nodes],
          merged: { left, right, result: merged },
          message: `Merged ${left.id} + ${right.id} → ${merged.freq}`,
        });
      }
    }

    if (selectedAlgorithm === "Dijkstra's Algorithm") {
      const edgeLines = edgesText
        .trim()
        .split("\n")
        .filter(Boolean)
        .map((l) => l.trim().split(/\s+/).map(Number));
      const src = Number(sourceNode);
      const nodeSet = new Set();
      edgeLines.forEach(([u, v]) => {
        nodeSet.add(u);
        nodeSet.add(v);
      });
      const nodesArr = [...nodeSet];

      const dist = {};
      nodesArr.forEach((n) => (dist[n] = Infinity));
      dist[src] = 0;
      const visited = new Set();

      stepsArr.push({ dist: { ...dist }, visited: [...visited], current: null, message: `Source = ${src}` });

      while (visited.size < nodesArr.length) {
        let u = null,
          best = Infinity;
        nodesArr.forEach((n) => {
          if (!visited.has(n) && dist[n] < best) {
            best = dist[n];
            u = n;
          }
        });
        if (u === null) break;
        visited.add(u);
        edgeLines
          .filter(([a]) => a === u)
          .forEach(([, v, w]) => {
            if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;
          });
        stepsArr.push({
          dist: { ...dist },
          visited: [...visited],
          current: u,
          message: `Visited ${u}, relaxed neighbors`,
        });
      }
    }

    setSteps(stepsArr);
    setCurrentStepIndex(stepsArr.length ? 0 : -1);
  };

  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">Greedy Algorithms</h1>
        <p className="text-slate-400 text-lg max-w-3xl leading-8">
          Greedy algorithms build a solution step by step by always choosing the
          best possible option at the current moment. They work efficiently for
          problems that satisfy the Greedy Choice Property and Optimal
          Substructure.
        </p>

        <div className="flex flex-wrap gap-3 mt-6">
          <span className="px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm">
            Interactive Visualization
          </span>
          <span className="px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-sm">
            Theory
          </span>
          <span className="px-4 py-2 rounded-full bg-violet-500/20 border border-violet-500/40 text-violet-300 text-sm">
            Complexity Analysis
          </span>
          <span className="px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-sm">
            Code Examples
          </span>
        </div>

        <h2 className="text-emerald-400 mt-6 text-xl">{selectedAlgorithm}</h2>
      </div>

      {/* Algorithm Selection Tabs */}
      <div className="mt-10 flex flex-wrap gap-3">
        {ALGORITHMS.map((algorithm) => (
          <button
            key={algorithm}
            onClick={() => setSelectedAlgorithm(algorithm)}
            className={`px-5 py-2 rounded-lg font-medium transition-all duration-300
              ${
                selectedAlgorithm === algorithm
                  ? "bg-emerald-500 text-white shadow-lg"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
          >
            {algorithm}
          </button>
        ))}
      </div>

      {/* =========================== MAIN LAYOUT =========================== */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
        {/* ================= Left Panel ================= */}
        <div className="lg:col-span-1">
          {/* Activity Selection Input */}
          {selectedAlgorithm === "Activity Selection" && (
            <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
              <h2 className="text-2xl font-bold text-white mb-5">
                Activity Selection Input
              </h2>

              <input
                type="text"
                placeholder="Start Times (1,3,0,5,8,5)"
                className="w-full p-3 mb-4 rounded-lg bg-slate-800 border border-slate-700 text-white"
                value={startTimes}
                onChange={(e) => setStartTimes(e.target.value)}
              />

              <input
                type="text"
                placeholder="Finish Times (2,4,6,7,9,9)"
                className="w-full p-3 mb-4 rounded-lg bg-slate-800 border border-slate-700 text-white"
                value={finishTimes}
                onChange={(e) => setFinishTimes(e.target.value)}
              />

              <button
                onClick={handleRun}
                className="w-full bg-emerald-500 hover:bg-emerald-600 py-3 rounded-lg text-white font-semibold"
              >
                {steps.length ? "Re-run Algorithm" : "Run Algorithm"}
              </button>
            </div>
          )}

          {/* Fractional Knapsack Input */}
          {selectedAlgorithm === "Fractional Knapsack" && (
            <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
              <h2 className="text-2xl font-bold text-white mb-5">
                Fractional Knapsack Input
              </h2>

              <input
                type="text"
                placeholder="Weights (10,20,30)"
                className="w-full p-3 mb-4 rounded-lg bg-slate-800 border border-slate-700 text-white"
                value={weights}
                onChange={(e) => setWeights(e.target.value)}
              />

              <input
                type="text"
                placeholder="Values (60,100,120)"
                className="w-full p-3 mb-4 rounded-lg bg-slate-800 border border-slate-700 text-white"
                value={values}
                onChange={(e) => setValues(e.target.value)}
              />

              <input
                type="number"
                placeholder="Capacity"
                className="w-full p-3 mb-4 rounded-lg bg-slate-800 border border-slate-700 text-white"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />

              <button
                onClick={handleRun}
                className="w-full bg-emerald-500 hover:bg-emerald-600 py-3 rounded-lg text-white font-semibold"
              >
                {steps.length ? "Re-run Algorithm" : "Run Algorithm"}
              </button>
            </div>
          )}

          {/* Huffman Coding Input */}
          {selectedAlgorithm === "Huffman Coding" && (
            <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
              <h2 className="text-2xl font-bold text-white mb-5">
                Huffman Coding Input
              </h2>

              <input
                type="text"
                placeholder="Characters (A,B,C,D,E,F)"
                className="w-full p-3 mb-4 rounded-lg bg-slate-800 border border-slate-700 text-white"
                value={chars}
                onChange={(e) => setChars(e.target.value)}
              />

              <input
                type="text"
                placeholder="Frequencies (5,9,12,13,16,45)"
                className="w-full p-3 mb-4 rounded-lg bg-slate-800 border border-slate-700 text-white"
                value={freqs}
                onChange={(e) => setFreqs(e.target.value)}
              />

              <button
                onClick={handleRun}
                className="w-full bg-emerald-500 hover:bg-emerald-600 py-3 rounded-lg text-white font-semibold"
              >
                {steps.length ? "Re-run Algorithm" : "Run Algorithm"}
              </button>
            </div>
          )}

          {/* Dijkstra Input */}
          {selectedAlgorithm === "Dijkstra's Algorithm" && (
            <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
              <h2 className="text-2xl font-bold text-white mb-5">Dijkstra Input</h2>

              <textarea
                rows={5}
                placeholder={`0 1 4\n0 2 1\n2 1 2\n1 3 1`}
                className="w-full p-3 mb-4 rounded-lg bg-slate-800 border border-slate-700 text-white"
                value={edgesText}
                onChange={(e) => setEdgesText(e.target.value)}
              />

              <input
                type="number"
                placeholder="Source Node"
                className="w-full p-3 mb-4 rounded-lg bg-slate-800 border border-slate-700 text-white"
                value={sourceNode}
                onChange={(e) => setSourceNode(e.target.value)}
              />

              <button
                onClick={handleRun}
                className="w-full bg-emerald-500 hover:bg-emerald-600 py-3 rounded-lg text-white font-semibold"
              >
                {steps.length ? "Re-run Algorithm" : "Run Algorithm"}
              </button>
            </div>
          )}

          <button
            onClick={handleReset}
            disabled={!steps.length}
            className="w-full mt-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ↺ Reset
          </button>
        </div>

        {/* ================= Right Panel ================= */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-700">
              <h2 className="text-white font-bold">Implementation</h2>
              <div className="flex gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-3 py-1 rounded text-sm ${
                      selectedLanguage === lang
                        ? "bg-cyan-500 text-white"
                        : "bg-slate-700 text-slate-300"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
                <button className="px-3 py-1 rounded bg-slate-700">Copy</button>
              </div>
            </div>

            <CodeViewer
              language={selectedLanguage}
              code={currentCode}
              title={`${selectedAlgorithm} Implementation`}
            />

            <GreedyVisualizer
              selectedAlgorithm={selectedAlgorithm}
              steps={steps}
              currentStepIndex={currentStepIndex}
              setCurrentStepIndex={setCurrentStepIndex}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
            />
          </div>

          <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 mt-6">
            <h3 className="text-lg font-semibold text-amber-400 mb-4">Code Examples</h3>

            {/* ========================== Complexity ========================== */}
            <div className="mt-6 grid md:grid-cols-2 gap-5">
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
                <h3 className="text-lg font-semibold text-emerald-400">Time Complexity</h3>
                <p className="text-white mt-3">
                  {selectedAlgorithm === "Activity Selection" && "O(n log n)"}
                  {selectedAlgorithm === "Fractional Knapsack" && "O(n log n)"}
                  {selectedAlgorithm === "Huffman Coding" && "O(n log n)"}
                  {selectedAlgorithm === "Dijkstra's Algorithm" && "O((V + E) log V)"}
                </p>
              </div>

              <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
                <h3 className="text-lg font-semibold text-cyan-400">Space Complexity</h3>
                <p className="text-white mt-3">
                  {selectedAlgorithm === "Activity Selection" && "O(1)"}
                  {selectedAlgorithm === "Fractional Knapsack" && "O(1)"}
                  {selectedAlgorithm === "Huffman Coding" && "O(n)"}
                  {selectedAlgorithm === "Dijkstra's Algorithm" && "O(V)"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}