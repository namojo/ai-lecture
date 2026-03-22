"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, CheckCircle2 } from "lucide-react";
import * as Icons from "lucide-react";
import { modules } from "@/data/curriculum";
import { useProgress } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";
function getIcon(name: string) {
  const icon = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name];
  return icon || Icons.BookOpen;
}

export default function Sidebar() {
  const pathname = usePathname();
  const { progress, completionPercent } = useProgress();
  const activeModuleId = pathname.split("/")[2] || "";
  const activeChapterId = pathname.split("/")[3] || "";

  const [openModules, setOpenModules] = useState<Set<string>>(
    new Set([activeModuleId || "module-01"])
  );

  const toggleModule = (id: string) => {
    setOpenModules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <aside
      className={cn(
        "h-full w-[280px] overflow-y-auto border-r",
        "bg-[var(--bg-secondary)] border-[var(--border-color)]"
      )}
    >
      <nav className="py-2">
        {modules.map((mod, mi) => {
          const Icon = getIcon(mod.icon);
          const isOpen = openModules.has(mod.id);

          return (
            <div key={mod.id}>
              {/* Module Header */}
              <button
                onClick={() => toggleModule(mod.id)}
                className={cn(
                  "w-full h-11 flex items-center gap-2 px-4 text-left",
                  "hover:bg-[var(--surface-elevated)]/50 transition-colors duration-150"
                )}
              >
                <Icon className="w-5 h-5 text-[var(--accent)] shrink-0" />
                <span className="text-sm font-medium text-[var(--text-primary)] truncate">
                  {mi + 1}. {mod.title}
                </span>
                <ChevronDown
                  className={cn(
                    "w-3 h-3 ml-auto text-[var(--text-muted)] transition-transform duration-200 shrink-0",
                    isOpen && "rotate-180"
                  )}
                />
              </button>

              {/* Chapter Links */}
              {isOpen && (
                <div className="pb-1">
                  {mod.chapters.map((ch) => {
                    const isActive =
                      activeModuleId === mod.id &&
                      activeChapterId === ch.id;
                    const isCompleted = progress[ch.id]?.completed;

                    return (
                      <Link
                        key={ch.id}
                        href={`/module/${mod.id}/${ch.id}`}
                        className={cn(
                          "flex items-center h-9 pl-12 pr-4 text-[13px] transition-colors duration-150",
                          isActive
                            ? "bg-[var(--surface-elevated)] text-[var(--accent)]"
                            : "text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)]/50"
                        )}
                      >
                        {isCompleted && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mr-2 shrink-0" />
                        )}
                        <span className="truncate">{ch.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--border-color)]">
        <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1">
          <span>학습 진도</span>
          <span>{completionPercent}%</span>
        </div>
        <div className="h-1 bg-[var(--surface)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--accent)] rounded-full transition-all duration-300"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>
    </aside>
  );
}
