import { useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/shared/Skeleton';
import { useSpendingGoals } from '@/hooks/useSpendingGoals';
import type { RootState } from '@/store';
import type { Goal } from '@/types/api';

const getBarModifier = (status: string) => {
  if (status === 'on_track') return 'spending-goals__progress-bar--on-track';
  if (status === 'warning') return 'spending-goals__progress-bar--warning';
  if (status === 'exceeded') return 'spending-goals__progress-bar--exceeded';
  return '';
};

export default function SpendingGoals() {
  const customerId = useSelector((state: RootState) => state.filters.customerId);
  const { data, isFetching } = useSpendingGoals(customerId);

  const goals: Goal[] = data?.goals ?? [];

  if (isFetching) {
    return (
      <Card className="w-full shadow-none">
        <CardHeader className="pb-3">
          <CardTitle>Spending Goals</CardTitle>
          <CardDescription className="text-xs">Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="spending-goals__skeleton">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="spending-goals__skeleton-item">
                <Skeleton style={{ height: 16, width: 128 }} />
                <Skeleton style={{ height: 24, width: '100%' }} />
                <div className="spending-goals__skeleton-row">
                  <Skeleton style={{ height: 12, width: 64 }} />
                  <Skeleton style={{ height: 12, width: 64 }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (goals.length === 0) return null;

  return (
    <Card className="w-full shadow-none">
      <CardHeader className="pb-3">
        <CardTitle>Spending Goals</CardTitle>
        <CardDescription className="text-xs">
          {goals[0].daysRemaining} days remaining
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="spending-goals__list">
          {goals.map(goal => (
            <div key={goal.id} className="spending-goals__item">
              <div className="spending-goals__item-header">
                <div className="spending-goals__category">
                  <span className="spending-goals__category-name">{goal.category}</span>
                </div>
                <span className="spending-goals__percentage">
                  {goal.percentageUsed.toFixed(0)}%
                </span>
              </div>

              <div className="spending-goals__progress-track">
                <div
                  className={`spending-goals__progress-bar ${getBarModifier(goal.status)}`}
                  style={{ width: `${Math.min(goal.percentageUsed, 100)}%` }}
                />
              </div>

              <div className="spending-goals__amounts">
                <span>
                  R{goal.currentSpent.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                </span>
                <span>
                  R
                  {goal.monthlyBudget.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
