"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface LogChartProps {
  data: { minute: string; count: number }[];
}

export default function LogChart({ data }: LogChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-[var(--text-muted)]">
        에러 데이터가 없습니다.
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="errorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1B2838" />
          <XAxis
            dataKey="minute"
            tick={{ fill: "#64748B", fontSize: 11 }}
            axisLine={{ stroke: "#1B2838" }}
          />
          <YAxis
            tick={{ fill: "#64748B", fontSize: 11 }}
            axisLine={{ stroke: "#1B2838" }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#111D2C",
              border: "1px solid #1B2838",
              borderRadius: "8px",
              color: "#E0E1DD",
              fontSize: "12px",
            }}
            labelFormatter={(label) => `시각: ${label}`}
            formatter={(value) => [`${value}건`, "에러 수"]}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#EF4444"
            fill="url(#errorGradient)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
