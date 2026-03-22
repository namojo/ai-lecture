"use client";

import type { ServiceStatus, ServiceHealthStatus } from "@/types/metrics";
import { cn } from "@/lib/utils";

const statusConfig: Record<ServiceHealthStatus, { label: string; color: string; pulse: boolean }> = {
  healthy: { label: "정상", color: "#22C55E", pulse: false },
  degraded: { label: "저하", color: "#F59E0B", pulse: true },
  down: { label: "중단", color: "#EF4444", pulse: true },
};

interface SystemStatusProps {
  services: ServiceStatus[];
}

export default function SystemStatus({ services }: SystemStatusProps) {
  return (
    <div className="p-4 rounded-lg border border-[var(--border-color)] bg-[var(--surface)]">
      <h4 className="text-sm font-medium text-[var(--text-primary)] mb-3">
        서비스 상태
      </h4>

      <div className="grid grid-cols-2 gap-2">
        {services.map((svc) => {
          const { label, color, pulse } = statusConfig[svc.status];
          return (
            <div
              key={svc.name}
              className="flex items-center justify-between p-2.5 rounded-md bg-[var(--surface-elevated)]"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="relative">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  {pulse && (
                    <div
                      className="absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping opacity-75"
                      style={{ backgroundColor: color }}
                    />
                  )}
                </div>
                <span className="text-xs text-[var(--text-primary)] truncate">
                  {svc.name}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] text-[var(--text-muted)]">
                  {svc.uptime.toFixed(1)}%
                </span>
                <span className="text-[10px] font-medium" style={{ color }}>
                  {label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
