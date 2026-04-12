"use client";

import { cn } from "utils/cn";
import CommentThread from "components/comments/CommentThread";
import CommentInput from "components/comments/CommentInput";

export default function CommentsPanel({
  isOpen,
  onClose,
  comments = [],
  selectedText,
  commentText,
  onCommentTextChange,
  onAddComment,
}) {
  const emptyContent = (
    <div className="text-center py-12">
      <svg
        className="w-12 h-12 text-slate-200 mx-auto mb-3"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
        />
      </svg>
      <p className="text-sm text-slate-400">No comments yet</p>
      <p className="text-xs text-slate-300 mt-1">
        Select text in the editor to add a comment
      </p>
    </div>
  );

  const commentList = (
    <>
      {comments.length === 0
        ? emptyContent
        : comments.map((comment) => (
            <CommentThread key={comment.id} comment={comment} />
          ))}
    </>
  );

  const panelHeader = (
    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold text-slate-900">Comments</h3>
        {comments.length > 0 && (
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-xs font-medium text-slate-500">
            {comments.length}
          </span>
        )}
      </div>
      <button
        onClick={onClose}
        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );

  return (
    <>
      {/* ── Desktop: Right Sidebar ── */}
      <div
        className={cn(
          "hidden md:block fixed right-0 top-16 bottom-0 w-[360px] bg-white border-l border-slate-200/60",
          "transform transition-transform duration-300 ease-out z-20",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {panelHeader}

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {commentList}
          </div>

          {selectedText && (
            <CommentInput
              selectedText={selectedText}
              commentText={commentText}
              onCommentTextChange={onCommentTextChange}
              onSubmit={onAddComment}
            />
          )}
        </div>
      </div>

      {/* ── Mobile: Bottom Sheet ── */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 animate-fade-in">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[70vh] animate-slide-up">
            <div className="flex flex-col h-full max-h-[70vh]">
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-slate-200" />
              </div>

              {panelHeader}

              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {commentList}
              </div>

              {selectedText && (
                <CommentInput
                  selectedText={selectedText}
                  commentText={commentText}
                  onCommentTextChange={onCommentTextChange}
                  onSubmit={onAddComment}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
