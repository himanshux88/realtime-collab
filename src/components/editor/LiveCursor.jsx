import { cn } from "utils/cn";

const cursorColors = [
  { bg: "bg-blue-500", text: "text-blue-500" },
  { bg: "bg-rose-500", text: "text-rose-500" },
  { bg: "bg-emerald-500", text: "text-emerald-500" },
  { bg: "bg-violet-500", text: "text-violet-500" },
  { bg: "bg-orange-500", text: "text-orange-500" },
  { bg: "bg-cyan-500", text: "text-cyan-500" },
];

function getColor(userId) {
  const hash = String(userId)
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return cursorColors[hash % cursorColors.length];
}

export default function LiveCursor({ userId, position, label }) {
  const color = getColor(userId);

  if (!position) return null;

  return (
    <div
      className="fixed pointer-events-none z-50 transition-all duration-75 ease-out"
      style={{ left: position.x, top: position.y }}
    >
      {/* Cursor pointer SVG */}
      <svg className={cn("w-5 h-5", color.text)} viewBox="0 0 24 24" fill="currentColor">
        <path d="M5.65 5.65l3.5 12.05 2.75-4.6 5.1 5.1 1.8-1.8-5.1-5.1 4.6-2.75z" />
      </svg>

      {/* User label */}
      <span
        className={cn(
          "absolute left-4 top-4 px-2 py-0.5 rounded-full text-xs font-medium text-white whitespace-nowrap shadow-lg",
          color.bg,
        )}
      >
        {label || `User ${String(userId).slice(-4)}`}
      </span>
    </div>
  );
}
