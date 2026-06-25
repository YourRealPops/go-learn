import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiGetProgress, apiCompleteLesson } from "./api";

interface ProgressState {
  completedSlugs: string[];
  isLoading: boolean;
  fetchProgress: () => Promise<void>;
  markComplete: (slug: string) => Promise<void>;
  isCompleted: (slug: string) => boolean;
  completedCount: () => number;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedSlugs: [],
      isLoading: false,

      fetchProgress: async () => {
        try {
          const progress = await apiGetProgress();
          set({
            completedSlugs: progress.map((p) => p.lessonSlug),
            isLoading: true,
          });
        } catch {
          set({ isLoading: true });
        }
      },

      markComplete: async (slug: string) => {
        try {
          await apiCompleteLesson(slug);
          set((state) => ({
            completedSlugs: state.completedSlugs.includes(slug)
              ? state.completedSlugs
              : [...state.completedSlugs, slug],
          }));
        } catch {
          // fail silently
        }
      },

      isCompleted: (slug: string) => get().completedSlugs.includes(slug),
      completedCount: () => get().completedSlugs.length,
    }),
    { name: "golearn-progress" }
  )
);