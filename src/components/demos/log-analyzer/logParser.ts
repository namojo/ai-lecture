import type { LogEntry, Severity, Anomaly, AnalysisResult, AnomalySeverity } from "@/types/log";

// Syslog: "Mar 15 08:00:01 hostname service[pid]: message"
const SYSLOG_RE = /^(\w{3}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2})\s+(\S+)\s+(\S+?)(?:\[\d+\])?:\s+(.*)$/;

// App log: "2025-03-15 08:00:01.123 [LEVEL] [source] message"
const APP_LOG_RE = /^(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\.\d{3})\s+\[(\w+)\]\s+\[([^\]]+)\]\s+(.*)$/;

// Access log: 'IP - - [DD/MMM/YYYY:HH:MM:SS +0000] "METHOD PATH" STATUS SIZE'
const ACCESS_RE = /^(\S+)\s+-\s+-\s+\[([^\]]+)\]\s+"(\S+)\s+(\S+)\s+\S+"\s+(\d{3})\s+(\d+)$/;

function parseSeverityFromMessage(msg: string): Severity {
  const upper = msg.toUpperCase();
  if (upper.startsWith("FATAL")) return "FATAL";
  if (upper.startsWith("ERROR")) return "ERROR";
  if (upper.startsWith("WARN")) return "WARN";
  return "INFO";
}

function parseAccessSeverity(status: number): Severity {
  if (status >= 500) return "ERROR";
  if (status >= 400) return "WARN";
  return "INFO";
}

function parseDateString(dateStr: string): Date {
  // Try ISO-like: "2025-03-15 08:00:01.123"
  const isoDate = new Date(dateStr.replace(" ", "T"));
  if (!isNaN(isoDate.getTime())) return isoDate;

  // Try syslog: "Mar 15 08:00:01" (assume current year)
  const sysDate = new Date(`${dateStr} 2025`);
  if (!isNaN(sysDate.getTime())) return sysDate;

  // Try access log: "15/Mar/2025:08:00:01 +0900"
  const accessMatch = dateStr.match(/(\d{2})\/(\w{3})\/(\d{4}):(\d{2}:\d{2}:\d{2})/);
  if (accessMatch) {
    const [, day, mon, year, time] = accessMatch;
    return new Date(`${mon} ${day}, ${year} ${time}`);
  }

  return new Date();
}

export function parseLine(line: string, lineNumber: number): LogEntry | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  // Try App log format
  let match = APP_LOG_RE.exec(trimmed);
  if (match) {
    return {
      timestamp: parseDateString(match[1]),
      severity: (match[2].toUpperCase() as Severity) || "INFO",
      source: match[3],
      message: match[4],
      rawLine: trimmed,
      lineNumber,
    };
  }

  // Try Syslog format
  match = SYSLOG_RE.exec(trimmed);
  if (match) {
    const severity = parseSeverityFromMessage(match[4]);
    return {
      timestamp: parseDateString(match[1]),
      severity,
      source: match[3],
      message: match[4],
      rawLine: trimmed,
      lineNumber,
    };
  }

  // Try Access log format
  match = ACCESS_RE.exec(trimmed);
  if (match) {
    const status = parseInt(match[5], 10);
    return {
      timestamp: parseDateString(match[2]),
      severity: parseAccessSeverity(status),
      source: match[1],
      message: `${match[3]} ${match[4]} → ${match[5]} (${match[6]} bytes)`,
      rawLine: trimmed,
      lineNumber,
    };
  }

  // Fallback: treat as continuation or unknown
  return {
    timestamp: new Date(),
    severity: "INFO",
    source: "unknown",
    message: trimmed,
    rawLine: trimmed,
    lineNumber,
  };
}

export function parseLog(text: string): LogEntry[] {
  const lines = text.split("\n");
  const entries: LogEntry[] = [];
  for (let i = 0; i < lines.length; i++) {
    const entry = parseLine(lines[i], i + 1);
    if (entry) entries.push(entry);
  }
  return entries;
}

