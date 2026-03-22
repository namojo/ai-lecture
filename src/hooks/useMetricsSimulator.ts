"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createSimulator } from "@/components/demos/ops-dashboard/metricsSimulator";
import type { DashboardState } from "@/types/metrics";

export type SimSpeed = 1 | 2 | 5;

export function useMetricsSimulator() {
  const simRef = useRef(createSimulator(42));
  const [state, setState] = useState<DashboardState | null>(null);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState<SimSpeed>(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tick = useCallback(() => {
    const next = simRef.current.step();
    setState({ ...next });
  }, []);

  useEffect(() => {
    // Initial ticks to populate some history
    for (let i = 0; i < 30; i++) simRef.current.step();
    setState({ ...simRef.current.getState() });
  }, []);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (playing) {
      intervalRef.current = setInterval(tick, 1000 / speed);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, speed, tick]);

  const togglePlay = useCallback(() => setPlaying((p) => !p), []);

  const resolveAlert = useCallback((id: string) => {
    simRef.current.resolveAlert(id);
    setState({ ...simRef.current.getState() });
  }, []);

  return { state, playing, speed, togglePlay, setSpeed, resolveAlert };
}
