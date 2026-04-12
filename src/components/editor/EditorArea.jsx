"use client";

import { cn } from "utils/cn";

export default function EditorArea({ content, onChange, onMouseUp, className }) {
  return (
    <div className={cn("flex-1 overflow-auto", className)}>
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
        <textarea
          value={content}
          onChange={onChange}
          onMouseUp={onMouseUp}
          className={cn(
            "w-full min-h-[calc(100vh-220px)] resize-none",
            "text-base md:text-lg leading-relaxed text-slate-800",
            "bg-transparent border-none outline-none",
            "placeholder:text-slate-300",
            "focus:ring-0",
          )}
          placeholder="Start writing something amazing..."
        />
      </div>
    </div>
  );
}
