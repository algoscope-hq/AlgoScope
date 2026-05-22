import React, { useState, useEffect, useRef } from "react";

const LogPanel = ({ logs = [], activeStack = [] }) => {
  const [isOpen, setIsOpen] = useState(true);
  const logEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, isOpen]);

  return (
    <div className="relative flex h-full min-h-[500px] transition-all duration-300 ease-in-out">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute left-[-32px] top-4 bg-gray-800 text-white p-2 rounded-l-md border border-r-0 border-gray-700 hover:bg-gray-700 transition-colors z-50 font-mono text-xs"
        title={isOpen ? "Collapse Logs" : "Expand Logs"}
        aria-label={isOpen ? "Collapse logs" : "Expand logs"}
        aria-expanded={isOpen}
      >
        {isOpen ? "▶" : "◀"}
      </button>

      {/* Main Panel Content */}
      <div
        className={`${
          isOpen ? "w-80 border-l border-gray-700" : "w-0 overflow-hidden border-none"
        } bg-gray-950 text-green-400 font-mono flex flex-col transition-all duration-300 ease-in-out shadow-2xl`}
      >
        {/* Header */}
        <div className="p-3 bg-gray-900 border-b border-gray-700 flex items-center gap-2 text-gray-200 font-sans text-sm font-semibold">
          <span>⚙️ Execution Log & Stack</span>
        </div>

        {/* Section 1: Call Stack Visualizer */}
        {activeStack.length > 0 && (
          <div className="p-3 bg-gray-900/50 border-b border-gray-800 text-xs flex flex-col gap-1 max-h-32 overflow-y-auto">
            <span className="text-gray-400 font-sans font-medium uppercase tracking-wider text-[10px]">Active Call Stack:</span>
            <div className="flex flex-col-reverse gap-1 pl-2 border-l-2 border-green-600/40">
              {activeStack.map((frame, idx) => (
                <div key={idx} className="text-blue-400 truncate">
                  {"  ".repeat(activeStack.length - 1 - idx)}→ {frame}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Dynamic Logs History */}
        <div className="flex-1 overflow-y-auto p-4 text-xs space-y-2">
          {logs.length === 0 ? (
            <div className="text-gray-500 italic text-center pt-8 font-sans">
              Start simulation to see logs...
            </div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="leading-relaxed border-b border-gray-900/40 pb-1">
                <span className="text-gray-500 mr-2">[{index + 1}]</span>
                <span className={log.includes("Swapped") || log.includes("Partition") ? "text-yellow-300" : "text-green-400"}>
                  {log}
                </span>
              </div>
            ))
          )}
          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
};

export default LogPanel;