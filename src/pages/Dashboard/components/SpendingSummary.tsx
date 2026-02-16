import { useSelector } from 'react-redux';
import SummaryCard from '@/components/shared/SummaryCard';
import { useSpendingSummary } from '@/hooks/useSpendingSummary';
import { Skeleton } from '@/components/shared/Skeleton';
import type { RootState } from '@/store';

export default function SpendingSummary() {
  const customerId = useSelector((state: RootState) => state.filters.customerId);
  const period = useSelector((state: RootState) => state.filters.period);
  const { data: summary, isFetching } = useSpendingSummary(customerId, period);

  if (isFetching) {
    return (
      <div className="row spending-summary">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="col-12 col-md-6">
            <div className="spending-summary__skeleton-card">
              <Skeleton style={{ width: '100%', height: '100%' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="row spending-summary">
      <div className="col-12 col-md-6">
        <SummaryCard
          title="Total Spent"
          value={`R${summary.totalSpent.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`}
          trend={{ value: summary.comparedToPrevious.spentChange }}
        />
      </div>

      <div className="col-12 col-md-6">
        <SummaryCard
          title="Transactions"
          value={summary.transactionCount}
          trend={{ value: summary.comparedToPrevious.transactionChange }}
        />
      </div>

      <div className="col-12 col-md-6">
        <SummaryCard
          title="Average Transaction"
          value={`R${summary.averageTransaction.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`}
          icon="calculator"
        />
      </div>

      <div className="col-12 col-md-6">
        <SummaryCard title="Top Category" value={summary.topCategory} icon="award" />
      </div>
    </div>
  );
}
