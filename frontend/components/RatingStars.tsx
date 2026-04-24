interface Props {
  value: number;
  size?: "sm" | "md";
}

export default function RatingStars({ value, size = "sm" }: Props) {
  const full = Math.floor(value);
  const hasHalf = value - full >= 0.5;
  const stars = Array.from({ length: 5 }, (_, idx) => {
    if (idx < full) return "full";
    if (idx === full && hasHalf) return "half";
    return "empty";
  });

  const starSize = size === "md" ? "h-5 w-5" : "h-4 w-4";

  return (
    <div className="flex items-center gap-1" aria-label={`Rated ${value} out of 5`}>
      {stars.map((state, idx) => (
        <svg key={`${state}-${idx}`} viewBox="0 0 24 24" className={`${starSize} ${state === "empty" ? "text-slate-300" : "text-amber-400"}`}>
          {state === "half" ? (
            <>
              <defs>
                <linearGradient id={`half-${idx}`}>
                  <stop offset="50%" stopColor="currentColor" />
                  <stop offset="50%" stopColor="#cbd5e1" />
                </linearGradient>
              </defs>
              <path
                fill={`url(#half-${idx})`}
                d="M12 17.3l-6.18 3.73 1.64-7.03L2 9.24l7.19-.62L12 2l2.81 6.62 7.19.62-5.46 4.76 1.64 7.03z"
              />
            </>
          ) : (
            <path
              fill="currentColor"
              d="M12 17.3l-6.18 3.73 1.64-7.03L2 9.24l7.19-.62L12 2l2.81 6.62 7.19.62-5.46 4.76 1.64 7.03z"
            />
          )}
        </svg>
      ))}
    </div>
  );
}
