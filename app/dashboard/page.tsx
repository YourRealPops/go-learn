import { getLessons } from "@/lib/lessons";
import Link from "next/link";

export default function Dashboard() {
  const lessons = getLessons();

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold text-zinc-50 mb-2">Your progress</h1>
      <p className="text-zinc-500 mb-8 text-sm">
        {lessons.length} lessons across 3 chapters.
        Progress tracking connects to your Go backend in the next phase.
      </p>

      <div className="space-y-2">
        {lessons.map((lesson) => (
          <Link
            key={lesson.slug}
            href={`/lesson/${lesson.slug}`}
            className="flex items-center gap-4 p-4 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full border-2 border-zinc-700 group-hover:border-cyan-500/50 transition-colors flex items-center justify-center flex-shrink-0">
              <span className="text-zinc-600 text-xs">○</span>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-300 group-hover:text-zinc-100 transition-colors">{lesson.title}</p>
              <p className="text-xs text-zinc-600 mt-0.5">Chapter {lesson.chapter} · {lesson.duration}min</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}