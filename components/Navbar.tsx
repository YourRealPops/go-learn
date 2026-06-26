"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";

export default function Navbar() {
  const router = useRouter();
  const { user, isLoggedIn, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    // Clear cookie
    document.cookie = "golearn-token=; path=/; max-age=0";
    router.push("/login");
  }

  return (
    <nav className="h-14 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm flex items-center px-4 sm:px-6 gap-6 sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2 font-bold text-zinc-50 hover:text-cyan-400 transition-colors shrink-0">
        <span className="font-mono text-cyan-400 text-lg">Go</span>
        <span className="text-zinc-300">Learn</span>
      </Link>

      <div className="hidden md:flex items-center gap-4 ml-4">
        <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors">
          Lessons
        </Link>
        {isLoggedIn && (
          <Link href="/dashboard" className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors">
            Progress
          </Link>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <a
          href="https://go.dev/doc/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:block text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          Go docs ↗
        </a>

        {isLoggedIn ? (
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-500 hidden sm:block">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors border border-zinc-800 hover:border-zinc-700 rounded px-2.5 py-1"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/login"
              className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors px-2 sm:px-3 py-1.5"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-xs bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold px-2 sm:px-3 py-1.5 rounded-md transition-colors"
            >
              Sign up
            </Link>
          </div>
        )}

        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-zinc-400 hover:text-zinc-200 transition-colors"
          aria-label="Toggle menu"
        >
          <div className="w-5 h-0.5 bg-current mb-1"></div>
          <div className="w-5 h-0.5 bg-current mb-1"></div>
          <div className="w-5 h-0.5 bg-current"></div>
        </button>
      </div>

      {isMenuOpen && (
        <div className="absolute top-14 left-0 w-full bg-zinc-900 border-b border-zinc-800 p-4 flex flex-col gap-4 md:hidden z-50">
          <Link 
            href="/" 
            className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Lessons
          </Link>
          {isLoggedIn && (
            <Link 
              href="/dashboard" 
              className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Progress
            </Link>
          )}
          <a
            href="https://go.dev/doc/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Go docs ↗
          </a>
        </div>
      )}
    </nav>
  );
}
