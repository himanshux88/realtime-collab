import Button from "components/ui/Button";

export default function EmptyState({ onCreateDocument }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      {/* Decorative illustration */}
      <div className="w-32 h-32 mb-8 relative">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-accent/10 rotate-6" />
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/5 -rotate-3" />
        <div className="relative w-full h-full rounded-3xl bg-white border-2 border-dashed border-slate-200 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-slate-300"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-slate-900 mb-2">
        No documents yet
      </h3>
      <p className="text-slate-500 text-sm mb-8 text-center max-w-sm">
        Create your first document and start collaborating in real-time with your
        team.
      </p>

      <Button onClick={onCreateDocument} size="lg">
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        Create Your First Document
      </Button>
    </div>
  );
}
