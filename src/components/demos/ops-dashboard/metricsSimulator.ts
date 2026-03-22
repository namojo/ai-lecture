import type { MetricName, MetricPoint, Alert, ServiceStatus, DashboardState, AlertSeverity } from "@/types/metrics";

// Seeded PRNG for deterministic simulation
class SeededRNG {
  private seed: number;
  constructor(seed: number) {
    this.seed = seed;
  }
  next(): number {
    this.seed = (this.seed * 16807 + 0) % 2147483647;
    return this.seed / 2147483647;
  }
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
}

const THRESHOLDS: Record<MetricName, { warning: number; critical: number }> = {
  cpu: { warning: 60, critical: 80 },
  memory: { warning: 70, critical: 85 },
  disk: { warning: 80, critical: 90 },
  network: { warning: 60, critical: 80 },
};

const SERVICES: { name: string; baseUptime: number }[] = [
  { name: "API Gateway", baseUptime: 99.9 },
  { name: "주문 서비스", baseUptime: 99.5 },
  { name: "결제 서비스", baseUptime: 99.7 },
  { name: "재고 서비스", baseUptime: 98.8 },
  { name: "알림 서비스", baseUptime: 99.2 },
  { name: "캐시 서버", baseUptime: 99.8 },
];

const MAX_HISTORY = 300; // 5 minutes at 1s interval

export function createSimulator(seed = 42) {
  const rng = new SeededRNG(seed);
  let tick = 0;
  let alertId = 0;

  // Base values with realistic patterns
  const base: Record<MetricName, number> = {
    cpu: 30,
    memory: 55,
    disk: 72,
    network: 25,
  };

  const state: DashboardState = {
    metrics: { cpu: [], memory: [], disk: [], network: [] },
    current: { cpu: 30, memory: 55, disk: 72, network: 25 },
    alerts: [],
    services: SERVICES.map((s) => ({
      name: s.name,
      status: "healthy",
      uptime: s.baseUptime,
      lastChecked: new Date(),
    })),
  };

  function generateMetric(name: MetricName): number {
    const t = tick;
    let value = base[name];

    switch (name) {
      case "cpu": {
        // Periodic batch spikes every ~30s
        const batchPhase = Math.sin((t / 30) * Math.PI * 2);
        if (batchPhase > 0.8) value += rng.range(30, 55);
        // Random noise
        value += rng.range(-5, 8);
        // Occasional GC drops
        if (rng.next() < 0.02) value = rng.range(10, 20);
        break;
      }
      case "memory": {
        // Gradual increase (memory leak simulation)
        value += (t % 120) * 0.15;
        // Periodic GC drops
        if (t % 120 < 3) value = base.memory - rng.range(5, 15);
        value += rng.range(-2, 3);
        break;
      }
      case "disk": {
        // Slow growth
        value += Math.floor(t / 60) * 0.3;
        // Log rotation drops every ~90s
        if (t % 90 < 2) value -= rng.range(2, 5);
        value += rng.range(-0.5, 0.5);
        break;
      }
      case "network": {
        // Random bursts
        if (rng.next() < 0.1) value += rng.range(20, 50);
        // Traffic peak pattern
        const hourPhase = Math.sin((t / 180) * Math.PI * 2);
        value += hourPhase * 15;
        value += rng.range(-3, 5);
        break;
      }
    }

    return Math.max(0, Math.min(100, value));
  }

  function checkAlerts(name: MetricName, value: number) {
    const { warning, critical } = THRESHOLDS[name];
    const labels: Record<MetricName, string> = {
      cpu: "CPU 사용률",
      memory: "메모리 사용률",
      disk: "디스크 사용률",
      network: "네트워크 사용률",
    };

    if (value >= critical) {
      // Don't duplicate recent same-metric critical alerts
      const recent = state.alerts.find(
        (a) => a.service === labels[name] && a.severity === "critical" && !a.resolved
      );
      if (!recent) {
        state.alerts.unshift({
          id: `alert-${++alertId}`,
          timestamp: new Date(),
          severity: "critical",
          service: labels[name],
          message: `${labels[name]}이 임계값 초과: ${value.toFixed(1)}% (임계: ${critical}%)`,
          resolved: false,
        });
      }
    } else if (value >= warning) {
      const recent = state.alerts.find(
        (a) => a.service === labels[name] && a.severity === "warning" && !a.resolved
      );
      if (!recent) {
        state.alerts.unshift({
          id: `alert-${++alertId}`,
          timestamp: new Date(),
          severity: "warning",
          service: labels[name],
          message: `${labels[name]} 경고: ${value.toFixed(1)}% (경고: ${warning}%)`,
          resolved: false,
        });
      }
    } else {
      // Auto-resolve old alerts for this metric
      for (const a of state.alerts) {
        if (a.service === labels[name] && !a.resolved) {
          a.resolved = true;
        }
      }
    }
  }

  function updateServices() {
    const now = new Date();
    for (const svc of state.services) {
      svc.lastChecked = now;
      // Randomly degrade based on high metrics
      if (state.current.cpu > 80 && svc.name === "API Gateway" && rng.next() < 0.3) {
        svc.status = "degraded";
        svc.uptime = Math.max(95, svc.uptime - rng.range(0.1, 0.5));
      } else if (state.current.memory > 85 && svc.name === "캐시 서버" && rng.next() < 0.2) {
        svc.status = "down";
        svc.uptime = Math.max(90, svc.uptime - rng.range(0.5, 2));
      } else {
        // Recovery
        if (svc.status !== "healthy" && rng.next() < 0.1) {
          svc.status = "healthy";
        }
      }
    }
  }

  function step(): DashboardState {
    tick++;
    const now = new Date();

    for (const name of ["cpu", "memory", "disk", "network"] as MetricName[]) {
      const value = generateMetric(name);
      state.current[name] = value;

      const point: MetricPoint = { timestamp: now, name, value, unit: "%" };
      state.metrics[name].push(point);
      if (state.metrics[name].length > MAX_HISTORY) {
        state.metrics[name].shift();
      }

      checkAlerts(name, value);
    }

    // Keep max 50 alerts
    if (state.alerts.length > 50) {
      state.alerts = state.alerts.slice(0, 50);
    }

    // Update services every 5 ticks
    if (tick % 5 === 0) updateServices();

    return { ...state };
  }

  function resolveAlert(id: string) {
    const alert = state.alerts.find((a) => a.id === id);
    if (alert) alert.resolved = true;
  }

  return { step, resolveAlert, getState: () => ({ ...state }) };
}
