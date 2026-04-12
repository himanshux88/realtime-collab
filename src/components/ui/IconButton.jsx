import { cn } from "utils/cn";

export default function IconButton({
  children,
  className,
  active,
  tooltip,
  ...props
}) {
  return (
    <button
      className={cn(
        "relative p-2 rounded-xl transition-all duration-200 cursor-pointer",
        "hover:bg-slate-100 active:scale-95",
        "focus:outline-none focus:ring-2 focus:ring-primary/20",
        "text-slate-500 hover:text-slate-700",
        active && "bg-primary-light text-primary hover:bg-primary-light",
        className,
      )}
      title={tooltip}
      {...props}
    >
      {children}
    </button>
  );
}
