import { cn } from "utils/cn";

const bgColors = [
  "bg-indigo-500",
  "bg-violet-500",
  "bg-pink-500",
  "bg-rose-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-sky-500",
];

const sizesMap = {
  sm: "w-7 h-7 text-[10px]",
  md: "w-8 h-8 text-xs",
  lg: "w-10 h-10 text-sm",
};

function getColorFromId(id) {
  const hash = String(id)
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return bgColors[hash % bgColors.length];
}

function getInitials(name) {
  if (!name) return "?";
  return name.charAt(0).toUpperCase();
}

export default function Avatar({
  name,
  userId,
  size = "md",
  className,
  showStatus,
}) {
  return (
    <div className={cn("relative inline-flex", className)}>
      <div
        className={cn(
          "rounded-full flex items-center justify-center font-semibold text-white ring-2 ring-white",
          getColorFromId(userId),
          sizesMap[size],
        )}
      >
        {getInitials(name)}
      </div>
      {showStatus && (
        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />
      )}
    </div>
  );
}
