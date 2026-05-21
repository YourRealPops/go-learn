"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import LessonContent from "@/components/LessonContent";
import OutputPanel from "@/components/OutputPanel";
import type { Lesson } from "@/lib/types";
import { apiRunCode } from "@/lib/api";

const CodeEditor = dynamic(() => import("@/components/CodeEditor"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-zinc-900 rounded-lg">
      <span className="text-zinc-600 text-sm font-mono animate-pulse">Loading editor...</span>
    </div>
  ),
});

interface LessonPageClientProps {
  lesson: Lesson;
}

export default function LessonPageClient({ lesson }: LessonPageClientProps) {
  const [code, setCode] = useState(lesson.starterCode);
  const [output, setOutput] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<"output" | "tests">("output");

  const runCode = useCallback(async () => {
  setIsRunning(true);
  setOutput(null);
  setTestResults(null);
  try {
    const data = await apiRunCode(code, lesson.slug);
    setOutput(data.output ?? "No output");
    setActiveTab("output");
  } catch (err) {
    setOutput(err instanceof Error ? err.message : "Runner unavailable");
  } finally {
    setIsRunning(false);
  }
}, [code, lesson.slug]);

  const resetCode = useCallback(() => {
    setCode(lesson.starterCode);
    setOutput(null);
    setTestResults(null);
  }, [lesson.starterCode]);

  const allTestsPassed = testResults?.every((t) => t.passed) ?? false;

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">
      {/* Left panel — lesson content */}
      <div className="w-[420px] flex-shrink-0 overflow-y-auto border-r border-zinc-800 bg-zinc-950">
        <LessonContent lesson={lesson} />
      </div>

      {/* Right panel — editor + output */}
      <div className="flex-1 flex flex-col min-w-0 bg-zinc-950 p-4 gap-3">
        {/* Editor toolbar */}
        <div className="flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-500">main.go</span>
            {allTestsPassed && (
              <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded px-2 py-0.5">
                All tests passing ✓
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resetCode}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors px-2 py-1 rounded hover:bg-zinc-800"
            >
              Reset
            </button>
            <button
              onClick={runCode}
              disabled={isRunning}
              className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-zinc-950 font-semibold text-sm px-4 py-1.5 rounded-md transition-colors"
            >
              {isRunning ? (
                <>
                  <span className="w-3 h-3 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Run  ⌘↵
                </>
              )}
            </button>
          </div>
        </div>

        {/* Monaco editor */}
        <div className="flex-1 min-h-0 monaco-container">
          <CodeEditor
            value={code}
            onChange={(val) => setCode(val ?? "")}
            onRun={runCode}
          />
        </div>

        {/* Output panel */}
        <div className="h-48 flex-shrink-0">
          <OutputPanel
            output={output}
            testResults={testResults}
            isRunning={isRunning}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </div>
    </div>
  );
}

interface TestResult {
  name: string;
  passed: boolean;
  expected?: string;
  got?: string;
}