import { cn } from "utils/cn";

const variants = {
  default: "bg-slate-100 text-slate-600",
  primary: "bg-primary-light text-primary",
  success: "bg-emerald-50 text-emerald-600",
  warning: "bg-amber-50 text-amber-600",
  danger: "bg-red-50 text-red-600",
};

export default function Badge({
  variant = "default",
  children,
  className,
  dot,
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        variants[variant],
        className,
      )}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            variant === "success" ? "bg-emerald-500" : "bg-current",
          )}
        />
      )}
      {children}
    </span>
  );
}
