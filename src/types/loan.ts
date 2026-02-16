// Eligibility Check
export interface EligibilityPersonalInfo {
  age: number;
  employmentStatus: 'employed' | 'self_employed' | 'unemployed' | 'retired';
  employmentDuration: number;
}

export interface EligibilityFinancialInfo {
  monthlyIncome: number;
  monthlyExpenses: number;
  existingDebt: number;
  creditScore?: number;
}

export interface EligibilityLoanDetails {
  requestedAmount: number;
  loanTerm: number;
  loanPurpose: string;
}

export interface EligibilityRequest {
  personalInfo: EligibilityPersonalInfo;
  financialInfo: EligibilityFinancialInfo;
  loanDetails: EligibilityLoanDetails;
}

export interface EligibilityResult {
  isEligible: boolean;
  approvalLikelihood: number;
  riskCategory: 'low' | 'medium' | 'high';
  decisionReason: string;
}

export interface RecommendedLoan {
  maxAmount: number;
  recommendedAmount: number;
  interestRate: number;
  monthlyPayment: number;
  totalRepayment: number;
}

export interface AffordabilityAnalysis {
  disposableIncome: number;
  debtToIncomeRatio: number;
  loanToIncomeRatio: number;
  affordabilityScore: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface EligibilityResponse {
  eligibilityResult: EligibilityResult;
  recommendedLoan: RecommendedLoan;
  affordabilityAnalysis: AffordabilityAnalysis;
}

// Loan Products
export interface InterestRateRange {
  min: number;
  max: number;
}

export interface LoanProduct {
  id: string;
  name: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  minTerm: number;
  maxTerm: number;
  interestRateRange: InterestRateRange;
  purposes: string[];
}

export interface LoanProductsResponse {
  products: LoanProduct[];
}

// Rate Calculator
export interface RateCalculationRequest {
  loanAmount: number;
  loanTerm: number;
  creditScore: number;
  loanType: string;
}

export interface PaymentScheduleItem {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface RateCalculationResponse {
  interestRate: number;
  monthlyPayment: number;
  totalInterest: number;
  totalRepayment: number;
  paymentSchedule: PaymentScheduleItem[];
}

// Validation Rules
export interface ValidationRule {
  min?: number;
  max?: number;
  required: boolean;
  options?: string[];
  errorMessage: string;
}

export interface ValidationRulesResponse {
  personalInfo: {
    age: ValidationRule;
    employmentStatus: ValidationRule;
    employmentDuration: ValidationRule;
  };
  financialInfo: {
    monthlyIncome: ValidationRule;
    monthlyExpenses: ValidationRule;
    creditScore: ValidationRule;
  };
  loanDetails: {
    requestedAmount: ValidationRule;
    loanTerm: ValidationRule;
  };
}
