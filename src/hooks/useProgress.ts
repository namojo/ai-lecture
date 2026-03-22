"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { modules } from "@/data/curriculum";
import type { ProgressMap } from "@/types/curriculum";

const STORAGE_KEY = "ai-lecture-progress";

function loadProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const save = useCallback((next: ProgressMap) => {
    setProgress(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const markComplete = useCallback(
    (chapterId: string) => {
      const next = {
        ...progress,
        [chapterId]: {
          chapterId,
          completed: true,
          completedAt: new Date().toISOString(),
          lastVisitedAt: new Date().toISOString(),
        },
      };
      save(next);
    },
    [progress, save]
  );

  const markIncomplete = useCallback(
    (chapterId: string) => {
      const next = {
        ...progress,
        [chapterId]: {
          chapterId,
          completed: false,
          completedAt: null,
          lastVisitedAt: new Date().toISOString(),
        },
      };
      save(next);
    },
    [progress, save]
  );

  const toggleComplete = useCallback(
    (chapterId: string) => {
      if (progress[chapterId]?.completed) {
        markIncomplete(chapterId);
      } else {
        markComplete(chapterId);
      }
    },
    [progress, markComplete, markIncomplete]
  );

  const totalChapters = useMemo(
    () => modules.reduce((sum, m) => sum + m.chapters.length, 0),
    []
  );

  const completedCount = useMemo(
    () => Object.values(progress).filter((p) => p.completed).length,
    [progress]
  );

  const completionPercent = useMemo(
    () => (totalChapters > 0 ? Math.round((completedCount / totalChapters) * 100) : 0),
    [completedCount, totalChapters]
  );

  return {
    progress,
    markComplete,
    markIncomplete,
    toggleComplete,
    completedCount,
    totalChapters,
    completionPercent,
  };
}
