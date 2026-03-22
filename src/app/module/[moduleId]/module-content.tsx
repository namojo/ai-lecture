"use client";

import Link from "next/link";
import * as Icons from "lucide-react";
import { getModule, modules } from "@/data/curriculum";
import { useProgress } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";
import { colors } from "@/lib/constants";
import type { ChapterType } from "@/types/curriculum";
function getIcon(name: string) {
  const icon = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name];
  return icon || Icons.BookOpen;
}

const typeLabels: Record<ChapterType, string> = {
  concept: "개념",
  demo: "데모",
  "hands-on": "실습",
  workshop: "워크숍",
};

export default function ModuleContent({ moduleId }: { moduleId: string }) {
  const mod = getModule(moduleId);
  const { progress } = useProgress();

  if (!mod) {
    return (
      <div className="p-8 text-[var(--text-secondary)]">
        모듈을 찾을 수 없습니다.
      </div>
    );
  }

  const Icon = getIcon(mod.icon);
  const moduleIndex = modules.findIndex((m) => m.id === moduleId) + 1;

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Module Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
            <Icon className="w-6 h-6 text-[var(--accent)]" />
          </div>
          <div>
            <p className="text-sm text-[var(--text-muted)]">
              Module {moduleIndex}
            </p>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">
              {mod.title}
            </h1>
          </div>
        </div>
        <p className="text-[var(--text-secondary)] mb-2">{mod.description}</p>
        <p className="text-sm text-[var(--text-muted)]">
          예상 소요 시간: {mod.estimatedMinutes}분
        </p>
      </div>

      {/* Chapter Cards */}
      <div className="space-y-3">
        {mod.chapters.map((ch) => {
          const isCompleted = progress[ch.id]?.completed;
          const typeColor =
            colors.chapterType[ch.type as keyof typeof colors.chapterType];

          return (
            <Link
              key={ch.id}
              href={`/module/${mod.id}/${ch.id}`}
              className={cn(
                "flex items-center h-20 px-5 rounded-lg border transition-all duration-150",
                "bg-[var(--surface)] border-[var(--border-color)]",
                "hover:border-[var(--accent)]/30"
              )}
            >
              {/* Number Badge */}
              <div className="w-7 h-7 rounded-full bg-[var(--surface-elevated)] flex items-center justify-center text-sm font-medium text-[var(--text-secondary)] mr-4 shrink-0">
                {ch.order}
              </div>

              {/* Title & Type */}
              <div className="flex-1 min-w-0">
                <h3 className="text-[var(--text-primary)] font-medium truncate">
                  {ch.title}
                </h3>
                <span
                  className="inline-block text-xs px-2 py-0.5 rounded-full mt-1"
                  style={{
                    backgroundColor: `${typeColor}20`,
                    color: typeColor,
                  }}
                >
                  {typeLabels[ch.type]}
                </span>
              </div>

              {/* Duration & Check */}
              <div className="flex items-center gap-3 shrink-0 ml-4">
                <span className="text-sm text-[var(--text-muted)]">
                  {ch.estimatedMinutes}분
                </span>
                {isCompleted && (
                  <Icons.CheckCircle2 className="w-5 h-5 text-green-500" />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
