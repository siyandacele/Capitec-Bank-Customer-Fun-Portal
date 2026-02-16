import { useQuery } from '@tanstack/react-query';

export const useSpendingGoals = (customerId: string) => {
  return useQuery({
    queryKey: ['goals', customerId],
    queryFn: () => fetch(`/api/customers/${customerId}/goals`).then(res => res.json()),
    enabled: !!customerId,
  });
};
