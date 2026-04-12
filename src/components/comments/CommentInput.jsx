"use client";

import Button from "components/ui/Button";

export default function CommentInput({
  selectedText,
  commentText,
  onCommentTextChange,
  onSubmit,
}) {
  return (
    <div className="p-4 border-t border-slate-100 space-y-3 bg-white">
      {selectedText && (
        <div className="px-3 py-1.5 rounded-lg bg-primary-light/50 border-l-2 border-primary">
          <p className="text-xs text-primary line-clamp-1">
            Commenting on: &ldquo;{selectedText}&rdquo;
          </p>
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => onCommentTextChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit();
            }
          }}
          className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
        <Button size="sm" onClick={onSubmit}>
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
              d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
}
