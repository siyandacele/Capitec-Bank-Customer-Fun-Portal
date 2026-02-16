// Loan types
export interface LoanEligibilityRequest {
  income: number
  loanAmount: number
  creditScore: number
  employmentYears: number
  loanType: 'personal' | 'home' | 'auto' | 'business'
}

export interface LoanEligibilityResponse {
  eligible: boolean
  maxLoanAmount: number
  estimatedRate: number | null
  monthlyPayment: number
  dtiRatio: string
  message: string
  factors: {
    creditScore: boolean
    debtToIncome: boolean
    employment: boolean
  }
}

// Branch types
export type LocationType = 'branch' | 'atm'

export interface Branch {
  id: number
  type: LocationType
  name: string
  address: string
  phone?: string
  email?: string
  hours: string
  lat: number
  lng: number
  services: string[]
}

export interface HourBusyness {
  hour: number
  busyPercent: number
}

export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6
export type PopularTimesByDay = Record<DayIndex, HourBusyness[]>

// Dashboard types
export interface LoanApplication {
  id: number
  applicant: string
  amount: number
  status: 'Approved' | 'Pending' | 'Under Review' | 'Rejected'
  date: string
}

export interface LoanDistribution {
  personal: number
  home: number
  auto: number
  business: number
}

export interface DashboardStats {
  totalLoans: number
  activeLoans: number
  totalDisbursed: number
  pendingApplications: number
  recentApplications: LoanApplication[]
  loanDistribution: LoanDistribution
}

// API Response types
export type ApiResponse<T> =
  | {
      data: T
      error?: never
    }
  | {
      data?: never
      error: string
    }
