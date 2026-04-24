export default function ProductCardSkeleton() {
  return (
    <article className="soft-card rounded-3xl p-4">
      <div className="skeleton h-48 rounded-2xl" />
      <div className="mt-4 space-y-2">
        <div className="skeleton h-3 w-20 rounded-full" />
        <div className="skeleton h-5 w-4/5 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
      </div>
      <div className="mt-5 flex items-center justify-between">
        <div className="skeleton h-6 w-24 rounded" />
        <div className="skeleton h-9 w-24 rounded-xl" />
      </div>
    </article>
  );
}
