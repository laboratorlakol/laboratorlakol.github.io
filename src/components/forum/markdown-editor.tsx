"use client";
import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bold, Italic, Strikethrough, Link2, Quote, Code, List, ListOrdered, Eye, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
interface ToolbarAction { icon: typeof Bold; label: string; apply: (s: string) => { text: string } }
const ACTIONS: ToolbarAction[] = [
  { icon: Bold, label: "Bold", apply: s => ({ text: `**${s||"text"}**` }) },
  { icon: Italic, label: "Italic", apply: s => ({ text: `*${s||"text"}*` }) },
  { icon: Strikethrough, label: "Tăiat", apply: s => ({ text: `~~${s||"text"}~~` }) },
  { icon: Link2, label: "Link", apply: s => ({ text: `[${s||"text"}](https://)` }) },
  { icon: Quote, label: "Citat", apply: s => ({ text: (s||"citat").split("\n").map(l=>`> ${l}`).join("\n") }) },
  { icon: Code, label: "Cod", apply: s => ({ text: s.includes("\n") ? `\`\`\`\n${s||"cod"}\n\`\`\`` : `\`${s||"cod"}\`` }) },
  { icon: List, label: "Listă", apply: s => ({ text: (s||"element").split("\n").map(l=>`- ${l}`).join("\n") }) },
  { icon: ListOrdered, label: "Listă numerotată", apply: s => ({ text: (s||"element").split("\n").map((l,i)=>`${i+1}. ${l}`).join("\n") }) },
];
export function MarkdownEditor({ value, onChange, placeholder, minRows=8 }: { value: string; onChange: (v: string) => void; placeholder?: string; minRows?: number }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState(false);
  function runAction(action: ToolbarAction) {
    const el = textareaRef.current; if (!el) return;
    const start = el.selectionStart; const end = el.selectionEnd;
    const { text } = action.apply(value.slice(start, end));
    const next = value.slice(0, start) + text + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => { el.focus(); const pos = start+text.length; el.setSelectionRange(pos,pos); });
  }
  return (
    <div className="rounded-md border border-line bg-panel overflow-hidden">
      <div className="flex items-center gap-0.5 border-b border-line px-2 py-1.5 flex-wrap">
        {ACTIONS.map(a => { const I=a.icon; return <button key={a.label} type="button" title={a.label} onClick={()=>runAction(a)} className="p-1.5 rounded text-ink-muted hover:text-signal hover:bg-panel-raised transition-colors"><I size={15} /></button>; })}
        <div className="flex-1" />
        <button type="button" onClick={()=>setPreview(p=>!p)} className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono uppercase tracking-wider transition-colors", preview ? "text-signal bg-signal/10" : "text-ink-faint hover:text-ink")}>
          {preview ? <Pencil size={13} /> : <Eye size={13} />}{preview ? "Editează" : "Preview"}
        </button>
      </div>
      {preview ? (
        <div className="px-3.5 py-3 prose prose-invert prose-sm max-w-none prose-a:text-signal prose-code:text-signal-bright" style={{minHeight:`${minRows*1.5}rem`}}>
          {value ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown> : <span className="text-ink-faint">Nimic de previzualizat.</span>}
        </div>
      ) : (
        <textarea ref={textareaRef} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={minRows} className="w-full bg-transparent px-3.5 py-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none resize-y" />
      )}
    </div>
  );
}
