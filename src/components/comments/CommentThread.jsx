import Avatar from "components/ui/Avatar";

export default function CommentThread({ comment }) {
  return (
    <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100 space-y-2.5 animate-slide-up">
      {/* Selected text reference */}
      {comment.selected_text && (
        <div className="px-3 py-1.5 rounded-lg bg-amber-50 border-l-2 border-amber-400">
          <p className="text-xs text-amber-700 line-clamp-2 italic">
            &ldquo;{comment.selected_text}&rdquo;
          </p>
        </div>
      )}

      {/* Comment body */}
      <div className="flex items-start gap-3">
        <Avatar
          userId={comment.user_id}
          name={`U${String(comment.user_id).slice(-1)}`}
          size="sm"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-slate-700">
              User {String(comment.user_id).slice(-4)}
            </span>
            <span className="text-[10px] text-slate-400">
              {new Date(comment.created_at).toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            {comment.text}
          </p>
        </div>
      </div>
    </div>
  );
}
