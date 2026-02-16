import { useQuery } from '@tanstack/react-query';

export const useMonthlyTrends = (customerId: string, months = 6) => {
  return useQuery({
    queryKey: ['trends', customerId, months],
    queryFn: () =>
      fetch(`/api/customers/${customerId}/spending/trends?months=${months}`).then(res =>
        res.json(),
      ),
    enabled: !!customerId,
  });
};
