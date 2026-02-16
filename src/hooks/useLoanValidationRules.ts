import { useQuery } from '@tanstack/react-query';
import type { ValidationRulesResponse } from '@/types/loan';

export const useLoanValidationRules = () => {
  return useQuery<ValidationRulesResponse>({
    queryKey: ['loanValidationRules'],
    queryFn: async () => {
      const res = await fetch('/api/loans/validation-rules');
      if (!res.ok) throw new Error('Failed to fetch validation rules');
      return res.json();
    },
    staleTime: 30 * 60 * 1000,
  });
};
