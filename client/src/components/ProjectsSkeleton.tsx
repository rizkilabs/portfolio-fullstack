export default function ProjectsSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-xl border border-gray-200"
        >
          <div className="aspect-[3/2] bg-gray-200" />
          <div className="space-y-3 p-5">
            <div className="h-5 w-2/3 rounded bg-gray-200" />
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-5/6 rounded bg-gray-200" />
            <div className="flex gap-2 pt-2">
              <div className="h-6 w-16 rounded-full bg-gray-200" />
              <div className="h-6 w-16 rounded-full bg-gray-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
