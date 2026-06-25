"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useProgressStore } from "@/lib/progress-store";
import { useAuthStore } from "@/lib/auth-store";
import { getLessons } from "@/lib/lessons";

const lessons = getLessons();

const chapters = [
  { id: 1, title: "Thinking in Go", color: "bg-cyan-500", textColor: "text-cyan-400", border: "border-cyan-500/30" },
  { id: 2, title: "The Language Core", color: "bg-violet-500", textColor: "text-violet-400", border: "border-violet-500/30" },
  { id: 3, title: "Go's Superpowers", color: "bg-emerald-500", textColor: "text-emerald-400", border: "border-emerald-500/30" },
];

export default function Dashboard() {
  const { isLoggedIn, user } = useAuthStore();
  const { completedSlugs, fetchProgress, isLoading } = useProgressStore();

  useEffect(() => {
    if (isLoggedIn) fetchProgress();
  }, [isLoggedIn, fetchProgress]);

  const totalLessons = lessons.length;
  const completedCount = completedSlugs.length;
  const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // SVG ring progress
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-zinc-50 mb-1">Your progress</h1>
        <p className="text-zinc-500 text-sm">
          {isLoggedIn ? `Signed in as ${user?.email}` : "Sign in to track your progress"}
        </p>
      </div>

      {/* Top stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {/* Progress ring */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex items-center gap-6">
          <div className="relative flex-shrink-0">
            <svg width="128" height="128" className="-rotate-90">
              {/* Background ring */}
              <circle
                cx="64" cy="64" r={radius}
                fill="none"
                stroke="#27272a"
                strokeWidth="10"
              />
              {/* Progress ring */}
              <circle
                cx="64" cy="64" r={radius}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-zinc-50">{percentage}%</span>
              <span className="text-xs text-zinc-500">done</span>
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-zinc-50">{completedCount}</p>
            <p className="text-zinc-500 text-sm">of {totalLessons} lessons</p>
            <p className="text-zinc-600 text-xs mt-2">completed</p>
          </div>
        </div>

        {/* Streak */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col justify-between">
          <div className="text-3xl mb-2">🔥</div>
          <div>
            <p className="text-3xl font-bold text-zinc-50">
              {completedCount > 0 ? Math.min(completedCount, 7) : 0}
            </p>
            <p className="text-zinc-500 text-sm">day streak</p>
          </div>
          <p className="text-xs text-zinc-600 mt-2">Keep it up — come back tomorrow!</p>
        </div>

        {/* Next lesson */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col justify-between">
          <p className="text-xs text-zinc-600 uppercase tracking-widest font-mono mb-3">Up next</p>
          {(() => {
            const nextLesson = lessons.find((l) => !completedSlugs.includes(l.slug));
            return nextLesson ? (
              <>
                <div>
                  <p className="text-sm font-semibold text-zinc-200 mb-1">{nextLesson.title}</p>
                  <p className="text-xs text-zinc-500">{nextLesson.description}</p>
                </div>
                <Link
                  href={`/lesson/${nextLesson.slug}`}
                  className="mt-4 inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold text-xs px-3 py-2 rounded-md transition-colors"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Continue learning
                </Link>
              </>
            ) : (
              <div>
                <p className="text-emerald-400 font-semibold text-sm">🎉 All lessons complete!</p>
                <p className="text-zinc-500 text-xs mt-1">You have mastered the curriculum so far.</p>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Chapter progress bars */}
      <div className="mb-10">
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-4">By chapter</h2>
        <div className="space-y-3">
          {chapters.map((chapter) => {
            const chapterLessons = lessons.filter((l) => l.chapter === chapter.id);
            const chapterCompleted = chapterLessons.filter((l) => completedSlugs.includes(l.slug)).length;
            const chapterPct = chapterLessons.length > 0
              ? Math.round((chapterCompleted / chapterLessons.length) * 100)
              : 0;

            return (
              <div key={chapter.id} className={`bg-zinc-900 border ${chapter.border} rounded-xl p-4`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-zinc-600">Ch.{chapter.id}</span>
                    <span className={`text-sm font-medium ${chapter.textColor}`}>{chapter.title}</span>
                  </div>
                  <span className="text-xs text-zinc-500 font-mono">
                    {chapterCompleted}/{chapterLessons.length}
                  </span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-1.5">
                  <div
                    className={`${chapter.color} h-1.5 rounded-full transition-all duration-700`}
                    style={{ width: `${chapterPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lesson list */}
      <div>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-4">All lessons</h2>
        {isLoading ? (
          <div className="flex items-center gap-2 text-zinc-600 text-sm py-4">
            <span className="w-4 h-4 border-2 border-zinc-700 border-t-zinc-400 rounded-full animate-spin" />
            Loading progress...
          </div>
        ) : (
          <div className="space-y-2">
            {lessons.map((lesson) => {
              const done = completedSlugs.includes(lesson.slug);
              const chapter = chapters.find((c) => c.id === lesson.chapter);
              return (
                <Link
                  key={lesson.slug}
                  href={`/lesson/${lesson.slug}`}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-all group ${
                    done
                      ? "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40"
                      : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  {/* Completion indicator */}
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    done
                      ? "border-emerald-500 bg-emerald-500/20"
                      : "border-zinc-700 group-hover:border-zinc-500"
                  }`}>
                    {done ? (
                      <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-zinc-700 group-hover:bg-zinc-500 transition-colors" />
                    )}
                  </div>

                  {/* Lesson info */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium transition-colors ${
                      done ? "text-zinc-300" : "text-zinc-300 group-hover:text-zinc-100"
                    }`}>
                      {lesson.title}
                    </p>
                    <p className="text-xs text-zinc-600 mt-0.5">{lesson.description}</p>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded font-mono ${chapter?.textColor} bg-zinc-800`}>
                      Ch.{lesson.chapter}
                    </span>
                    <span className="text-xs text-zinc-600 font-mono">{lesson.duration}m</span>
                    {done ? (
                      <span className="text-xs text-emerald-400 font-medium">Done</span>
                    ) : (
                      <svg className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}