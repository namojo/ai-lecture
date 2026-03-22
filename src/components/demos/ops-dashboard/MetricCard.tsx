"use client";

import { Cpu, MemoryStick, HardDrive, Wifi } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import type { MetricName, MetricPoint } from "@/types/metrics";
import { cn } from "@/lib/utils";

const metricConfig: Record<MetricName, {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = {
  cpu: { label: "CPU", icon: Cpu },
  memory: { label: "Memory", icon: MemoryStick },
  disk: { label: "Disk", icon: HardDrive },
  network: { label: "Network", icon: Wifi },
};

function getColor(value: number, warning: number, critical: number): string {
  if (value >= critical) return "#EF4444";
  if (value >= warning) return "#F59E0B";
  return "#22C55E";
}

const thresholds: Record<MetricName, { warning: number; critical: number }> = {
  cpu: { warning: 60, critical: 80 },
  memory: { warning: 70, critical: 85 },
  disk: { warning: 80, critical: 90 },
  network: { warning: 60, critical: 80 },
};

interface MetricCardProps {
  name: MetricName;
  value: number;
  history: MetricPoint[];
}

export default function MetricCard({ name, value, history }: MetricCardProps) {
  const { label, icon: Icon } = metricConfig[name];
  const { warning, critical } = thresholds[name];
  const color = getColor(value, warning, critical);

  // Last 60 points for sparkline
  const sparkData = history.slice(-60).map((p, i) => ({ i, v: p.value }));

  return (
    <div className="p-4 rounded-lg border border-[var(--border-color)] bg-[var(--surface)] h-[120px] flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-[var(--text-muted)]" />
          <span className="text-[13px] font-medium text-[var(--text-muted)]">{label}</span>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <span className="text-[32px] font-bold leading-none" style={{ color }}>
            {value.toFixed(1)}
          </span>
          <span className="text-sm text-[var(--text-muted)] ml-1">%</span>
        </div>

        {/* Sparkline */}
        <div className="w-20 h-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData}>
              <defs>
                <linearGradient id={`spark-${name}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={color}
                fill={`url(#spark-${name})`}
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
