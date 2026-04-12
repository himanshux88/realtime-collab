import { cn } from "utils/cn";

export default function SaveStatus({ saving }) {
  return (
    <div className="flex items-center gap-1.5 text-xs font-medium">
      <span
        className={cn(
          "w-2 h-2 rounded-full transition-colors duration-300",
          saving ? "bg-amber-400 animate-pulse" : "bg-emerald-400",
        )}
      />
      <span
        className={cn(
          "transition-colors duration-300 hidden sm:inline",
          saving ? "text-amber-600" : "text-slate-400",
        )}
      >
        {saving ? "Saving..." : "Saved"}
      </span>
    </div>
  );
}
