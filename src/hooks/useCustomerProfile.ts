import { useQuery } from '@tanstack/react-query';

export const useCustomerProfile = (customerId: string) => {
  return useQuery({
    queryKey: ['profile', customerId],
    queryFn: () => fetch(`/api/customers/${customerId}/profile`).then(res => res.json()),
    enabled: !!customerId,
  });
};
