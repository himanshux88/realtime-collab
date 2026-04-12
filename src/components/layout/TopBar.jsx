"use client";

import { useRouter } from "next/navigation";
import IconButton from "components/ui/IconButton";
import Button from "components/ui/Button";
import SaveStatus from "components/editor/SaveStatus";
import PresenceAvatars from "components/editor/PresenceAvatars";

export default function TopBar({
  title,
  saving,
  presenceUsers,
  onToggleComments,
  onShare,
  commentsOpen,
  commentCount,
}) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-slate-200/60">
      <div className="flex items-center justify-between px-4 md:px-6 h-16">
        {/* Left – Back + Title */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <IconButton
            onClick={() => router.push("/dashboard")}
            tooltip="Back to Dashboard"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
          </IconButton>

          <h1 className="text-lg font-semibold text-slate-900 truncate flex-1 min-w-0">
            {title || "Untitled Document"}
          </h1>
        </div>

        {/* Right – Actions */}
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          <SaveStatus saving={saving} />

          <div className="hidden sm:block">
            <PresenceAvatars users={presenceUsers} />
          </div>

          <div className="hidden sm:block w-px h-6 bg-slate-200" />

          {/* Comments toggle */}
          <IconButton
            onClick={onToggleComments}
            active={commentsOpen}
            tooltip="Comments"
          >
            <div className="relative">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                />
              </svg>
              {commentCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                  {commentCount > 9 ? "9+" : commentCount}
                </span>
              )}
            </div>
          </IconButton>

          {/* Share button */}
          <Button size="sm" onClick={onShare}>
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
              />
            </svg>
            <span className="hidden sm:inline">Share</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
