export default function ProductCardSkeleton() {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-surface soft-card">
      <div className="skeleton aspect-[4/3] w-full" />
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="skeleton h-3 w-16 rounded" />
          <div className="skeleton h-4 w-12 rounded-full" />
        </div>
        
        <div className="skeleton h-5 w-full rounded mb-1" />
        <div className="skeleton h-5 w-2/3 rounded" />
        
        <div className="mt-3 flex items-center gap-2">
          <div className="skeleton h-3 w-20 rounded" />
          <div className="skeleton h-3 w-8 rounded" />
        </div>

        <div className="mt-3 flex gap-1.5">
          <div className="skeleton h-4 w-12 rounded" />
          <div className="skeleton h-4 w-16 rounded" />
          <div className="skeleton h-4 w-10 rounded" />
        </div>
        
        <div className="mt-auto pt-6 flex items-end justify-between">
          <div className="skeleton h-7 w-20 rounded" />
          <div className="skeleton h-10 w-10 rounded-full" />
        </div>
      </div>
    </article>
  );
}
