import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { loanEligibilityApi, dashboardApi } from '@/api/services';
import type {
  LoanEligibilityRequest,
  LoanEligibilityResponse,
  Branch,
  DashboardStats,
  PopularTimesByDay,
} from '@/types';

export const useDashboardStats = () => {
  return useQuery<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: dashboardApi.getStatsMock,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useLoanEligibility = () => {
  const queryClient = useQueryClient();

  return useMutation<LoanEligibilityResponse, Error, LoanEligibilityRequest>({
    mutationFn: loanEligibilityApi.checkEligibilityMock,
    onSuccess: data => {
      queryClient.setQueryData(['lastEligibilityCheck'], data);
    },
  });
};

export const useBranches = (enabled: boolean = true) => {
  return useQuery<Branch[]>({
    queryKey: ['branches'],
    queryFn: async () => {
      const res = await fetch('/api/branches');
      if (!res.ok) throw new Error('Failed to fetch branches');
      return res.json();
    },
    staleTime: 10 * 60 * 1000,
    enabled,
  });
};

export const usePopularTimes = (branchId: number | null) => {
  return useQuery<PopularTimesByDay>({
    queryKey: ['popularTimes', branchId],
    queryFn: async () => {
      const res = await fetch(`/api/branches/${branchId}/popular-times`);
      if (!res.ok) throw new Error('Failed to fetch popular times');
      return res.json();
    },
    staleTime: 10 * 60 * 1000,
    enabled: branchId !== null,
  });
};

// Get cached last eligibility check
export const useLastEligibilityCheck = (): LoanEligibilityResponse | undefined => {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<LoanEligibilityResponse>(['lastEligibilityCheck']);
};
