import Avatar from "components/ui/Avatar";

export default function PresenceAvatars({ users = [] }) {
  if (users.length === 0) return null;

  const visibleUsers = users.slice(0, 3);
  const remaining = users.length - 3;

  return (
    <div className="flex items-center -space-x-2">
      {visibleUsers.map((user, index) => (
        <Avatar
          key={user.user_id || index}
          userId={user.user_id}
          name={`User ${String(user.user_id).slice(-4)}`}
          size="sm"
          showStatus
        />
      ))}
      {remaining > 0 && (
        <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center">
          <span className="text-[10px] font-semibold text-slate-500">
            +{remaining}
          </span>
        </div>
      )}
    </div>
  );
}
