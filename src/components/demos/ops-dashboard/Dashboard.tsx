"use client";

import { Play, Pause } from "lucide-react";
import { useMetricsSimulator, type SimSpeed } from "@/hooks/useMetricsSimulator";
import MetricCard from "./MetricCard";
import TimeSeriesChart from "./TimeSeriesChart";
import AlertPanel from "./AlertPanel";
import SystemStatus from "./SystemStatus";
import type { MetricName } from "@/types/metrics";
import { cn } from "@/lib/utils";

const METRIC_NAMES: MetricName[] = ["cpu", "memory", "disk", "network"];
const SPEEDS: SimSpeed[] = [1, 2, 5];

export default function Dashboard() {
  const { state, playing, speed, togglePlay, setSpeed, resolveAlert } = useMetricsSimulator();

  if (!state) {
    return (
      <div className="flex items-center justify-center h-64 text-[var(--text-muted)]">
        시뮬레이터 초기화 중...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
            운영 대시보드
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            실시간 서버 메트릭 모니터링 시뮬레이션
          </p>
        </div>

        {/* Simulation Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-[var(--surface)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-colors"
          >
            {playing ? (
              <><Pause className="w-4 h-4" /> 일시정지</>
            ) : (
              <><Play className="w-4 h-4" /> 재생</>
            )}
          </button>
          <div className="flex items-center gap-1">
            {SPEEDS.map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={cn(
                  "px-2.5 py-1 text-xs rounded-md font-medium transition-colors",
                  speed === s
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                )}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-4 gap-4">
          {METRIC_NAMES.map((name) => (
            <MetricCard
              key={name}
              name={name}
              value={state.current[name]}
              history={state.metrics[name]}
            />
          ))}
        </div>

        {/* Time Series Charts */}
        <div className="grid grid-cols-2 gap-4">
          {METRIC_NAMES.map((name) => (
            <TimeSeriesChart
              key={name}
              name={name}
              data={state.metrics[name]}
            />
          ))}
        </div>

        {/* Bottom row: Alerts + Service Status */}
        <div className="grid grid-cols-2 gap-4">
          <AlertPanel alerts={state.alerts} onResolve={resolveAlert} />
          <SystemStatus services={state.services} />
        </div>
      </div>
    </div>
  );
}
