interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className = '', style }: SkeletonProps) {
  return <div className={`skeleton ${className}`} style={style} />;
}

interface SkeletonRowProps {
  count?: number;
}

export function ListRowSkeleton({ count = 5 }: SkeletonRowProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-row">
          <Skeleton
            className="skeleton-row__icon skeleton--rounded-lg"
            style={{ width: 40, height: 40 }}
          />
          <div className="skeleton-row__content">
            <div className="skeleton-row__details">
              <div className="skeleton-row__lines">
                <Skeleton style={{ height: 16, width: 128 }} />
                <Skeleton style={{ height: 12, width: 96 }} />
                <div className="skeleton-row__meta">
                  <Skeleton style={{ height: 12, width: 80 }} />
                  <Skeleton style={{ height: 16, width: 64 }} />
                </div>
              </div>
              <div className="skeleton-row__amount">
                <Skeleton
                  className="skeleton-row__amount-line"
                  style={{ height: 16, width: 80 }}
                />
                <Skeleton
                  className="skeleton-row__amount-line"
                  style={{ height: 12, width: 64 }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
