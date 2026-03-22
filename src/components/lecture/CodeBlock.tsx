"use client";

import { useState, useCallback } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language: string;
  highlightLines?: number[];
  filename?: string;
}

export default function CodeBlock({
  code,
  language,
  highlightLines = [],
  filename,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const displayLang = language || "text";

  return (
    <div className="rounded-lg overflow-hidden my-4 border border-[var(--border-color)]">
      {/* Top Bar */}
      <div className="h-11 flex items-center justify-between px-4 bg-[#0C1222] border-b border-[var(--border-color)]">
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded bg-[var(--accent)]/20 text-[var(--accent)] font-mono">
            {displayLang}
          </span>
          {filename && (
            <span className="text-xs text-[var(--text-muted)]">{filename}</span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-500" />
              <span className="text-green-500">복사됨</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>복사</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area */}
      <Highlight theme={themes.vsDark} code={code.trim()} language={displayLang}>
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre className="overflow-x-auto max-h-[500px] overflow-y-auto bg-[#0C1222] p-0 m-0">
            <code className="block text-sm leading-[1.6] font-mono">
              {tokens.map((line, i) => {
                const lineNum = i + 1;
                const isHighlighted = highlightLines.includes(lineNum);
                const lineProps = getLineProps({ line });

                return (
                  <div
                    key={i}
                    {...lineProps}
                    className={cn(
                      "flex",
                      isHighlighted && "bg-[#1B2838]/80 border-l-[3px] border-l-[var(--accent)]"
                    )}
                  >
                    <span className="w-12 shrink-0 text-right pr-4 text-[#415A77] select-none text-xs leading-[1.6]">
                      {lineNum}
                    </span>
                    <span className="flex-1 pr-4">
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </span>
                  </div>
                );
              })}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  );
}
