"use client";

import { Info, Lightbulb, AlertTriangle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type TipType = "info" | "tip" | "warning" | "danger";

interface TipBoxProps {
  type: TipType;
  title?: string;
  children: React.ReactNode;
}

const config: Record<
  TipType,
  { border: string; bg: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }
> = {
  info: { border: "#3B82F6", bg: "rgba(59,130,246,0.1)", icon: Info },
  tip: { border: "#22C55E", bg: "rgba(34,197,94,0.1)", icon: Lightbulb },
  warning: { border: "#F59E0B", bg: "rgba(245,158,11,0.1)", icon: AlertTriangle },
  danger: { border: "#EF4444", bg: "rgba(239,68,68,0.1)", icon: AlertCircle },
};

export default function TipBox({ type, title, children }: TipBoxProps) {
  const { border, bg, icon: Icon } = config[type];

  return (
    <div
      className={cn("rounded-lg px-5 py-4 my-4")}
      style={{
        borderLeft: `4px solid ${border}`,
        backgroundColor: bg,
      }}
    >
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 mt-0.5 shrink-0" style={{ color: border }} />
        <div className="min-w-0">
          {title && (
            <p
              className="font-semibold text-sm mb-1"
              style={{ color: border }}
            >
              {title}
            </p>
          )}
          <div className="text-sm text-[var(--text-primary)] leading-relaxed [&>p]:my-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
