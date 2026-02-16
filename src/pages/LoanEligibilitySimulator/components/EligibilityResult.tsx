import { CheckCircle2, XCircle, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import type { EligibilityResponse } from '@/types/loan';

interface EligibilityResultProps {
  result: EligibilityResponse;
}

const formatCurrency = (amount: number) =>
  `R${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;

const getRiskBadgeClass = (risk: string) => {
  switch (risk) {
    case 'low': return 'loan-result__risk-badge--low';
    case 'medium': return 'loan-result__risk-badge--medium';
    case 'high': return 'loan-result__risk-badge--high';
    default: return '';
  }
};

const getScoreClass = (score: string) => {
  switch (score) {
    case 'excellent': return 'loan-result__score--excellent';
    case 'good': return 'loan-result__score--good';
    case 'fair': return 'loan-result__score--fair';
    case 'poor': return 'loan-result__score--poor';
    default: return '';
  }
};

export default function EligibilityResult({ result }: EligibilityResultProps) {
  const { eligibilityResult, recommendedLoan, affordabilityAnalysis } = result;

  return (
    <div className={`loan-result ${eligibilityResult.isEligible ? 'loan-result--eligible' : 'loan-result--ineligible'}`}>
      <div className="loan-result__status-header">
        {eligibilityResult.isEligible ? (
          <CheckCircle2 className="loan-result__status-icon loan-result__status-icon--success" />
        ) : (
          <XCircle className="loan-result__status-icon loan-result__status-icon--error" />
        )}
        <span className="loan-result__status-text">
          {eligibilityResult.isEligible ? 'You Qualify!' : 'Not Eligible'}
        </span>
        <span className={`loan-result__risk-badge ${getRiskBadgeClass(eligibilityResult.riskCategory)}`}>
          {eligibilityResult.riskCategory} risk
        </span>
      </div>
      <p className="loan-result__decision-reason">{eligibilityResult.decisionReason}</p>

      <div className="loan-result__body">
        <div className="loan-result__likelihood">
          <div className="loan-result__likelihood-header">
            <span className="loan-result__likelihood-label">Approval Likelihood</span>
            <span className="loan-result__likelihood-value">{eligibilityResult.approvalLikelihood}%</span>
          </div>
          <div className="loan-result__likelihood-track">
            <div
              className="loan-result__likelihood-bar"
              style={{ width: `${eligibilityResult.approvalLikelihood}%` }}
            />
          </div>
        </div>

        {eligibilityResult.isEligible && (
          <div className="loan-result__details">
            <h4 className="loan-result__section-title">Recommended Loan</h4>
            <div className="loan-result__grid">
              <div className="loan-result__stat">
                <span className="loan-result__stat-label">Max Loan Amount</span>
                <span className="loan-result__stat-value loan-result__stat-value--highlight">
                  {formatCurrency(recommendedLoan.maxAmount)}
                </span>
              </div>
              <div className="loan-result__stat">
                <span className="loan-result__stat-label">Interest Rate</span>
                <span className="loan-result__stat-value">{recommendedLoan.interestRate}%</span>
              </div>
              <div className="loan-result__stat">
                <span className="loan-result__stat-label">Monthly Payment</span>
                <span className="loan-result__stat-value">{formatCurrency(recommendedLoan.monthlyPayment)}</span>
              </div>
              <div className="loan-result__stat">
                <span className="loan-result__stat-label">Total Repayment</span>
                <span className="loan-result__stat-value">{formatCurrency(recommendedLoan.totalRepayment)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="loan-result__affordability">
          <h4 className="loan-result__section-title">
            <AlertCircle className="loan-result__section-icon" />
            Affordability Analysis
          </h4>
          <div className="loan-result__factors">
            <div className="loan-result__factor">
              <span className="loan-result__factor-label">Disposable Income</span>
              <span className="loan-result__factor-value">{formatCurrency(affordabilityAnalysis.disposableIncome)}</span>
            </div>
            <div className="loan-result__factor">
              <span className="loan-result__factor-label">Debt-to-Income Ratio</span>
              <div className="loan-result__factor-row">
                {affordabilityAnalysis.debtToIncomeRatio < 30 ? (
                  <TrendingDown className="loan-result__factor-icon loan-result__factor-icon--good" />
                ) : (
                  <TrendingUp className="loan-result__factor-icon loan-result__factor-icon--bad" />
                )}
                <span className="loan-result__factor-value">{affordabilityAnalysis.debtToIncomeRatio}%</span>
              </div>
            </div>
            <div className="loan-result__factor">
              <span className="loan-result__factor-label">Loan-to-Income Ratio</span>
              <span className="loan-result__factor-value">{affordabilityAnalysis.loanToIncomeRatio}%</span>
            </div>
            <div className="loan-result__factor">
              <span className="loan-result__factor-label">Affordability Score</span>
              <span className={`loan-result__score ${getScoreClass(affordabilityAnalysis.affordabilityScore)}`}>
                {affordabilityAnalysis.affordabilityScore}
              </span>
            </div>
          </div>
        </div>

        {!eligibilityResult.isEligible && (
          <div className="loan-result__recommendations">
            <h4 className="loan-result__recommendations-title">What can you do?</h4>
            <ul className="loan-result__recommendations-list">
              <li>Ensure minimum 3 months of employment</li>
              <li>Reduce existing debt to lower your debt-to-income ratio below 40%</li>
              <li>Increase your monthly income or reduce expenses</li>
              {affordabilityAnalysis.affordabilityScore === 'poor' && (
                <li>Consider a smaller loan amount or longer term</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
