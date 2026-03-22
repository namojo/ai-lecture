"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";

interface NavChapter {
  id: string;
  moduleId: string;
  title: string;
}

interface ChapterNavProps {
  chapterId: string;
  prev: NavChapter | null;
  next: NavChapter | null;
}

export default function ChapterNav({ chapterId, prev, next }: ChapterNavProps) {
  const { progress, toggleComplete } = useProgress();
  const isCompleted = progress[chapterId]?.completed;

  return (
    <div className="flex items-center justify-between border-t border-[var(--border-color)] pt-6 mt-12">
      {prev ? (
        <Link
          href={`/module/${prev.moduleId}/${prev.id}`}
          className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors max-w-[40%]"
        >
          <ChevronLeft className="w-4 h-4 shrink-0" />
          <span className="truncate">이전: {prev.title}</span>
        </Link>
      ) : (
        <div />
      )}

      <label className="flex items-center gap-2 cursor-pointer select-none shrink-0">
        <input
          type="checkbox"
          checked={isCompleted || false}
          onChange={() => toggleComplete(chapterId)}
          className="w-4 h-4 rounded accent-[var(--accent)]"
        />
        <span className="text-sm text-[var(--text-secondary)]">학습 완료</span>
      </label>

      {next ? (
        <Link
          href={`/module/${next.moduleId}/${next.id}`}
          className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors max-w-[40%]"
        >
          <span className="truncate">다음: {next.title}</span>
          <ChevronRight className="w-4 h-4 shrink-0" />
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
