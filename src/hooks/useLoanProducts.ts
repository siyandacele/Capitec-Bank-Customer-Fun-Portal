import { useQuery } from '@tanstack/react-query';
import type { LoanProductsResponse } from '@/types/loan';

export const useLoanProducts = () => {
  return useQuery<LoanProductsResponse>({
    queryKey: ['loanProducts'],
    queryFn: async () => {
      const res = await fetch('/api/loans/products');
      if (!res.ok) throw new Error('Failed to fetch loan products');
      return res.json();
    },
    staleTime: 10 * 60 * 1000,
  });
};
