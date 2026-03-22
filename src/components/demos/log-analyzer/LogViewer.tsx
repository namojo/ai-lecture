"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import type { LogEntry, Severity } from "@/types/log";
import { cn } from "@/lib/utils";

const severityColors: Record<Severity, string> = {
  INFO: "text-[var(--text-muted)]",
  WARN: "text-yellow-500",
  ERROR: "text-red-400",
  FATAL: "text-red-600 font-bold",
};

const ITEM_HEIGHT = 28;
const BUFFER_ITEMS = 20;

interface LogViewerProps {
  entries: LogEntry[];
  anomalyLines?: Set<number>;
}

export default function LogViewer({ entries, anomalyLines = new Set() }: LogViewerProps) {
  const [filter, setFilter] = useState("");
  const [severityFilter, setSeverityFilter] = useState<Severity | "ALL">("ALL");
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(500);

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (severityFilter !== "ALL" && e.severity !== severityFilter) return false;
      if (filter && !e.rawLine.toLowerCase().includes(filter.toLowerCase())) return false;
      return true;
    });
  }, [entries, filter, severityFilter]);

  const totalHeight = filtered.length * ITEM_HEIGHT;
  const startIdx = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - BUFFER_ITEMS);
  const endIdx = Math.min(
    filtered.length,
    Math.ceil((scrollTop + containerHeight) / ITEM_HEIGHT) + BUFFER_ITEMS
  );
  const visibleItems = filtered.slice(startIdx, endIdx);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setContainerHeight(el.clientHeight);
    const observer = new ResizeObserver((es) => {
      setContainerHeight(es[0].contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-3 p-3 border-b border-[var(--border-color)]">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="로그 검색..."
            className="w-full pl-9 pr-3 py-1.5 text-sm rounded-md bg-[var(--surface)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value as Severity | "ALL")}
          className="px-3 py-1.5 text-sm rounded-md bg-[var(--surface)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
        >
          <option value="ALL">전체</option>
          <option value="INFO">INFO</option>
          <option value="WARN">WARN</option>
          <option value="ERROR">ERROR</option>
          <option value="FATAL">FATAL</option>
        </select>
        <span className="text-xs text-[var(--text-muted)] shrink-0">
          {filtered.length.toLocaleString()} / {entries.length.toLocaleString()} 줄
        </span>
      </div>

      {/* Virtual scrolled log */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-auto font-mono text-xs bg-[#0C1222]"
        style={{ minHeight: 300 }}
      >
        <div style={{ height: totalHeight, position: "relative" }}>
          <div style={{ transform: `translateY(${startIdx * ITEM_HEIGHT}px)` }}>
            {visibleItems.map((entry) => (
              <div
                key={entry.lineNumber}
                className={cn(
                  "flex items-center h-7 px-2 hover:bg-[#1B2838]/50",
                  anomalyLines.has(entry.lineNumber) && "border-l-[3px] border-l-red-500 bg-red-500/5"
                )}
              >
                <span className="w-10 text-right pr-3 text-[#415A77] select-none shrink-0">
                  {entry.lineNumber}
                </span>
                <span className={cn("w-12 shrink-0 font-semibold", severityColors[entry.severity])}>
                  {entry.severity}
                </span>
                <span className="w-32 shrink-0 text-[#64748B] truncate">
                  {entry.source}
                </span>
                <span className="text-[#E0E1DD] truncate">{entry.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
