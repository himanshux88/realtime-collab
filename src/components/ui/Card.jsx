import { cn } from "utils/cn";

export default function Card({
  children,
  className,
  hover = true,
  onClick,
  ...props
}) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm",
        hover &&
          "hover:shadow-md hover:-translate-y-0.5 transition-all duration-200",
        onClick && "cursor-pointer",
        className,
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
