import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="h-14 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm flex items-center px-6 gap-6 sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2 font-bold text-zinc-50 hover:text-cyan-400 transition-colors">
        <span className="font-mono text-cyan-400 text-lg">Go</span>
        <span className="text-zinc-300">Learn</span>
      </Link>
      <div className="flex items-center gap-4 ml-4">
        <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors">
          Lessons
        </Link>
        <Link href="/dashboard" className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors">
          Progress
        </Link>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <a
          href="https://go.dev/doc/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          Go docs ↗
        </a>
        <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-xs font-medium text-cyan-300">
          G
        </div>
      </div>
    </nav>
  );
}