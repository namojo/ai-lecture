"use client";

import { modules } from "@/data/curriculum";
import { useProgress } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";

export default function ProgressPage() {
  const { progress, completedCount, totalChapters, completionPercent } = useProgress();

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
        학습 진도
      </h1>
      <p className="text-[var(--text-muted)] mb-8">
        전체 {completedCount}/{totalChapters} 완료 ({completionPercent}%)
      </p>

      <div className="space-y-6">
        {modules.map((mod, mi) => {
          const completed = mod.chapters.filter(
            (c) => progress[c.id]?.completed
          ).length;
          const pct = Math.round((completed / mod.chapters.length) * 100);

          return (
            <div
              key={mod.id}
              className="p-4 rounded-lg border border-[var(--border-color)] bg-[var(--surface)]"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-[var(--text-primary)]">
                  Module {mi + 1}: {mod.title}
                </h3>
                <span className="text-sm text-[var(--text-muted)]">
                  {completed}/{mod.chapters.length}
                </span>
              </div>
              <div className="h-2 bg-[var(--surface-elevated)] rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-300",
                    pct === 100 ? "bg-green-500" : "bg-[var(--accent)]"
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
