"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock";
import MermaidBlock from "./MermaidBlock";
import TipBox from "./TipBox";
import type { Components } from "react-markdown";

interface ChapterViewProps {
  content: string;
}

function parseTipBox(text: string): { type: string; title: string; body: string } | null {
  const match = text.match(/^\[!(TIP|WARNING|INFO|DANGER|NOTE|CAUTION)\]\s*(.*)/i);
  if (!match) return null;
  const rawType = match[1].toUpperCase();
  const typeMap: Record<string, string> = {
    TIP: "tip",
    WARNING: "warning",
    INFO: "info",
    DANGER: "danger",
    NOTE: "info",
    CAUTION: "warning",
  };
  return {
    type: typeMap[rawType] || "info",
    title: match[2] || rawType,
    body: "",
  };
}

export default function ChapterView({ content }: ChapterViewProps) {
  const components: Components = {
    // Code blocks → CodeBlock component
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      const code = String(children).replace(/\n$/, "");

      // Inline code (no language class AND no newlines = inline)
      if (!match && !code.includes("\n")) {
        return (
          <code
            className="px-1.5 py-0.5 rounded text-sm font-mono bg-[var(--surface-elevated)] text-[var(--accent)]"
            {...props}
          >
            {children}
          </code>
        );
      }

      // Mermaid diagram
      if (match && match[1] === "mermaid") {
        return <MermaidBlock chart={code} />;
      }

      // Code block (with or without language)
      return <CodeBlock code={code} language={match ? match[1] : "text"} />;
    },

    // Wrap pre to avoid double-wrapping
    pre({ children }) {
      return <>{children}</>;
    },

    // Blockquote → TipBox if starts with [!TYPE]
    blockquote({ children }) {
      const text = extractText(children);
      const tip = parseTipBox(text);

      if (tip) {
        const bodyText = text.replace(/^\[!(TIP|WARNING|INFO|DANGER|NOTE|CAUTION)\]\s*.*?\n?/i, "").trim();
        return (
          <TipBox type={tip.type as "info" | "tip" | "warning" | "danger"} title={tip.title}>
            <p>{bodyText}</p>
          </TipBox>
        );
      }

      return (
        <blockquote className="border-l-4 border-[var(--border-color)] pl-4 my-4 text-[var(--text-secondary)] italic">
          {children}
        </blockquote>
      );
    },

    // Headings
    h1({ children }) {
      return (
        <h1 className="text-[28px] font-bold text-[var(--text-primary)] mt-8 mb-4">
          {children}
        </h1>
      );
    },
    h2({ children }) {
      return (
        <h2 className="text-[22px] font-semibold text-[var(--text-primary)] mt-7 mb-3">
          {children}
        </h2>
      );
    },
    h3({ children }) {
      return (
        <h3 className="text-[18px] font-semibold text-[var(--text-primary)] mt-6 mb-2">
          {children}
        </h3>
      );
    },

    // Paragraph
    p({ children }) {
      return (
        <p className="text-base text-[var(--text-primary)] leading-[1.8] my-3">
          {children}
        </p>
      );
    },

    // Lists
    ul({ children }) {
      return <ul className="list-disc pl-6 my-3 space-y-1 text-[var(--text-primary)]">{children}</ul>;
    },
    ol({ children }) {
      return <ol className="list-decimal pl-6 my-3 space-y-1 text-[var(--text-primary)]">{children}</ol>;
    },
    li({ children }) {
      return <li className="text-base leading-[1.8]">{children}</li>;
    },

    // Links
    a({ href, children }) {
      return (
        <a
          href={href}
          className="text-[var(--accent)] hover:underline"
          target={href?.startsWith("http") ? "_blank" : undefined}
          rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    },

    // Tables
    table({ children }) {
      return (
        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border-collapse">{children}</table>
        </div>
      );
    },
    thead({ children }) {
      return <thead className="bg-[var(--surface)]">{children}</thead>;
    },
    th({ children }) {
      return (
        <th className="text-left px-4 py-2 font-semibold text-[var(--text-primary)] border border-[var(--border-color)]">
          {children}
        </th>
      );
    },
    td({ children }) {
      return (
        <td className="px-4 py-2 text-[var(--text-primary)] border border-[var(--border-color)]">
          {children}
        </td>
      );
    },

    // Horizontal rule
    hr() {
      return <hr className="my-8 border-[var(--border-color)]" />;
    },

    // Strong / em
    strong({ children }) {
      return <strong className="font-semibold text-[var(--text-primary)]">{children}</strong>;
    },
    em({ children }) {
      return <em className="italic text-[var(--text-secondary)]">{children}</em>;
    },
  };

  return (
    <div className="chapter-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

function extractText(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (!node) return "";
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (typeof node === "object" && node !== null && "props" in node) {
    const el = node as { props: { children?: React.ReactNode } };
    return extractText(el.props.children);
  }
  return "";
}
