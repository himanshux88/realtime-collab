"use client";

import { EditorContent } from "@tiptap/react";
import { cn } from "utils/cn";

export default function EditorArea({ editor, className }) {
  return (
    <div
      className={cn(
        "flex-1 overflow-auto tiptap-editor-wrapper",
        className,
      )}
    >
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 py-6 sm:py-8">
        <EditorContent editor={editor} className="w-full" />
      </div>
    </div>
  );
}
