import type {
  LoanEligibilityRequest,
  LoanEligibilityResponse,
  Branch,
  DashboardStats,
} from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const loanEligibilityApi = {
  checkEligibility: async (
    data: LoanEligibilityRequest,
  ): Promise<LoanEligibilityResponse> => {
    const response = await fetch(`${API_BASE_URL}/loan/eligibility`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to check eligibility');
    }

    return response.json();
  },

  checkEligibilityMock: async (
    data: LoanEligibilityRequest,
  ): Promise<LoanEligibilityResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const { income, loanAmount, creditScore, employmentYears } = data;
    const monthlyPayment = loanAmount / 12 / 5; // 5-year loan
    const dtiRatio = (monthlyPayment / (income / 12)) * 100;

    const isEligible = creditScore >= 650 && dtiRatio < 40 && employmentYears >= 2;

    return {
      eligible: isEligible,
      maxLoanAmount: isEligible ? Math.floor(income * 3.5) : 0,
      estimatedRate: isEligible
        ? creditScore >= 750
          ? 4.5
          : creditScore >= 700
            ? 5.5
            : 6.5
        : null,
      monthlyPayment: isEligible ? monthlyPayment : 0,
      dtiRatio: dtiRatio.toFixed(2),
      message: isEligible
        ? 'Congratulations! You are eligible for the loan.'
        : 'Unfortunately, you do not meet the eligibility criteria at this time.',
      factors: {
        creditScore: creditScore >= 650,
        debtToIncome: dtiRatio < 40,
        employment: employmentYears >= 2,
      },
    };
  },
};

export const branchApi = {
  getBranches: async (location?: string): Promise<Branch[]> => {
    const url = location
      ? `${API_BASE_URL}/branches?location=${location}`
      : `${API_BASE_URL}/branches`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch branches');
    }

    return response.json();
  },
};

// Dashboard/Stats API
export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`);

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }

    return response.json();
  },

  // Mock implementation for demo purposes
  getStatsMock: async (): Promise<DashboardStats> => {
    await new Promise(resolve => setTimeout(resolve, 600));

    return {
      totalLoans: 1245,
      activeLoans: 892,
      totalDisbursed: 45678900,
      pendingApplications: 67,
      recentApplications: [
        {
          id: 1,
          applicant: 'John Doe',
          amount: 50000,
          status: 'Approved',
          date: '2026-02-10',
        },
        {
          id: 2,
          applicant: 'Jane Smith',
          amount: 75000,
          status: 'Pending',
          date: '2026-02-11',
        },
        {
          id: 3,
          applicant: 'Bob Johnson',
          amount: 30000,
          status: 'Under Review',
          date: '2026-02-12',
        },
        {
          id: 4,
          applicant: 'Alice Brown',
          amount: 100000,
          status: 'Approved',
          date: '2026-02-12',
        },
        {
          id: 5,
          applicant: 'Charlie Davis',
          amount: 25000,
          status: 'Rejected',
          date: '2026-02-13',
        },
      ],
      loanDistribution: {
        personal: 45,
        home: 30,
        auto: 15,
        business: 10,
      },
    };
  },
};
