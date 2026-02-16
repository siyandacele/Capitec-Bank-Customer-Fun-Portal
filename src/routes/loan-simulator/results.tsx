import { useEffect } from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import { setLoanPageContext } from '@/store/slices/loanPageSlice';
import EligibilityResult from '@/pages/LoanEligibilitySimulator/components/EligibilityResult';

function ResultsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const result = useSelector((state: RootState) => state.loanPage.eligibilityResult);

  useEffect(() => {
    dispatch(
      setLoanPageContext({
        title: 'Your Results',
        subtitle: 'Here is your loan eligibility assessment.',
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    if (!result) {
      navigate({ to: '/loan-simulator' });
    }
  }, [result, navigate]);

  if (!result) return null;

  return (
    <div className="loan-results-page">
      <EligibilityResult result={result} />
      <div className="button--v2-group loan-results-page__actions">
        <Link
          to="/loan-simulator"
          className="btn button--v2"
        >
          Check Again
        </Link>
        <Link
          to="/loan-simulator/payment-calculator"
          className="btn button--v2 button--v2--secondary"
        >
          Payment Calculator
        </Link>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/loan-simulator/results')({
  component: ResultsPage,
});
