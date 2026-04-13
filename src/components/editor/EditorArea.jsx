"use client";

import { cn } from "utils/cn";

export default function EditorArea({ content, onChange, onMouseUp, className, readOnly }) {
  return (
    <div className={cn("flex-1 overflow-auto", className)}>
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
        <textarea
          value={content}
          onChange={onChange}
          onMouseUp={onMouseUp}
          readOnly={readOnly}
          className={cn(
            "w-full min-h-[calc(100vh-220px)] resize-none",
            "text-base md:text-lg leading-relaxed text-slate-800",
            "bg-transparent border-none outline-none",
            "placeholder:text-slate-300",
            "focus:ring-0",
            readOnly && "cursor-default opacity-75",
          )}
          placeholder="Start writing something amazing..."
        />
      </div>
    </div>
  );
}
