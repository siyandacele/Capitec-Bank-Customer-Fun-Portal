import { useQuery } from '@tanstack/react-query';
import type { TransactionsParams } from '@/types/api';

export const useTransactions = (customerId: string, params: TransactionsParams = {}) => {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  if (params.category) queryParams.set('category', params.category);
  if (params.startDate) queryParams.set('startDate', params.startDate);
  if (params.endDate) queryParams.set('endDate', params.endDate);
  if (params.sortBy) queryParams.set('sortBy', params.sortBy);

  return useQuery({
    queryKey: ['transactions', customerId, params],
    queryFn: () =>
      fetch(`/api/customers/${customerId}/transactions?${queryParams.toString()}`).then(
        res => res.json(),
      ),
    enabled: !!customerId,
  });
};
