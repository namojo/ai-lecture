"use client";

import { useState, useCallback, useMemo } from "react";
import { FileText, Upload, Play, AlertCircle, AlertTriangle, Info, Skull } from "lucide-react";
import { analyzeLog } from "./logParser";
import LogViewer from "./LogViewer";
import LogChart from "./LogChart";
import AnomalyReport from "./AnomalyReport";
import type { AnalysisResult, Severity } from "@/types/log";
import { cn } from "@/lib/utils";

const SAMPLE_FILES = [
  { name: "시스템 로그 (syslog)", path: "/sample-data/logs/syslog-sample.log" },
  { name: "애플리케이션 에러 로그", path: "/sample-data/logs/app-error.log" },
  { name: "접근 로그 (access log)", path: "/sample-data/logs/access-log.log" },
];

type TabId = "summary" | "timeline" | "logs";

const severityConfig: Record<Severity, { icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; color: string; label: string }> = {
  INFO: { icon: Info, color: "#3B82F6", label: "INFO" },
  WARN: { icon: AlertTriangle, color: "#F59E0B", label: "WARN" },
  ERROR: { icon: AlertCircle, color: "#EF4444", label: "ERROR" },
  FATAL: { icon: Skull, color: "#DC2626", label: "FATAL" },
};

export default function LogAnalyzer() {
  const [selectedFile, setSelectedFile] = useState(SAMPLE_FILES[0].path);
  const [rawText, setRawText] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("summary");

  const loadAndAnalyze = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await fetch(selectedFile);
      const text = await resp.text();
      setRawText(text);
      const analysis = analyzeLog(text);
      setResult(analysis);
      setActiveTab("summary");
    } catch (err) {
      console.error("Failed to load log:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedFile]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setRawText(text);
      const analysis = analyzeLog(text);
      setResult(analysis);
      setActiveTab("summary");
      setLoading(false);
    };
    reader.readAsText(file);
  }, []);

  const anomalyLineSet = useMemo(() => {
    if (!result) return new Set<number>();
    return new Set(result.anomalies.flatMap((a) => a.affectedLines));
  }, [result]);

  const tabs: { id: TabId; label: string }[] = [
    { id: "summary", label: "요약" },
    { id: "timeline", label: "타임라인" },
    { id: "logs", label: "원본 로그" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-[var(--border-color)]">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
          서버 로그 분석기
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          로그 파일을 선택하거나 업로드하여 자동 분석합니다.
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 p-4 border-b border-[var(--border-color)]">
        <FileText className="w-4 h-4 text-[var(--text-muted)]" />
        <select
          value={selectedFile}
          onChange={(e) => setSelectedFile(e.target.value)}
          className="flex-1 max-w-xs px-3 py-1.5 text-sm rounded-md bg-[var(--surface)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
        >
          {SAMPLE_FILES.map((f) => (
            <option key={f.path} value={f.path}>
              {f.name}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--surface)] cursor-pointer transition-colors">
          <Upload className="w-4 h-4" />
          업로드
          <input type="file" accept=".log,.txt" onChange={handleFileUpload} className="hidden" />
        </label>

        <button
          onClick={loadAndAnalyze}
          disabled={loading}
          className={cn(
            "flex items-center gap-1.5 px-4 py-1.5 text-sm rounded-md font-medium transition-colors",
            "bg-[var(--accent)] text-white hover:opacity-90",
            loading && "opacity-50 cursor-not-allowed"
          )}
        >
          <Play className="w-4 h-4" />
          {loading ? "분석 중..." : "분석 시작"}
        </button>
      </div>

      {/* Results */}
      {result && (
        <>
          {/* Tabs */}
          <div className="flex border-b border-[var(--border-color)]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors",
                  tab.id === activeTab
                    ? "border-[var(--accent)] text-[var(--accent)]"
                    : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-auto">
            {activeTab === "summary" && (
              <div className="p-6 space-y-6">
                {/* Stat Cards */}
                <div className="grid grid-cols-4 gap-4">
                  {(Object.keys(severityConfig) as Severity[]).map((sev) => {
                    const { icon: Icon, color, label } = severityConfig[sev];
                    return (
                      <div
                        key={sev}
                        className="p-4 rounded-lg border border-[var(--border-color)] bg-[var(--surface)]"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="w-4 h-4" style={{ color }} />
                          <span className="text-xs text-[var(--text-muted)]">{label}</span>
                        </div>
                        <p className="text-2xl font-bold" style={{ color }}>
                          {result.summary.byLevel[sev]}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Top Errors */}
                {result.summary.topErrors.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
                      Top 에러 메시지
                    </h3>
                    <div className="space-y-2">
                      {result.summary.topErrors.map((e, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-3 rounded-md bg-[var(--surface)] border border-[var(--border-color)]"
                        >
                          <span className="text-sm font-bold text-red-400 w-8 text-center">
                            {e.count}
                          </span>
                          <span className="text-sm text-[var(--text-primary)] truncate">
                            {e.message}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Anomalies */}
                <AnomalyReport anomalies={result.anomalies} />
              </div>
            )}

            {activeTab === "timeline" && (
              <div className="p-6">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
                  에러 발생 빈도 (분 단위)
                </h3>
                <LogChart data={result.summary.errorRate} />
              </div>
            )}

            {activeTab === "logs" && (
              <LogViewer entries={result.entries} anomalyLines={anomalyLineSet} />
            )}
          </div>
        </>
      )}

      {/* Empty state */}
      {!result && !loading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-[var(--text-muted)]">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>로그 파일을 선택하고 &quot;분석 시작&quot;을 클릭하세요.</p>
          </div>
        </div>
      )}
    </div>
  );
}
