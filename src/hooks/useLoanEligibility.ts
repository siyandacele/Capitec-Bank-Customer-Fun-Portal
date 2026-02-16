import { useMutation } from '@tanstack/react-query';
import type { EligibilityRequest, EligibilityResponse } from '@/types/loan';

export const useLoanEligibilityCheck = () => {
  return useMutation<EligibilityResponse, Error, EligibilityRequest>({
    mutationFn: async (data) => {
      const res = await fetch('/api/loans/eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Eligibility check failed');
      return res.json();
    },
  });
};
