"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { modules, getModule, getChapter, getAdjacentChapters } from "@/data/curriculum";
import { useProgress } from "@/hooks/useProgress";
import ChapterView from "@/components/lecture/ChapterView";

export default function ChapterContent({
  moduleId,
  chapterId,
  markdown,
}: {
  moduleId: string;
  chapterId: string;
  markdown: string | null;
}) {
  const mod = getModule(moduleId);
  const chapter = getChapter(moduleId, chapterId);
  const { prev, next } = getAdjacentChapters(moduleId, chapterId);
  const { progress, toggleComplete } = useProgress();

  if (!mod || !chapter) {
    return (
      <div className="p-8 text-[var(--text-secondary)]">
        챕터를 찾을 수 없습니다.
      </div>
    );
  }

  const isCompleted = progress[chapterId]?.completed;
  const moduleIndex = modules.findIndex((m) => m.id === moduleId) + 1;

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Breadcrumb */}
      <nav className="flex items-center text-[13px] text-[var(--text-muted)] mb-6">
        <Link
          href={`/module/${moduleId}`}
          className="hover:text-[var(--accent)] transition-colors"
        >
          Module {moduleIndex}
        </Link>
        <span className="mx-2">›</span>
        <span className="text-[var(--text-secondary)]">{chapter.title}</span>
      </nav>

      {/* Content Area */}
      {markdown ? (
        <ChapterView content={markdown} />
      ) : (
        <div className="p-8 rounded-lg border border-dashed border-[var(--border-color)] text-center text-[var(--text-muted)] my-8">
          <p className="text-lg mb-2">콘텐츠 준비 중</p>
          <p className="text-sm">
            경로: src/content/{chapter.contentPath}
          </p>
        </div>
      )}

      {/* Chapter Navigation */}
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
    </div>
  );
}
