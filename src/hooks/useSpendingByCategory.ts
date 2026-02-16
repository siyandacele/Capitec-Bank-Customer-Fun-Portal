import { useQuery } from '@tanstack/react-query';
import type { CategoriesParams } from '@/types/api';

export const useSpendingByCategory = (customerId: string, params: CategoriesParams) => {
  const queryParams = new URLSearchParams();
  if (params.period) queryParams.set('period', params.period);
  if (params.startDate) queryParams.set('startDate', params.startDate);
  if (params.endDate) queryParams.set('endDate', params.endDate);

  return useQuery({
    queryKey: ['categories', customerId, params],
    queryFn: () =>
      fetch(
        `/api/customers/${customerId}/spending/categories?${queryParams.toString()}`,
      ).then(res => res.json()),
    enabled: !!customerId,
  });
};
