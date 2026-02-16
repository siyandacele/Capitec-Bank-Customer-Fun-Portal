import { useQuery } from '@tanstack/react-query';
import type { Period } from '@/types/api';

export const useSpendingSummary = (customerId: string, period: Period) => {
  return useQuery({
    queryKey: ['summary', customerId, period],
    queryFn: () =>
      fetch(`/api/customers/${customerId}/spending/summary?period=${period}`).then(res =>
        res.json(),
      ),
    enabled: !!customerId,
  });
};
