import { useQuery } from '@tanstack/react-query';

export const useAvailableFilters = (customerId: string) => {
  return useQuery({
    queryKey: ['filters', customerId],
    queryFn: () => fetch(`/api/customers/${customerId}/filters`).then(res => res.json()),
    enabled: !!customerId,
  });
};