function detectAnomalies(entries: LogEntry[]): Anomaly[] {
  const anomalies: Anomaly[] = [];
  let anomalyId = 0;

  // 1. Error spike detection: group errors by minute, find spikes
  const errorsByMinute = new Map<string, LogEntry[]>();
  for (const e of entries) {
    if (e.severity === "ERROR" || e.severity === "FATAL") {
      const key = `${e.timestamp.getHours()}:${String(e.timestamp.getMinutes()).padStart(2, "0")}`;
      if (!errorsByMinute.has(key)) errorsByMinute.set(key, []);
      errorsByMinute.get(key)!.push(e);
    }
  }

  const counts = Array.from(errorsByMinute.values()).map((v) => v.length);
  const avg = counts.length > 0 ? counts.reduce((a, b) => a + b, 0) / counts.length : 0;
  const stddev = counts.length > 1
    ? Math.sqrt(counts.reduce((sum, c) => sum + Math.pow(c - avg, 2), 0) / counts.length)
    : 0;
  const threshold = avg + 2 * stddev;

  for (const [minute, errs] of errorsByMinute) {
    if (errs.length > threshold && errs.length > 1) {
      const severity: AnomalySeverity = errs.length > avg + 3 * stddev ? "critical" : "high";
      anomalies.push({
        id: `anomaly-${++anomalyId}`,
        type: "spike",
        severity,
        startTime: errs[0].timestamp,
        endTime: errs[errs.length - 1].timestamp,
        description: `${minute}에 에러 급증 감지: ${errs.length}건 (평균 ${avg.toFixed(1)}건)`,
        affectedLines: errs.map((e) => e.lineNumber),
        count: errs.length,
      });
    }
  }

  // 2. Repeated pattern detection: same error message appearing multiple times
  const errorMessages = new Map<string, LogEntry[]>();
  for (const e of entries) {
    if (e.severity === "ERROR" || e.severity === "FATAL") {
      // Normalize message (remove numbers/IDs)
      const normalized = e.message.replace(/\d+/g, "N").replace(/#\w+/g, "#ID");
      if (!errorMessages.has(normalized)) errorMessages.set(normalized, []);
      errorMessages.get(normalized)!.push(e);
    }
  }

  for (const [pattern, errs] of errorMessages) {
    if (errs.length >= 3) {
      anomalies.push({
        id: `anomaly-${++anomalyId}`,
        type: "repeated_pattern",
        severity: errs.length >= 5 ? "high" : "medium",
        startTime: errs[0].timestamp,
        endTime: errs[errs.length - 1].timestamp,
        description: `반복 에러 패턴 감지: "${errs[0].message.substring(0, 60)}..." (${errs.length}회)`,
        affectedLines: errs.map((e) => e.lineNumber),
        count: errs.length,
      });
    }
  }

  // 3. Time gap detection: silence > 2 minutes (possible service down)
  for (let i = 1; i < entries.length; i++) {
    const gap = entries[i].timestamp.getTime() - entries[i - 1].timestamp.getTime();
    if (gap > 2 * 60 * 1000) {
      anomalies.push({
        id: `anomaly-${++anomalyId}`,
        type: "time_gap",
        severity: gap > 5 * 60 * 1000 ? "high" : "low",
        startTime: entries[i - 1].timestamp,
        endTime: entries[i].timestamp,
        description: `${Math.round(gap / 1000)}초간 로그 공백 감지 (서비스 중단 의심)`,
        affectedLines: [entries[i - 1].lineNumber, entries[i].lineNumber],
        count: 1,
      });
    }
  }

  return anomalies;
}

export function analyzeLog(text: string): AnalysisResult {
  const entries = parseLog(text);
  const anomalies = detectAnomalies(entries);

  // Summary
  const byLevel: Record<Severity, number> = { INFO: 0, WARN: 0, ERROR: 0, FATAL: 0 };
  for (const e of entries) byLevel[e.severity]++;

  // Time range
  const timestamps = entries.map((e) => e.timestamp.getTime()).filter((t) => !isNaN(t));
  const timeRange = timestamps.length > 0
    ? { start: new Date(Math.min(...timestamps)), end: new Date(Math.max(...timestamps)) }
    : null;

  // Top errors
  const errorCounts = new Map<string, number>();
  for (const e of entries) {
    if (e.severity === "ERROR" || e.severity === "FATAL") {
      const key = e.message.substring(0, 80);
      errorCounts.set(key, (errorCounts.get(key) || 0) + 1);
    }
  }
  const topErrors = Array.from(errorCounts.entries())
    .map(([message, count]) => ({ message, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Error rate by minute
  const rateMap = new Map<string, number>();
  for (const e of entries) {
    if (e.severity === "ERROR" || e.severity === "FATAL") {
      const key = `${String(e.timestamp.getHours()).padStart(2, "0")}:${String(e.timestamp.getMinutes()).padStart(2, "0")}`;
      rateMap.set(key, (rateMap.get(key) || 0) + 1);
    }
  }
  const errorRate = Array.from(rateMap.entries())
    .map(([minute, count]) => ({ minute, count }))
    .sort((a, b) => a.minute.localeCompare(b.minute));

  return {
    entries,
    anomalies,
    summary: { total: entries.length, byLevel, timeRange, topErrors, errorRate },
  };
}
