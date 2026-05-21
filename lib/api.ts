import { useAuthStore } from "./auth-store";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = useAuthStore.getState().token;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    useAuthStore.getState().logout();
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error ?? "Something went wrong");
  }

  return data as T;
}

// --- Auth ---
export async function apiSignup(email: string, password: string) {
  return request<{ token: string; user: User }>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function apiLogin(email: string, password: string) {
  return request<{ token: string; user: User }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function apiMe() {
  return request<User>("/api/auth/me");
}

// --- Lessons ---
export async function apiGetLessons() {
  return request<Lesson[]>("/api/lessons");
}

export async function apiGetLesson(slug: string) {
  return request<Lesson>(`/api/lessons/${slug}`);
}

export async function apiCompleteLesson(slug: string) {
  return request<{ status: string }>(`/api/lessons/${slug}/complete`, {
    method: "POST",
  });
}

// --- Progress ---
export async function apiGetProgress() {
  return request<Progress[]>("/api/progress");
}

// --- Runner (calls Render directly, bypasses Netlify proxy) ---
export async function apiRunCode(code: string, lessonSlug?: string) {
  const token = useAuthStore.getState().token;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}/api/run`, {
    method: "POST",
    headers,
    body: JSON.stringify({ code, lessonSlug }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error ?? "Runner failed");
  }

  return data as { output: string; isError: boolean };
}

// --- Types ---
export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface Lesson {
  slug: string;
  title: string;
  description: string;
  chapter: number;
  duration: number;
  starterCode: string;
  challenge: string;
  hints: string[];
}

export interface Progress {
  userId: string;
  lessonSlug: string;
  completedAt: string;
}