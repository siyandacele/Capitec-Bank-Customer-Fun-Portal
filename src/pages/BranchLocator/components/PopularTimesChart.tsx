import { usePopularTimes } from '@/hooks/useQueries';
import type { DayIndex } from '@/types';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export default function PopularTimesChart({ branchId }: { branchId: number }) {
  const { data: popularTimes, isLoading } = usePopularTimes(branchId);
  const today = new Date().getDay() as DayIndex;

  if (isLoading) {
    return <div className="branch-popular__loading">Loading busy times...</div>;
  }

  if (!popularTimes) return null;

  const todayData = popularTimes[today];
  const businessHours = todayData.filter(h => h.hour >= 7 && h.hour <= 20);

  return (
    <div className="branch-popular">
      <h4 className="branch-popular__title">Popular Times — {DAY_LABELS[today]}</h4>
      <div className="branch-popular__chart">
        {businessHours.map(({ hour, busyPercent }) => (
          <div key={hour} className="branch-popular__bar-wrapper">
            <div
              className={`branch-popular__bar ${busyPercent >= 70 ? 'branch-popular__bar--busy' : busyPercent >= 40 ? 'branch-popular__bar--moderate' : 'branch-popular__bar--quiet'}`}
              style={{ height: `${busyPercent}%` }}
            />
            <span className="branch-popular__hour">
              {hour > 12 ? `${hour - 12}p` : hour === 12 ? '12p' : `${hour}a`}
            </span>
          </div>
        ))}
      </div>
      <div className="branch-popular__legend">
        <span className="branch-popular__legend-item">
          <span className="branch-popular__legend-dot branch-popular__legend-dot--quiet" />{' '}
          Quiet
        </span>
        <span className="branch-popular__legend-item">
          <span className="branch-popular__legend-dot branch-popular__legend-dot--moderate" />{' '}
          Moderate
        </span>
        <span className="branch-popular__legend-item">
          <span className="branch-popular__legend-dot branch-popular__legend-dot--busy" />{' '}
          Busy
        </span>
      </div>
    </div>
  );
}
