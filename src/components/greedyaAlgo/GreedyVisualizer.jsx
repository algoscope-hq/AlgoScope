import React, { useMemo  ,useState, useEffect } from "react";

export default function GreedyVisualizer({
  selectedAlgorithm,
  inputData,
}) {

  // ==========================
  // Activity Selection
  // ==========================

  const activities = useMemo(() => {
  if (
    inputData?.start?.length &&
    inputData?.finish?.length &&
    inputData.start.length === inputData.finish.length
  ) {
    return inputData.start.map((start, index) => ({
      id: index + 1,
      start: Number(start),
      finish: Number(inputData.finish[index]),
    }));
  }

  return [
    { id: 1, start: 1, finish: 2 },
    { id: 2, start: 3, finish: 4 },
    { id: 3, start: 0, finish: 6 },
    { id: 4, start: 5, finish: 7 },
    { id: 5, start: 8, finish: 9 },
    { id: 6, start: 5, finish: 9 },
  ];
}, [inputData]);
const [currentIndex, setCurrentIndex] = useState(0);
const [selectedActivities, setSelectedActivities] = useState([]);
const [rejectedActivities, setRejectedActivities] = useState([]);
const [isPlaying, setIsPlaying] = useState(false);

useEffect(() => {

  if (!isPlaying) return;

  if (currentIndex >= activities.length) {
    setIsPlaying(false);
    return;
  }

  const timer = setTimeout(() => {

    if (currentIndex === 0) {
      setSelectedActivities([0]);
    } else {

      const lastSelected =
        activities[selectedActivities[selectedActivities.length - 1]];

      const current = activities[currentIndex];

      if (current.start >= lastSelected.finish) {

        setSelectedActivities(prev => [...prev, currentIndex]);

      } else {

        setRejectedActivities(prev => [...prev, currentIndex]);

      }

    }

    setCurrentIndex(prev => prev + 1);

  }, 1200);

  return () => clearTimeout(timer);

}, [
  isPlaying,
  currentIndex,
  activities,
  selectedActivities
]);
 const handlePlay = () => {

  if (currentIndex >= activities.length) return;

  setIsPlaying(true);
 }
 
  const handlePause = () => {

  setIsPlaying(false);

};
const handleReset = () => {

  setCurrentIndex(0);

  setSelectedActivities([]);

  setRejectedActivities([]);

  setIsPlaying(false);

};
  const renderActivitySelection = () => {
  return (
    <div className="w-full rounded-xl border border-slate-700 bg-slate-900 p-6">

      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">
          Visualization
        </p>

        <h2 className="text-3xl font-bold text-white mt-2">
          Activity Selection
        </h2>
      </div>

      {/* Legend */}

      <div className="flex justify-center gap-8 mb-8 text-sm">

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-500"></div>
          <span className="text-slate-300">Current</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500"></div>
          <span className="text-slate-300">Selected</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500"></div>
          <span className="text-slate-300">Rejected</span>
        </div>

      </div>
      <div className="flex justify-center gap-4 mb-8">

    <button
        onClick={handlePlay}
        className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600"
    >
        ▶ Play
    </button>

    <button
        onClick={handlePause}
        className="px-5 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600"
    >
        ⏸ Pause
    </button>

    <button
        onClick={handleReset}
        className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600"
    >
        ↺ Reset
    </button>

</div>

      {/* Activities */}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">

        {activities.map((activity, index) => {

          let color =
            "border-slate-700 bg-slate-800";

          if (selectedActivities.includes(index))
            color =
              "border-green-400 bg-green-500/20";

          if (rejectedActivities.includes(index))
            color =
              "border-red-400 bg-red-500/20";

          if (currentIndex === index)
            color =
              "border-blue-400 bg-blue-500/20 scale-105";

          return (

            <div
              key={activity.id}
              className={`rounded-xl border p-5 transition-all duration-300 ${color}`}
            >

              <h3 className="text-center text-xl font-bold text-white">
                A{activity.id}
              </h3>

              <div className="mt-5 space-y-4">

                <div className="text-center">
                  <p className="text-xs uppercase text-slate-400">
                    Start
                  </p>

                  <p className="text-cyan-300 text-2xl font-bold">
                    {activity.start}
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-xs uppercase text-slate-400">
                    Finish
                  </p>

                  <p className="text-orange-300 text-2xl font-bold">
                    {activity.finish}
                  </p>
                </div>

              </div>

            </div>

          );

        })}

      </div>

      {/* Current */}

      <div className="mt-8 rounded-xl bg-slate-800 p-5">

        <h3 className="text-cyan-400 font-semibold">
          Current Step
        </h3>

        <p className="mt-2 text-slate-300">
          Checking Activity {currentIndex + 1}
        </p>

      </div>

      {/* Output */}

      <div className="mt-6 rounded-xl bg-slate-800 p-5">

        <h3 className="font-semibold text-green-400">
          Selected Activities
        </h3>

        <div className="flex gap-3 mt-4">

          {selectedActivities.map((index) => (

            <div
              key={index}
              className="px-4 py-2 rounded-lg bg-green-500 font-bold text-white"
            >
              A{index + 1}
            </div>

          ))}

        </div>

      </div>

    </div>
    
  );
};

  // ==========================
  // Fractional Knapsack
  // ==========================

  const renderFractionalKnapsack = () => {
    return (
      <div>
        Fractional Knapsack Visualization
      </div>
    );
  };

  // ==========================
  // Huffman Coding
  // ==========================

  const renderHuffman = () => {
    return (
      <div>
        Huffman Tree Visualization
      </div>
    );
  };

  // ==========================
  // Dijkstra
  // ==========================

  const renderDijkstra = () => {
    return (
      <div>
        Dijkstra Visualization
      </div>
    );
  };

  // ==========================
  // Decide what to render
  // ==========================

  const renderVisualization = () => {
    switch (selectedAlgorithm) {

      case "Activity Selection":
        return renderActivitySelection();

      case "Fractional Knapsack":
        return renderFractionalKnapsack();

      case "Huffman Coding":
        return renderHuffman();

      case "Dijkstra's Algorithm":
        return renderDijkstra();

      default:
        return (
          <div className="flex items-center justify-center h-[500px] rounded-xl border border-slate-700 bg-slate-900">
            <p className="text-slate-400">
              Select an algorithm to visualize.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">
      {renderVisualization()}
    </div>
  );
}