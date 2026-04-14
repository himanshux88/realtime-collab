"use client";

import IconButton from "components/ui/IconButton";
import { cn } from "utils/cn";

/* ── SVG icon paths for each tool ── */
const icons = {
  bold: "M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z",
  italic: "M19 4h-9 M14 20H5 M15 4 9 20",
  underline: "M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3 M4 21h16",
  strike: "M16 4H9a3 3 0 0 0-3 3c0 1.66 1.34 3 3 3h6a3 3 0 0 1 0 6H6 M4 12h16",
  h1: "M4 12h8 M4 18V6 M12 18V6 M21 18h-4v-6.5a2 2 0 1 1 4 0",
  h2: "M4 12h8 M4 18V6 M12 18V6 M21.5 18h-4.5l3.5-4a2.5 2.5 0 1 0-4.3-1.7",
  h3: "M4 12h8 M4 18V6 M12 18V6 M17.5 10.5a2 2 0 1 1 3 1.7L18 14h3.5 M17.5 17.5a2 2 0 1 0 3-1.7",
  bulletList: "M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01",
  orderedList: "M10 6h11 M10 12h11 M10 18h11 M4 6h1v4 M4 10h2 M6 18H4c0-1 2-2 2-3s-1-1.5-2-1",
  blockquote:
    "M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z",
  code: "M16 18l6-6-6-6 M8 6l-6 6 6 6",
  codeBlock: "M8 6l-6 6 6 6 M16 6l6 6-6 6 M14 4l-4 16",
  horizontalRule: "M3 12h18",
  alignLeft: "M17 10H3 M21 6H3 M21 14H3 M17 18H3",
  alignCenter: "M18 10H6 M21 6H3 M21 14H3 M18 18H6",
  alignRight: "M21 10H7 M21 6H3 M21 14H3 M21 18H7",
  highlight: "M12 20h9 M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z",
  undo: "M3 7v6h6 M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6.69 3L3 13",
  redo: "M21 7v6h-6 M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6.69 3L21 13",
};

function ToolIcon({ d }) {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-slate-200 mx-0.5 flex-shrink-0" />;
}

export default function EditorToolbar({ editor, className, disabled }) {
  if (!editor) return null;

  /* ── Button definitions grouped by section ── */
  const groups = [
    // ── History ──
    [
      {
        name: "Undo",
        icon: icons.undo,
        action: () => editor.chain().focus().undo().run(),
        isDisabled: () => !editor.can().undo(),
      },
      {
        name: "Redo",
        icon: icons.redo,
        action: () => editor.chain().focus().redo().run(),
        isDisabled: () => !editor.can().redo(),
      },
    ],
    // ── Inline formatting ──
    [
      {
        name: "Bold",
        icon: icons.bold,
        action: () => editor.chain().focus().toggleBold().run(),
        isActive: () => editor.isActive("bold"),
      },
      {
        name: "Italic",
        icon: icons.italic,
        action: () => editor.chain().focus().toggleItalic().run(),
        isActive: () => editor.isActive("italic"),
      },
      {
        name: "Underline",
        icon: icons.underline,
        action: () => editor.chain().focus().toggleUnderline().run(),
        isActive: () => editor.isActive("underline"),
      },
      {
        name: "Strikethrough",
        icon: icons.strike,
        action: () => editor.chain().focus().toggleStrike().run(),
        isActive: () => editor.isActive("strike"),
      },
      {
        name: "Highlight",
        icon: icons.highlight,
        action: () => editor.chain().focus().toggleHighlight().run(),
        isActive: () => editor.isActive("highlight"),
      },
      {
        name: "Code",
        icon: icons.code,
        action: () => editor.chain().focus().toggleCode().run(),
        isActive: () => editor.isActive("code"),
      },
    ],
    // ── Headings ──
    [
      {
        name: "Heading 1",
        icon: icons.h1,
        action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        isActive: () => editor.isActive("heading", { level: 1 }),
      },
      {
        name: "Heading 2",
        icon: icons.h2,
        action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        isActive: () => editor.isActive("heading", { level: 2 }),
      },
    ],
    // ── Block formatting ──
    [
      {
        name: "Bullet List",
        icon: icons.bulletList,
        action: () => editor.chain().focus().toggleBulletList().run(),
        isActive: () => editor.isActive("bulletList"),
      },
      {
        name: "Ordered List",
        icon: icons.orderedList,
        action: () => editor.chain().focus().toggleOrderedList().run(),
        isActive: () => editor.isActive("orderedList"),
      },
      {
        name: "Blockquote",
        icon: icons.blockquote,
        action: () => editor.chain().focus().toggleBlockquote().run(),
        isActive: () => editor.isActive("blockquote"),
      },
      {
        name: "Code Block",
        icon: icons.codeBlock,
        action: () => editor.chain().focus().toggleCodeBlock().run(),
        isActive: () => editor.isActive("codeBlock"),
      },
      {
        name: "Divider",
        icon: icons.horizontalRule,
        action: () => editor.chain().focus().setHorizontalRule().run(),
      },
    ],
    // ── Alignment ──
    [
      {
        name: "Align Left",
        icon: icons.alignLeft,
        action: () => editor.chain().focus().setTextAlign("left").run(),
        isActive: () => editor.isActive({ textAlign: "left" }),
      },
      {
        name: "Align Center",
        icon: icons.alignCenter,
        action: () => editor.chain().focus().setTextAlign("center").run(),
        isActive: () => editor.isActive({ textAlign: "center" }),
      },
      {
        name: "Align Right",
        icon: icons.alignRight,
        action: () => editor.chain().focus().setTextAlign("right").run(),
        isActive: () => editor.isActive({ textAlign: "right" }),
      },
    ],
  ];

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-0.5 px-2 py-1.5 rounded-xl",
        "bg-white border border-slate-200/60 shadow-sm",
        "overflow-x-auto scrollbar-none",
        disabled && "opacity-50 pointer-events-none",
        className,
      )}
    >
      {groups.map((group, gi) => (
        <div key={gi} className="contents">
          {gi > 0 && <Divider />}
          {group.map((btn) => (
            <IconButton
              key={btn.name}
              tooltip={btn.name}
              active={btn.isActive?.()}
              disabled={btn.isDisabled?.()}
              onClick={btn.action}
            >
              <ToolIcon d={btn.icon} />
            </IconButton>
          ))}
        </div>
      ))}
    </div>
  );
}
