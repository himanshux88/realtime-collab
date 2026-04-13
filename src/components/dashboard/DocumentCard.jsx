"use client";

import { cn } from "utils/cn";

/**
 * Converts a date to a human-friendly relative time string.
 */
function timeAgo(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

export default function DocumentCard({
  document,
  onClick,
  viewMode = "grid",
}) {
  /* ── List View ── */
  if (viewMode === "list") {
    return (
      <div
        onClick={onClick}
        className={cn(
          "group flex items-center gap-4 p-4 rounded-xl",
          "bg-white border border-slate-200/60",
          "hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5",
          "transition-all duration-200 cursor-pointer",
        )}
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center flex-shrink-0 group-hover:from-primary/20 group-hover:to-accent/20 transition-colors">
          <svg
            className="w-5 h-5 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-slate-900 truncate group-hover:text-primary transition-colors">
            {document.title}
          </h3>
        </div>
        {document._sharedRole && (
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0",
              document._sharedRole === "editor"
                ? "bg-primary-light text-primary"
                : "bg-amber-50 text-amber-600",
            )}
          >
            {document._sharedRole === "editor" ? "Can Edit" : "View Only"}
          </span>
        )}
        <span className="text-xs text-slate-400 flex-shrink-0">
          {timeAgo(document.updated_at || document.created_at)}
        </span>
        <svg
          className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      </div>
    );
  }

  /* ── Grid View ── */
  return (
    <div
      onClick={onClick}
      className={cn(
        "group p-6 rounded-2xl",
        "bg-white border border-slate-200/60",
        "hover:shadow-lg hover:border-primary/20 hover:-translate-y-1",
        "transition-all duration-300 cursor-pointer relative overflow-hidden",
      )}
    >
      {/* Accent line on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center flex-shrink-0 group-hover:from-primary/20 group-hover:to-accent/20 transition-colors">
          <svg
            className="w-5 h-5 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 truncate group-hover:text-primary transition-colors">
            {document.title}
          </h3>
          <div className="flex items-center gap-2 mt-1.5">
            <p className="text-xs text-slate-400">
              {timeAgo(document.updated_at || document.created_at)}
            </p>
            {document._sharedRole && (
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-semibold",
                  document._sharedRole === "editor"
                    ? "bg-primary-light text-primary"
                    : "bg-amber-50 text-amber-600",
                )}
              >
                {document._sharedRole === "editor" ? "Can Edit" : "View Only"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content preview placeholder lines */}
      <div className="mt-4 space-y-2">
        <div className="h-3 bg-slate-50 rounded-full w-full" />
        <div className="h-3 bg-slate-50 rounded-full w-4/5" />
        <div className="h-3 bg-slate-50 rounded-full w-3/5" />
      </div>
    </div>
  );
}
