"use client";

import { useState, useEffect } from "react";
import type { Lesson } from "@/lib/types";

interface LessonContentProps {
  lesson: Lesson;
}

export default function LessonContent({ lesson }: LessonContentProps) {
  const [hintsShown, setHintsShown] = useState(0);

  // Wake up the backend when lesson loads
useEffect(() => {
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`).catch(() => {});
}, []);

  return (
    <div className="flex flex-col h-full">
      {/* Lesson header */}
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest">
            Ch.{lesson.chapter} · {lesson.duration}min
          </span>
        </div>
        <h1 className="text-xl font-bold text-zinc-50 mb-1">{lesson.title}</h1>
        <p className="text-sm text-zinc-400">{lesson.description}</p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Lesson body */}
        <div
          className="lesson-prose"
          dangerouslySetInnerHTML={{ __html: lesson.contentHtml }}
        />

        {/* Challenge box */}
        <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span className="text-sm font-semibold text-cyan-300">Your challenge</span>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed">{lesson.challenge}</p>
        </div>

        {/* Hints */}
        {lesson.hints && lesson.hints.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-zinc-600 uppercase tracking-widest font-mono">Hints</p>
            {lesson.hints.slice(0, hintsShown).map((hint, i) => (
              <div key={i} className="rounded-md bg-zinc-900 border border-zinc-800 p-3 text-sm text-zinc-400">
                <span className="text-zinc-600 font-mono text-xs mr-2">#{i + 1}</span>
                {hint}
              </div>
            ))}
            {hintsShown < lesson.hints.length && (
              <button
                onClick={() => setHintsShown((n) => n + 1)}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors border border-zinc-800 rounded px-3 py-1.5 hover:border-zinc-600"
              >
                {hintsShown === 0 ? "Show first hint" : `Show hint ${hintsShown + 1} of ${lesson.hints.length}`}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer nav */}
      {(lesson.prevSlug || lesson.nextSlug) && (
        <div className="flex justify-between p-4 border-t border-zinc-800">
          {lesson.prevSlug ? (
            <a href={`/lesson/${lesson.prevSlug}`} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Prev
            </a>
          ) : <span />}
          {lesson.nextSlug && (
            <a href={`/lesson/${lesson.nextSlug}`} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1">
              Next
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          )}
        </div>
      )}
    </div>
  );
}