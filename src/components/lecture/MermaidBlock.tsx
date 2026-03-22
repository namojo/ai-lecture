"use client";

import { useEffect, useRef, useState } from "react";

interface MermaidBlockProps {
  chart: string;
}

export default function MermaidBlock({ chart }: MermaidBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    async function renderChart() {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          themeVariables: {
            primaryColor: "#1B2838",
            primaryTextColor: "#e0e1dd",
            primaryBorderColor: "#00b4d8",
            lineColor: "#00b4d8",
            secondaryColor: "#111d2c",
            tertiaryColor: "#0f1923",
            fontFamily:
              '"Pretendard", -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: "14px",
            nodeBorder: "#00b4d8",
            mainBkg: "#1B2838",
            clusterBkg: "#111d2c",
            clusterBorder: "#1B2838",
            edgeLabelBackground: "#0a1628",
            nodeTextColor: "#e0e1dd",
          },
          flowchart: {
            htmlLabels: true,
            curve: "basis",
            padding: 16,
            nodeSpacing: 40,
            rankSpacing: 50,
          },
        });

        const id = `mermaid-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const { svg: renderedSvg } = await mermaid.render(id, chart.trim());

        if (!cancelled) {
          setSvg(renderedSvg);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(String(err));
        }
      }
    }

    renderChart();
    return () => {
      cancelled = true;
    };
  }, [chart]);

  if (error) {
    return (
      <div className="my-4 rounded-lg border border-red-500/30 bg-red-500/5 p-4">
        <pre className="text-xs text-red-400 whitespace-pre-wrap font-mono">
          {chart}
        </pre>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="my-4 flex items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--surface)] p-8">
        <div className="w-5 h-5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="my-4 flex justify-center rounded-lg border border-[var(--border-color)] bg-[#0a1628] p-6 overflow-x-auto [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
