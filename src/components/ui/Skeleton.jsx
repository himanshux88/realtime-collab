import { cn } from "utils/cn";

export function Skeleton({ className }) {
  return <div className={cn("skeleton", className)} />;
}

export function DocumentCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 p-6 space-y-4">
      <div className="flex items-start gap-4">
        <Skeleton className="w-11 h-11 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-3/5" />
      </div>
    </div>
  );
}

export function EditorSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 space-y-4">
      <Skeleton className="h-8 w-2/3" />
      <div className="space-y-3 pt-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
