"use client";

import { AlertTriangle, TrendingUp, Clock } from "lucide-react";
import type { Anomaly, AnomalyType } from "@/types/log";
import { cn } from "@/lib/utils";

const typeIcons: Record<AnomalyType, React.ComponentType<{ className?: string }>> = {
  spike: TrendingUp,
  repeated_pattern: AlertTriangle,
  time_gap: Clock,
};

const typeLabels: Record<AnomalyType, string> = {
  spike: "에러 급증",
  repeated_pattern: "반복 패턴",
  time_gap: "로그 공백",
};

const severityStyles: Record<string, string> = {
  critical: "bg-red-500/20 text-red-400 border-red-500/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

interface AnomalyReportProps {
  anomalies: Anomaly[];
}

export default function AnomalyReport({ anomalies }: AnomalyReportProps) {
  if (anomalies.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-[var(--text-muted)]">
        이상 징후가 감지되지 않았습니다.
      </div>
    );
  }

  const sorted = [...anomalies].sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    return (order[a.severity] ?? 4) - (order[b.severity] ?? 4);
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
          감지된 이상 징후
        </h3>
        <span className="text-xs text-[var(--text-muted)]">
          {anomalies.length}건
        </span>
      </div>

      {sorted.map((anomaly) => {
        const Icon = typeIcons[anomaly.type];
        return (
          <div
            key={anomaly.id}
            className={cn(
              "p-4 rounded-lg border",
              severityStyles[anomaly.severity]
            )}
          >
            <div className="flex items-start gap-3">
              <Icon className="w-5 h-5 mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-black/20">
                    {typeLabels[anomaly.type]}
                  </span>
                  <span className="text-xs uppercase font-semibold">
                    {anomaly.severity}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">
                  {anomaly.description}
                </p>
                <p className="text-xs mt-2 opacity-70">
                  영향 라인: {anomaly.affectedLines.slice(0, 5).join(", ")}
                  {anomaly.affectedLines.length > 5 && ` 외 ${anomaly.affectedLines.length - 5}건`}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
