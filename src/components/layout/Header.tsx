"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { modules } from "@/data/curriculum";
import { cn } from "@/lib/utils";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const activeModuleId = pathname.split("/")[2] || "module-01";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-4 border-b",
        "bg-[var(--bg-primary)] border-[var(--border-color)]"
      )}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mr-8 shrink-0">
        <BookOpen className="w-6 h-6 text-[var(--accent)]" />
        <span className="text-base font-semibold text-[var(--text-primary)]">
          AI Lecture
        </span>
      </Link>

      {/* Module Tabs */}
      <nav className="flex items-center gap-1 overflow-x-auto hide-scrollbar">
        {modules.map((mod, i) => {
          const isActive = activeModuleId === mod.id;
          return (
            <Link
              key={mod.id}
              href={`/module/${mod.id}`}
              className={cn(
                "px-3 py-2 text-sm whitespace-nowrap border-b-2 transition-colors duration-150",
                isActive
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              )}
            >
              Module {i + 1}
            </Link>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[var(--surface)] transition-colors"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <Sun className="w-5 h-5 text-[var(--text-secondary)]" />
        ) : (
          <Moon className="w-5 h-5 text-[var(--text-secondary)]" />
        )}
      </button>
    </header>
  );
}
