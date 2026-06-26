"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import LessonContent from "@/components/LessonContent";
import OutputPanel from "@/components/OutputPanel";
import { apiRunCode } from "@/lib/api";
import { useProgressStore } from "@/lib/progress-store";
import { useAuthStore } from "@/lib/auth-store";
import type { Lesson } from "@/lib/types";

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

interface TestResult {
  name: string;
  passed: boolean;
  expected?: string;
  got?: string;
}

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import LessonContent from "@/components/LessonContent";
import OutputPanel from "@/components/OutputPanel";
import { apiRunCode } from "@/lib/api";
import { useProgressStore } from "@/lib/progress-store";
import { useAuthStore } from "@/lib/auth-store";
import type { Lesson } from "@/lib/types";

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

interface TestResult {
  name: string;
  passed: boolean;
  expected?: string;
  got?: string;
}

export default function LessonPageClient({ lesson }: LessonPageClientProps) {
  const [code, setCode] = useState(lesson.starterCode);
  const [output, setOutput] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<"output" | "tests">("output");
  const [hasRun, setHasRun] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [mobileView, setMobileView] = useState<"content" | "editor">("content");

  const { isCompleted, markComplete, fetchProgress } = useProgressStore();
  const { isLoggedIn } = useAuthStore();
  const completed = isCompleted(lesson.slug);

  // Fetch progress from backend on mount
  useEffect(() => {
    if (isLoggedIn) fetchProgress();
  }, [isLoggedIn, fetchProgress]);

  const runCode = useCallback(async () => {
    setIsRunning(true);
    setOutput(null);
    setTestResults(null);
    try {
      const data = await apiRunCode(code, lesson.slug);
      setOutput(data.output ?? "No output");
      setHasRun(true);
      setActiveTab("output");
      if (mobileView === "content") setMobileView("editor");
    } catch (err) {
      setOutput(err instanceof Error ? err.message : "Runner unavailable");
      setHasRun(true);
      if (mobileView === "content") setMobileView("editor");
    } finally {
      setIsRunning(false);
    }
  }, [code, lesson.slug]);

  const handleMarkComplete = async () => {
    if (!isLoggedIn) return;
    setIsCompleting(true);
    await markComplete(lesson.slug);
    setIsCompleting(false);
  };

  const resetCode = useCallback(() => {
    setCode(lesson.starterCode);
    setOutput(null);
    setTestResults(null);
    setHasRun(false);
  }, [lesson.starterCode]);

  const hasError = output?.toLowerCase().includes("error") ||
    output?.toLowerCase().includes("undefined");

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">
      {/* Left panel — lesson content */}
      <div className={`w-full md:w-[420px] flex-shrink-0 overflow-y-auto border-r border-zinc-800 bg-zinc-950 ${mobileView === "editor" ? "hidden md:block" : "block"}`}>
        <LessonContent lesson={lesson} />
      </div>

      {/* Right panel — editor + output */}
      <div className={`flex-1 flex flex-col min-w-0 bg-zinc-950 p-4 gap-3 ${mobileView === "content" ? "hidden md:flex" : "flex"}`}>
        {/* Editor toolbar */}
        <div className="flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-500">main.go</span>
            {completed && (
              <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded px-2 py-0.5 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Completed
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Mark complete button — shows after running code */}
            {hasRun && !completed && !hasError && isLoggedIn && (
              <button
                onClick={handleMarkComplete}
                disabled={isCompleting}
                className="hidden sm:flex items-center gap-1.5 text-xs bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 font-medium px-3 py-1.5 rounded-md transition-colors"
              >
                {isCompleting ? (
                  <>
                    <span className="w-3 h-3 border-2 border-emerald-500/50 border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Mark complete
                  </>
                )}
              </button>
            )}
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
                  Run
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

      {/* Mobile view toggle */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex bg-zinc-800 border border-zinc-700 rounded-full p-1 gap-1 md:hidden z-50 shadow-2xl">
        <button 
          onClick={() => setMobileView("content")}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${mobileView === "content" ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-zinc-200"}`}
        >
          Content
        </button>
        <button 
          onClick={() => setMobileView("editor")}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${mobileView === "editor" ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-zinc-200"}`}
        >
          Editor
        </button>
      </div>
    </div>
  );
}
