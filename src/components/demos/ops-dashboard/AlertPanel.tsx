"use client";

import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import type { Alert, AlertSeverity } from "@/types/metrics";
import { cn } from "@/lib/utils";

const severityConfig: Record<AlertSeverity, { icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; color: string }> = {
  critical: { icon: AlertCircle, color: "#EF4444" },
  warning: { icon: AlertTriangle, color: "#F59E0B" },
  info: { icon: Info, color: "#3B82F6" },
};

interface AlertPanelProps {
  alerts: Alert[];
  onResolve: (id: string) => void;
}

export default function AlertPanel({ alerts, onResolve }: AlertPanelProps) {
  const activeAlerts = alerts.filter((a) => !a.resolved);
  const resolvedAlerts = alerts.filter((a) => a.resolved).slice(0, 5);

  return (
    <div className="p-4 rounded-lg border border-[var(--border-color)] bg-[var(--surface)]">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-[var(--text-primary)]">알림</h4>
        <span className="text-xs text-[var(--text-muted)]">
          활성 {activeAlerts.length}건
        </span>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {activeAlerts.length === 0 && resolvedAlerts.length === 0 && (
          <p className="text-sm text-[var(--text-muted)] text-center py-4">
            알림이 없습니다.
          </p>
        )}

        {activeAlerts.map((alert) => {
          const { icon: Icon, color } = severityConfig[alert.severity];
          return (
            <div
              key={alert.id}
              className="flex items-start gap-3 p-3 rounded-md bg-[var(--surface-elevated)] animate-[slideIn_300ms_ease-out]"
            >
              <Icon className="w-4 h-4 mt-0.5 shrink-0" style={{ color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold" style={{ color }}>
                    {alert.service}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    {alert.timestamp.toLocaleTimeString("ko-KR")}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5 truncate">
                  {alert.message}
                </p>
              </div>
              <button
                onClick={() => onResolve(alert.id)}
                className="text-xs px-2 py-1 rounded bg-[var(--accent)]/20 text-[var(--accent)] hover:bg-[var(--accent)]/30 transition-colors shrink-0"
              >
                해제
              </button>
            </div>
          );
        })}

        {resolvedAlerts.length > 0 && (
          <>
            <div className="text-xs text-[var(--text-muted)] mt-3 mb-1">해제됨</div>
            {resolvedAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-3 p-3 rounded-md opacity-50"
              >
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-green-500" />
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-[var(--text-muted)]">
                    {alert.service}
                  </span>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate line-through">
                    {alert.message}
                  </p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
