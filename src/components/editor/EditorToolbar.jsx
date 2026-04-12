"use client";

import IconButton from "components/ui/IconButton";
import { cn } from "utils/cn";

const toolbarButtons = [
  {
    name: "Bold",
    path: "M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z",
  },
  {
    name: "Italic",
    path: "M19 4h-9 M14 20H5 M15 4 9 20",
  },
  {
    name: "Underline",
    path: "M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3 M4 21h16",
  },
  {
    name: "Strikethrough",
    path: "M16 4H9a3 3 0 0 0-3 3c0 1.66 1.34 3 3 3h6a3 3 0 0 1 0 6H6 M4 12h16",
  },
  { type: "divider" },
  {
    name: "Heading",
    path: "M4 12h8 M4 18V6 M12 18V6",
  },
  {
    name: "List",
    path: "M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01",
  },
  {
    name: "Quote",
    path: "M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z",
  },
];

export default function EditorToolbar({ className }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 px-2 py-1.5 rounded-xl",
        "bg-white border border-slate-200/60 shadow-sm",
        "overflow-x-auto scrollbar-none",
        className,
      )}
    >
      {toolbarButtons.map((btn, index) => {
        if (btn.type === "divider") {
          return (
            <div
              key={`divider-${index}`}
              className="w-px h-5 bg-slate-200 mx-1 flex-shrink-0"
            />
          );
        }
        return (
          <IconButton key={btn.name} tooltip={btn.name}>
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={btn.path}
              />
            </svg>
          </IconButton>
        );
      })}
    </div>
  );
}
