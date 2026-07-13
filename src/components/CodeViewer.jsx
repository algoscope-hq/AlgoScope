import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import * as themes from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeViewer({
  code,
  language,
  title = "Implementation",
}) {
  const [theme, setTheme] = useState("vscDarkPlus");
  const [copied, setCopied] = useState(false);

  const activeTheme = themes[theme] || themes.vscDarkPlus;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1800);
  };

  const handleDownload = () => {
    const ext = {
      javascript: "js",
      python: "py",
      java: "java",
      cpp: "cpp",
    }[language];

    const blob = new Blob([code], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `${title}.${ext}`;

    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-xl border border-slate-700 bg-[#182235] overflow-hidden">

      {/* Header */}

      <div className="px-5 py-3 border-b border-slate-700">

        <div className="flex justify-center relative">

          <div>

            <p className="text-center text-cyan-400 tracking-[5px] text-xs font-bold">
              LIVE CODE
            </p>

            <h2 className="text-center text-white text-3xl font-bold mt-1">
              {title}
            </h2>

          </div>

          <div className="absolute right-0 top-2">

            <span className="px-4 py-2 rounded-full border border-cyan-500 text-cyan-400 text-sm">

              Waiting

            </span>

          </div>

        </div>

      </div>

      {/* Toolbar */}

      <div className="flex flex-wrap items-center gap-3 p-4 border-b border-slate-700">

        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white"
        >
          <option value="vscDarkPlus">VSC Dark Plus</option>
          <option value="oneDark">One Dark</option>
          <option value="dracula">Dracula</option>
          <option value="coldarkDark">Coldark Dark</option>
          <option value="materialDark">Material Dark</option>
        </select>

        <button
          onClick={handleDownload}
          className="px-4 py-2 rounded-lg border border-slate-600 hover:border-cyan-500 text-white"
        >
          Download
        </button>

        <button
          onClick={handleCopy}
          className={`px-4 py-2 rounded-lg border ${
            copied
              ? "bg-emerald-600 border-emerald-600"
              : "border-slate-600"
          } text-white`}
        >
          {copied ? "Copied" : "Copy Code"}
        </button>

      </div>

      {/* Code */}

      <SyntaxHighlighter
        language={language}
        style={activeTheme}
        showLineNumbers
        wrapLongLines
        customStyle={{
          margin: 0,
          background: "#0a1124",
          padding: "20px",
          fontSize: "15px",
          minHeight: "500px",
        }}
      >
        {code}
      </SyntaxHighlighter>

    </div>
  );
}