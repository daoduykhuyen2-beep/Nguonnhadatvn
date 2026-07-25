export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-7 w-40 animate-pulse rounded-lg bg-neutral-200" />
      <div className="space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex gap-4 rounded-2xl border border-neutral-100 bg-white p-3 shadow-sm"
          >
            <div className="h-24 w-32 flex-shrink-0 animate-pulse rounded-xl bg-neutral-200" />
            <div className="flex-1 space-y-3 py-1">
              <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-neutral-100" />
              <div className="flex gap-2 pt-2">
                <div className="h-6 w-20 animate-pulse rounded-full bg-neutral-100" />
                <div className="h-6 w-24 animate-pulse rounded-full bg-neutral-100" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
