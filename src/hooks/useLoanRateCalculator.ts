import { useMutation } from '@tanstack/react-query';
import type { RateCalculationRequest, RateCalculationResponse } from '@/types/loan';

export const useLoanRateCalculator = () => {
  return useMutation<RateCalculationResponse, Error, RateCalculationRequest>({
    mutationFn: async (data) => {
      const res = await fetch('/api/loans/calculate-rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Rate calculation failed');
      return res.json();
    },
  });
};
