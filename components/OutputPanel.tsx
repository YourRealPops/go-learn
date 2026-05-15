"use client";

interface TestResult {
  name: string;
  passed: boolean;
  expected?: string;
  got?: string;
}

interface OutputPanelProps {
  output: string | null;
  testResults: TestResult[] | null;
  isRunning: boolean;
  activeTab: "output" | "tests";
  onTabChange: (tab: "output" | "tests") => void;
}

export default function OutputPanel({
  output,
  testResults,
  isRunning,
  activeTab,
  onTabChange,
}: OutputPanelProps) {
  const passCount = testResults?.filter((t) => t.passed).length ?? 0;
  const totalCount = testResults?.length ?? 0;

  return (
    <div className="flex flex-col h-full rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-zinc-800 flex-shrink-0">
        <button
          onClick={() => onTabChange("output")}
          className={`text-xs px-2 py-1 rounded transition-colors ${
            activeTab === "output"
              ? "bg-zinc-700 text-zinc-200"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Output
        </button>
        {testResults && (
          <button
            onClick={() => onTabChange("tests")}
            className={`text-xs px-2 py-1 rounded transition-colors flex items-center gap-1.5 ${
              activeTab === "tests"
                ? "bg-zinc-700 text-zinc-200"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Tests
            <span
              className={`text-xs font-mono ${
                passCount === totalCount ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {passCount}/{totalCount}
            </span>
          </button>
        )}
        {isRunning && (
          <span className="ml-auto text-xs text-zinc-600 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            Running...
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {isRunning && !output && (
          <div className="flex items-center gap-2 text-zinc-600 text-sm">
            <span className="w-3 h-3 border-2 border-zinc-600 border-t-transparent rounded-full animate-spin" />
            Compiling and running...
          </div>
        )}

        {!isRunning && !output && !testResults && (
          <p className="text-zinc-700 text-sm font-mono">
            Press <span className="text-zinc-500">⌘↵</span> or click Run to execute your code
          </p>
        )}

        {activeTab === "output" && output && (
          <pre className={`text-sm font-mono whitespace-pre-wrap leading-relaxed ${
            output.toLowerCase().includes("error") || output.toLowerCase().includes("undefined")
              ? "text-red-400"
              : "text-zinc-200"
          }`}>
            {output}
          </pre>
        )}

        {activeTab === "tests" && testResults && (
          <div className="space-y-2">
            {testResults.map((result, i) => (
              <div
                key={i}
                className={`rounded-md border p-3 ${
                  result.passed
                    ? "bg-emerald-500/5 border-emerald-500/20"
                    : "bg-red-500/5 border-red-500/20"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={result.passed ? "text-emerald-400" : "text-red-400"}>
                    {result.passed ? "✓" : "✗"}
                  </span>
                  <span className="text-sm font-mono text-zinc-300">{result.name}</span>
                </div>
                {!result.passed && (result.expected || result.got) && (
                  <div className="mt-2 space-y-1 text-xs font-mono">
                    {result.expected && (
                      <p className="text-zinc-500">
                        expected: <span className="text-emerald-400">{result.expected}</span>
                      </p>
                    )}
                    {result.got && (
                      <p className="text-zinc-500">
                        got: <span className="text-red-400">{result.got}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}