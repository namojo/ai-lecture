"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import type { MetricName, MetricPoint } from "@/types/metrics";

const COLORS: Record<MetricName, string> = {
  cpu: "#00B4D8",
  memory: "#8B5CF6",
  disk: "#F59E0B",
  network: "#22C55E",
};

const THRESHOLDS: Record<MetricName, { warning: number; critical: number }> = {
  cpu: { warning: 60, critical: 80 },
  memory: { warning: 70, critical: 85 },
  disk: { warning: 80, critical: 90 },
  network: { warning: 60, critical: 80 },
};

const LABELS: Record<MetricName, string> = {
  cpu: "CPU 사용률",
  memory: "메모리 사용률",
  disk: "디스크 사용률",
  network: "네트워크 사용률",
};

interface TimeSeriesChartProps {
  name: MetricName;
  data: MetricPoint[];
}

export default function TimeSeriesChart({ name, data }: TimeSeriesChartProps) {
  const color = COLORS[name];
  const { warning, critical } = THRESHOLDS[name];

  const chartData = data.map((p, i) => ({
    idx: i,
    value: p.value,
    time: p.timestamp.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
  }));

  return (
    <div className="p-4 rounded-lg border border-[var(--border-color)] bg-[var(--surface)]">
      <h4 className="text-sm font-medium text-[var(--text-primary)] mb-3">
        {LABELS[name]}
      </h4>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id={`ts-grad-${name}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1B2838" />
            <XAxis
              dataKey="time"
              tick={{ fill: "#64748B", fontSize: 10 }}
              axisLine={{ stroke: "#1B2838" }}
              interval="preserveStartEnd"
              minTickGap={50}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "#64748B", fontSize: 10 }}
              axisLine={{ stroke: "#1B2838" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111D2C",
                border: "1px solid #1B2838",
                borderRadius: "8px",
                color: "#E0E1DD",
                fontSize: "12px",
              }}
              formatter={(value) => [`${Number(value).toFixed(1)}%`, LABELS[name]]}
            />
            <ReferenceLine y={warning} stroke="#F59E0B" strokeDasharray="5 5" />
            <ReferenceLine y={critical} stroke="#EF4444" strokeDasharray="5 5" />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fill={`url(#ts-grad-${name})`}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
