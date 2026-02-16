import { useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useDispatch } from 'react-redux';
import { setLoanPageContext } from '@/store/slices/loanPageSlice';
import PaymentCalculator from '@/pages/LoanEligibilitySimulator/components/PaymentCalculator';

function PaymentCalculatorPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setLoanPageContext({
        title: 'Payment Calculator',
        subtitle:
          'Estimate your monthly payments and view your repayment schedule.',
      }),
    );
  }, [dispatch]);

  return <PaymentCalculator />;
}

export const Route = createFileRoute('/loan-simulator/payment-calculator')({
  component: PaymentCalculatorPage,
});
