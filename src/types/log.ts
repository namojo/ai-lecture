export type Severity = "INFO" | "WARN" | "ERROR" | "FATAL";

export interface LogEntry {
  timestamp: Date;
  severity: Severity;
  source: string;
  message: string;
  rawLine: string;
  lineNumber: number;
}

export type AnomalyType = "spike" | "repeated_pattern" | "time_gap";
export type AnomalySeverity = "low" | "medium" | "high" | "critical";

export interface Anomaly {
  id: string;
  type: AnomalyType;
  severity: AnomalySeverity;
  startTime: Date;
  endTime: Date;
  description: string;
  affectedLines: number[];
  count: number;
}

export interface AnalysisResult {
  entries: LogEntry[];
  anomalies: Anomaly[];
  summary: {
    total: number;
    byLevel: Record<Severity, number>;
    timeRange: { start: Date; end: Date } | null;
    topErrors: { message: string; count: number }[];
    errorRate: { minute: string; count: number }[];
  };
}
