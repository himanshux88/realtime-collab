import { cn } from "utils/cn";
import DocumentCard from "components/dashboard/DocumentCard";
import { DocumentCardSkeleton } from "components/ui/Skeleton";

export default function DocumentGrid({
  documents,
  loading,
  viewMode = "grid",
  onDocumentClick,
}) {
  if (loading) {
    return (
      <div
        className={cn(
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            : "space-y-3",
        )}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <DocumentCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        viewMode === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          : "space-y-3",
      )}
    >
      {documents.map((doc) => (
        <DocumentCard
          key={doc.id}
          document={doc}
          viewMode={viewMode}
          onClick={() => onDocumentClick(doc.id)}
        />
      ))}
    </div>
  );
}
