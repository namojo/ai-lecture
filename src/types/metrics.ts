export type MetricName = "cpu" | "memory" | "disk" | "network";

export interface MetricPoint {
  timestamp: Date;
  name: MetricName;
  value: number;
  unit: string;
}

export type AlertSeverity = "info" | "warning" | "critical";

export interface Alert {
  id: string;
  timestamp: Date;
  severity: AlertSeverity;
  service: string;
  message: string;
  resolved: boolean;
}

export type ServiceHealthStatus = "healthy" | "degraded" | "down";

export interface ServiceStatus {
  name: string;
  status: ServiceHealthStatus;
  uptime: number;
  lastChecked: Date;
}

export interface DashboardState {
  metrics: Record<MetricName, MetricPoint[]>;
  current: Record<MetricName, number>;
  alerts: Alert[];
  services: ServiceStatus[];
}
