"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
export function PostContent({ content }: { content: string }) {
  return (
    <div className="prose prose-invert prose-sm max-w-none prose-a:text-signal prose-strong:text-ink prose-code:text-signal-bright prose-blockquote:border-signal/40 prose-p:text-ink-muted prose-li:text-ink-muted">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
