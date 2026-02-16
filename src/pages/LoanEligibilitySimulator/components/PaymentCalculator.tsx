import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLoanRateCalculator } from '@/hooks/useLoanRateCalculator';
import { paymentCalculatorSchema } from '../schemas';
import type { RateCalculationRequest } from '@/types/loan';

const formatCurrency = (amount: number) =>
  `R${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;

interface FieldErrors {
  loanAmount?: string;
  loanTerm?: string;
  creditScore?: string;
  loanType?: string;
}

export default function PaymentCalculator() {
  const [formData, setFormData] = useState({
    loanAmount: '',
    loanTerm: '',
    creditScore: '',
    loanType: 'personal_loan',
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const rateMutation = useLoanRateCalculator();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    const data = { ...formData, [name]: value };
    const result = paymentCalculatorSchema.safeParse(data);
    if (result.success) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    } else {
      const fieldError = result.error.issues.find(
        issue => issue.path[0] === name,
      );
      setErrors(prev => ({
        ...prev,
        [name]: fieldError?.message,
      }));
    }
  };

  const validateAll = (): boolean => {
    const result = paymentCalculatorSchema.safeParse(formData);
    if (result.success) {
      setErrors({});
      return true;
    }
    const newErrors: FieldErrors = {};
    const allTouched: Record<string, boolean> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as string;
      if (!newErrors[field as keyof FieldErrors]) {
        newErrors[field as keyof FieldErrors] = issue.message;
      }
      allTouched[field] = true;
    }
    setErrors(newErrors);
    setTouched(prev => ({ ...prev, ...allTouched }));
    return false;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateAll()) return;

    const request: RateCalculationRequest = {
      loanAmount: parseFloat(formData.loanAmount),
      loanTerm: parseInt(formData.loanTerm),
      creditScore: parseInt(formData.creditScore),
      loanType: formData.loanType,
    };
    rateMutation.mutate(request);
  };

  const result = rateMutation.data;

  return (
    <Card className="payment-calculator">
      <CardHeader>
        <CardTitle className="payment-calculator__title">
          <Calculator className="payment-calculator__title-icon" />
          Payment Calculator
        </CardTitle>
        <CardDescription>Estimate your monthly payments and view the schedule</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="payment-calculator__form" noValidate>
          <div className="payment-calculator__fields">
            <div className="payment-calculator__field">
              <Label htmlFor="calc-loanAmount">Loan Amount (R)</Label>
              <Input
                id="calc-loanAmount"
                name="loanAmount"
                type="number"
                placeholder="150000"
                value={formData.loanAmount}
                onChange={handleInputChange}
                onBlur={handleBlur}
                min={5000}
                step="1000"
              />
              {touched.loanAmount && errors.loanAmount && (
                <p className="loan-form__error">{errors.loanAmount}</p>
              )}
            </div>
            <div className="payment-calculator__field">
              <Label htmlFor="calc-loanTerm">Term (months)</Label>
              <Input
                id="calc-loanTerm"
                name="loanTerm"
                type="number"
                placeholder="24"
                value={formData.loanTerm}
                onChange={handleInputChange}
                onBlur={handleBlur}
                min={6}
                max={72}
              />
              {touched.loanTerm && errors.loanTerm && (
                <p className="loan-form__error">{errors.loanTerm}</p>
              )}
            </div>
            <div className="payment-calculator__field">
              <Label htmlFor="calc-creditScore">Credit Score</Label>
              <Input
                id="calc-creditScore"
                name="creditScore"
                type="number"
                placeholder="650"
                value={formData.creditScore}
                onChange={handleInputChange}
                onBlur={handleBlur}
                min={300}
                max={850}
              />
              {touched.creditScore && errors.creditScore && (
                <p className="loan-form__error">{errors.creditScore}</p>
              )}
            </div>
            <div className="payment-calculator__field">
              <Label htmlFor="calc-loanType">Loan Type</Label>
              <Select
                value={formData.loanType}
                onValueChange={(val) => setFormData(prev => ({ ...prev, loanType: val }))}
              >
                <SelectTrigger id="calc-loanType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal_loan">Personal Loan</SelectItem>
                  <SelectItem value="vehicle_loan">Vehicle Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="button--v2-group">
            <button type="submit" className="btn button--v2" disabled={rateMutation.isPending}>
              {rateMutation.isPending ? 'Calculating...' : 'Calculate'}
            </button>
          </div>
        </form>

        {result && (
          <div className="payment-calculator__result">
            <div className="payment-calculator__summary">
              <div className="payment-calculator__summary-item">
                <span className="payment-calculator__summary-label">Interest Rate</span>
                <span className="payment-calculator__summary-value">{result.interestRate}%</span>
              </div>
              <div className="payment-calculator__summary-item">
                <span className="payment-calculator__summary-label">Monthly Payment</span>
                <span className="payment-calculator__summary-value payment-calculator__summary-value--highlight">
                  {formatCurrency(result.monthlyPayment)}
                </span>
              </div>
              <div className="payment-calculator__summary-item">
                <span className="payment-calculator__summary-label">Total Interest</span>
                <span className="payment-calculator__summary-value">{formatCurrency(result.totalInterest)}</span>
              </div>
              <div className="payment-calculator__summary-item">
                <span className="payment-calculator__summary-label">Total Repayment</span>
                <span className="payment-calculator__summary-value">{formatCurrency(result.totalRepayment)}</span>
              </div>
            </div>

            <div className="payment-calculator__schedule">
              <h4 className="payment-calculator__schedule-title">Payment Schedule (first {result.paymentSchedule.length} months)</h4>
              <div className="payment-calculator__table-wrapper">
                <table className="payment-calculator__table">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Payment</th>
                      <th>Principal</th>
                      <th>Interest</th>
                      <th>Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.paymentSchedule.map((item) => (
                      <tr key={item.month}>
                        <td>{item.month}</td>
                        <td>{formatCurrency(item.payment)}</td>
                        <td>{formatCurrency(item.principal)}</td>
                        <td>{formatCurrency(item.interest)}</td>
                        <td>{formatCurrency(item.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
