export enum Period {
  SevenDays = '7d',
  ThirtyDays = '30d',
  NinetyDays = '90d',
  OneYear = '1y',
}
export enum SortBy {
  DateDesc = 'date_desc',
  DateAsc = 'date_asc',
  AmountDesc = 'amount_desc',
  AmountAsc = 'amount_asc',
}
export interface Category {
  name: string;
  color: string;
  icon: string;
}

export interface DateRangePreset {
  label: string;
  value: string;
}

export interface Profile {
  customerId: string;
  name: string;
  email: string;
  joinDate: string;
  accountType: 'premium' | 'basic' | 'gold';
  totalSpent: number;
  currency: string;
}

export interface Summary {
  period: Period;
  totalSpent: number;
  transactionCount: number;
  averageTransaction: number;
  topCategory: string;
  comparedToPrevious: {
    spentChange: number;
    transactionChange: number;
  };
}

export interface CategorySpending {
  name: string;
  amount: number;
  percentage: number;
  transactionCount: number;
  color: string;
  icon: string;
}

export interface CategoriesResponse {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  totalAmount: number;
  categories: CategorySpending[];
}

export interface Trend {
  month: string;
  totalSpent: number;
  transactionCount: number;
  averageTransaction: number;
}

export interface TrendsResponse {
  trends: Trend[];
}

export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  category: string;
  amount: number;
  description: string;
  paymentMethod: string;
  icon: string;
  categoryColor: string;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface Goal {
  id: string;
  category: string;
  monthlyBudget: number;
  currentSpent: number;
  percentageUsed: number;
  daysRemaining: number;
  status: 'on_track' | 'warning';
}

export interface GoalsResponse {
  goals: Goal[];
}

export interface FiltersResponse {
  categories: Category[];
  dateRangePresets: DateRangePreset[];
}

export interface CategoriesParams {
  period?: Period;
  startDate?: string | null;
  endDate?: string | null;
}

export interface TransactionsParams {
  limit?: number;
  offset?: number;
  category?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  sortBy?: SortBy;
}

export interface FiltersState {
  customerId: string;
  period: Period;
  selectedCategory: string | null;
  dateRange: {
    startDate: string | null;
    endDate: string | null;
  };
}
