import type {
  EligibilityRequest,
  EligibilityResponse,
  LoanProductsResponse,
  RateCalculationRequest,
  RateCalculationResponse,
  ValidationRulesResponse,
  PaymentScheduleItem,
} from '@/types/loan';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const loanFakeApi = {
  async checkEligibility(request: EligibilityRequest): Promise<EligibilityResponse> {
    await delay(800);

    const { personalInfo, financialInfo, loanDetails } = request;
    const disposableIncome = financialInfo.monthlyIncome - financialInfo.monthlyExpenses;
    const dtiRatio = ((financialInfo.existingDebt / financialInfo.monthlyIncome) * 100);
    const ltiRatio = ((loanDetails.requestedAmount / (financialInfo.monthlyIncome * 12)) * 100);

    const creditScore = financialInfo.creditScore ?? 600;
    const isEligible =
      personalInfo.employmentDuration >= 3 &&
      personalInfo.employmentStatus !== 'unemployed' &&
      dtiRatio < 40 &&
      disposableIncome > 3000 &&
      creditScore >= 580;

    let riskCategory: 'low' | 'medium' | 'high' = 'high';
    let approvalLikelihood = 30;
    let affordabilityScore: 'excellent' | 'good' | 'fair' | 'poor' = 'poor';

    if (isEligible) {
      if (creditScore >= 720 && dtiRatio < 20) {
        riskCategory = 'low';
        approvalLikelihood = 92;
        affordabilityScore = 'excellent';
      } else if (creditScore >= 650 && dtiRatio < 30) {
        riskCategory = 'low';
        approvalLikelihood = 85;
        affordabilityScore = 'good';
      } else if (creditScore >= 580 && dtiRatio < 40) {
        riskCategory = 'medium';
        approvalLikelihood = 65;
        affordabilityScore = 'fair';
      }
    }

    // Calculate interest rate based on risk
    let interestRate = 18.5;
    if (riskCategory === 'low') interestRate = 12.5;
    else if (riskCategory === 'medium') interestRate = 15.0;

    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanDetails.loanTerm;
    const monthlyPayment =
      (loanDetails.requestedAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);
    const totalRepayment = monthlyPayment * numPayments;
    const maxAmount = isEligible ? Math.min(disposableIncome * 0.4 * loanDetails.loanTerm, 300000) : 0;

    return {
      eligibilityResult: {
        isEligible,
        approvalLikelihood,
        riskCategory,
        decisionReason: isEligible
          ? 'Strong income-to-expense ratio and manageable existing debt'
          : 'Application does not meet minimum eligibility criteria',
      },
      recommendedLoan: {
        maxAmount: Math.round(maxAmount),
        recommendedAmount: loanDetails.requestedAmount,
        interestRate,
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
        totalRepayment: Math.round(totalRepayment * 100) / 100,
      },
      affordabilityAnalysis: {
        disposableIncome: Math.round(disposableIncome * 100) / 100,
        debtToIncomeRatio: Math.round(dtiRatio * 100) / 100,
        loanToIncomeRatio: Math.round(ltiRatio * 100) / 100,
        affordabilityScore,
      },
    };
  },

  async getLoanProducts(): Promise<LoanProductsResponse> {
    await delay(300);

    return {
      products: [
        {
          id: 'personal_loan',
          name: 'Personal Loan',
          description: 'Flexible personal financing for various needs',
          minAmount: 5000,
          maxAmount: 300000,
          minTerm: 6,
          maxTerm: 60,
          interestRateRange: { min: 10.5, max: 18.5 },
          purposes: ['debt_consolidation', 'home_improvement', 'education', 'medical', 'other'],
        },
        {
          id: 'vehicle_loan',
          name: 'Vehicle Finance',
          description: 'Financing for new and used vehicles',
          minAmount: 50000,
          maxAmount: 1500000,
          minTerm: 12,
          maxTerm: 72,
          interestRateRange: { min: 8.5, max: 15.0 },
          purposes: ['new_vehicle', 'used_vehicle'],
        },
      ],
    };
  },

  async calculateRate(request: RateCalculationRequest): Promise<RateCalculationResponse> {
    await delay(500);

    const { loanAmount, loanTerm, creditScore, loanType } = request;

    // Base rate depends on loan type
    let baseRate = loanType === 'vehicle_loan' ? 10.0 : 14.0;

    // Adjust based on credit score
    if (creditScore >= 750) baseRate -= 3.0;
    else if (creditScore >= 700) baseRate -= 2.0;
    else if (creditScore >= 650) baseRate -= 1.0;
    else if (creditScore < 580) baseRate += 2.0;

    const interestRate = Math.max(baseRate, loanType === 'vehicle_loan' ? 8.5 : 10.5);
    const monthlyRate = interestRate / 100 / 12;
    const monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) /
      (Math.pow(1 + monthlyRate, loanTerm) - 1);
    const totalRepayment = monthlyPayment * loanTerm;
    const totalInterest = totalRepayment - loanAmount;

    // Build payment schedule (first 6 months + last month)
    const schedule: PaymentScheduleItem[] = [];
    let balance = loanAmount;
    const showMonths = Math.min(loanTerm, 6);

    for (let month = 1; month <= showMonths; month++) {
      const interest = balance * monthlyRate;
      const principal = monthlyPayment - interest;
      balance -= principal;
      schedule.push({
        month,
        payment: Math.round(monthlyPayment * 100) / 100,
        principal: Math.round(principal * 100) / 100,
        interest: Math.round(interest * 100) / 100,
        balance: Math.round(Math.max(balance, 0) * 100) / 100,
      });
    }

    return {
      interestRate: Math.round(interestRate * 100) / 100,
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalRepayment: Math.round(totalRepayment * 100) / 100,
      paymentSchedule: schedule,
    };
  },

  async getValidationRules(): Promise<ValidationRulesResponse> {
    await delay(100);

    return {
      personalInfo: {
        age: {
          min: 18,
          max: 65,
          required: true,
          errorMessage: 'Age must be between 18 and 65',
        },
        employmentStatus: {
          required: true,
          options: ['employed', 'self_employed', 'unemployed', 'retired'],
          errorMessage: 'Please select your employment status',
        },
        employmentDuration: {
          min: 3,
          required: true,
          errorMessage: 'Minimum 3 months employment required',
        },
      },
      financialInfo: {
        monthlyIncome: {
          min: 5000,
          required: true,
          errorMessage: 'Minimum monthly income of R5,000 required',
        },
        monthlyExpenses: {
          min: 0,
          required: true,
          errorMessage: 'Please enter your monthly expenses',
        },
        creditScore: {
          min: 300,
          max: 850,
          required: false,
          errorMessage: 'Credit score must be between 300 and 850',
        },
      },
      loanDetails: {
        requestedAmount: {
          min: 5000,
          max: 300000,
          required: true,
          errorMessage: 'Loan amount must be between R5,000 and R300,000',
        },
        loanTerm: {
          min: 6,
          max: 60,
          required: true,
          errorMessage: 'Loan term must be between 6 and 60 months',
        },
      },
    };
  },
};
