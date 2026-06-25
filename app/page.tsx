"use client";

import Link from "next/link";
import { useEffect } from "react";
import { getLessons } from "@/lib/lessons";
import { useProgressStore } from "@/lib/progress-store";
import { useAuthStore } from "@/lib/auth-store";

const lessons = getLessons();

const chapters = [
  { id: 1, title: "Thinking in Go", color: "from-cyan-500/20 to-cyan-500/5", border: "border-cyan-500/30" },
  { id: 2, title: "The Language Core", color: "from-violet-500/20 to-violet-500/5", border: "border-violet-500/30" },
  { id: 3, title: "Go's Superpowers", color: "from-emerald-500/20 to-emerald-500/5", border: "border-emerald-500/30" },
];

export default function Home() {
  const { isLoggedIn } = useAuthStore();
  const { completedSlugs, fetchProgress } = useProgressStore();

  useEffect(() => {
    if (isLoggedIn) fetchProgress();
  }, [isLoggedIn, fetchProgress]);

  const totalLessons = lessons.length;
  const completedCount = completedSlugs.length;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-14 text-center">
        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 text-cyan-400 text-sm mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Learn Go the right way
        </div>
        <h1 className="text-5xl font-bold text-zinc-50 mb-4 tracking-tight">
          Master <span className="text-cyan-400">Go</span> from first principles
        </h1>
        <p className="text-zinc-400 text-lg max-w-xl mx-auto">
          Interactive lessons that teach idiomatic Go — not just syntax.
          Write real code, get real feedback, build real intuition.
        </p>
        {isLoggedIn && totalLessons > 0 && (
          <div className="mt-8 max-w-sm mx-auto">
            <div className="flex justify-between text-xs text-zinc-500 mb-2">
              <span>{completedCount} of {totalLessons} lessons complete</span>
              <span>{Math.round((completedCount / totalLessons) * 100)}%</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-1.5">
              <div
                className="bg-cyan-500 h-1.5 rounded-full transition-all duration-700"
                style={{ width: `${(completedCount / totalLessons) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-8">
        {chapters.map((chapter) => {
          const chapterLessons = lessons.filter((l) => l.chapter === chapter.id);
          return (
            <div key={chapter.id} className={`rounded-xl border ${chapter.border} bg-gradient-to-br ${chapter.color} p-6`}>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                  Chapter {chapter.id}
                </span>
                <h2 className="text-lg font-semibold text-zinc-100">{chapter.title}</h2>
                <span className="ml-auto text-xs text-zinc-500 font-mono">
                  {chapterLessons.filter(l => completedSlugs.includes(l.slug)).length}/{chapterLessons.length}
                </span>
              </div>
              <div className="grid gap-2">
                {chapterLessons.map((lesson, idx) => {
                  const done = completedSlugs.includes(lesson.slug);
                  return (
                    <Link
                      key={lesson.slug}
                      href={`/lesson/${lesson.slug}`}
                      className={`flex items-center gap-4 p-3 rounded-lg border transition-all group ${
                        done
                          ? "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/30"
                          : "bg-zinc-900/60 hover:bg-zinc-800/80 border-zinc-700/40 hover:border-zinc-600/60"
                      }`}
                    >
                      <span className={`flex-shrink-0 w-7 h-7 rounded-md border text-xs font-mono flex items-center justify-center transition-colors ${
                        done
                          ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                          : "bg-zinc-800 border-zinc-700 text-zinc-400 group-hover:border-cyan-500/50 group-hover:text-cyan-400"
                      }`}>
                        {done ? (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium transition-colors ${
                          done ? "text-zinc-400 line-through decoration-zinc-600" : "text-zinc-200 group-hover:text-zinc-50"
                        }`}>
                          {lesson.title}
                        </p>
                        <p className="text-xs text-zinc-500 mt-0.5">{lesson.description}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-zinc-600 font-mono">{lesson.duration}m</span>
                        {done ? (
                          <span className="text-xs text-emerald-400">✓</span>
                        ) : (
                          <svg className="w-4 h-4 text-zinc-600 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </div>
                    </Link>
                  );
                })}
                {chapterLessons.length === 0 && (
                  <p className="text-sm text-zinc-600 italic py-2">Coming soon...</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}