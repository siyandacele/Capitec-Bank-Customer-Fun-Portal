import { useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useDispatch } from 'react-redux';
import { setLoanPageContext, setEligibilityResult } from '@/store/slices/loanPageSlice';
import { useLoanEligibilityCheck } from '@/hooks/useLoanEligibility';
import EligibilityForm from '@/pages/LoanEligibilitySimulator/components/EligibilityForm';

function CheckEligibilityPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const eligibilityMutation = useLoanEligibilityCheck();

  useEffect(() => {
    dispatch(
      setLoanPageContext({
        title: 'Check Your Eligibility',
        subtitle: 'Enter your details to see if you qualify for a loan.',
      }),
    );
  }, [dispatch]);

  const handleSubmit = (data: Parameters<typeof eligibilityMutation.mutate>[0]) => {
    eligibilityMutation.mutate(data, {
      onSuccess: (result) => {
        dispatch(setEligibilityResult(result));
        navigate({ to: '/loan-simulator/results' });
      },
    });
  };

  return (
    <EligibilityForm
      onSubmit={handleSubmit}
      isPending={eligibilityMutation.isPending}
    />
  );
}

export const Route = createFileRoute('/loan-simulator/')({
  component: CheckEligibilityPage,
});
