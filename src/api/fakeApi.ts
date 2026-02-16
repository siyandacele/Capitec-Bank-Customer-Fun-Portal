import {
  Profile,
  Summary,
  CategoriesResponse,
  TrendsResponse,
  TransactionsResponse,
  GoalsResponse,
  FiltersResponse,
  Category,
  Transaction,
  CategoriesParams,
  TransactionsParams,
  Period,
  SortBy,
} from '@/types/api';

const CATEGORIES: Category[] = [
  { name: 'Groceries', color: '#FF6B6B', icon: 'shopping-cart' },
  { name: 'Entertainment', color: '#4ECDC4', icon: 'film' },
  { name: 'Transportation', color: '#45B7D1', icon: 'car' },
  { name: 'Dining', color: '#F7DC6F', icon: 'utensils' },
  { name: 'Shopping', color: '#BB8FCE', icon: 'shopping-bag' },
  { name: 'Utilities', color: '#85C1E9', icon: 'zap' },
];

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const ALL_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn_001',
    date: '2024-09-16T14:30:00Z',
    merchant: 'Pick n Pay',
    category: 'Groceries',
    amount: 245.8,
    description: 'Weekly groceries',
    paymentMethod: 'Credit Card',
    icon: 'shopping-cart',
    categoryColor: '#FF6B6B',
  },
  {
    id: 'txn_002',
    date: '2024-09-15T10:15:00Z',
    merchant: 'Netflix',
    category: 'Entertainment',
    amount: 199.0,
    description: 'Monthly subscription',
    paymentMethod: 'Debit Order',
    icon: 'film',
    categoryColor: '#4ECDC4',
  },
  {
    id: 'txn_003',
    date: '2024-09-14T08:45:00Z',
    merchant: 'Shell',
    category: 'Transportation',
    amount: 850.0,
    description: 'Fuel',
    paymentMethod: 'Credit Card',
    icon: 'car',
    categoryColor: '#45B7D1',
  },
  {
    id: 'txn_004',
    date: '2024-09-13T19:20:00Z',
    merchant: 'Ocean Basket',
    category: 'Dining',
    amount: 420.5,
    description: 'Family dinner',
    paymentMethod: 'Credit Card',
    icon: 'utensils',
    categoryColor: '#F7DC6F',
  },
  {
    id: 'txn_005',
    date: '2024-09-12T11:00:00Z',
    merchant: 'Takealot',
    category: 'Shopping',
    amount: 1299.0,
    description: 'Electronics',
    paymentMethod: 'Credit Card',
    icon: 'shopping-bag',
    categoryColor: '#BB8FCE',
  },
  {
    id: 'txn_006',
    date: '2024-09-11T09:00:00Z',
    merchant: 'Eskom',
    category: 'Utilities',
    amount: 1250.0,
    description: 'Electricity',
    paymentMethod: 'Debit Order',
    icon: 'zap',
    categoryColor: '#85C1E9',
  },
  {
    id: 'txn_007',
    date: '2024-09-10T16:30:00Z',
    merchant: 'Woolworths',
    category: 'Groceries',
    amount: 387.25,
    description: 'Groceries',
    paymentMethod: 'Credit Card',
    icon: 'shopping-cart',
    categoryColor: '#FF6B6B',
  },
  {
    id: 'txn_008',
    date: '2024-09-09T20:00:00Z',
    merchant: 'Showmax',
    category: 'Entertainment',
    amount: 99.0,
    description: 'Monthly subscription',
    paymentMethod: 'Debit Order',
    icon: 'film',
    categoryColor: '#4ECDC4',
  },
  {
    id: 'txn_009',
    date: '2024-09-08T07:15:00Z',
    merchant: 'Uber',
    category: 'Transportation',
    amount: 125.4,
    description: 'Ride to work',
    paymentMethod: 'Credit Card',
    icon: 'car',
    categoryColor: '#45B7D1',
  },
  {
    id: 'txn_010',
    date: '2024-09-07T13:45:00Z',
    merchant: "Nando's",
    category: 'Dining',
    amount: 185.0,
    description: 'Dinner',
    paymentMethod: 'Credit Card',
    icon: 'utensils',
    categoryColor: '#F7DC6F',
  },
  {
    id: 'txn_011',
    date: '2024-09-06T10:30:00Z',
    merchant: 'Checkers',
    category: 'Groceries',
    amount: 562.1,
    description: 'Monthly groceries',
    paymentMethod: 'Credit Card',
    icon: 'shopping-cart',
    categoryColor: '#FF6B6B',
  },
  {
    id: 'txn_012',
    date: '2024-09-05T18:00:00Z',
    merchant: 'Ster-Kinekor',
    category: 'Entertainment',
    amount: 320.0,
    description: 'Movie tickets',
    paymentMethod: 'Credit Card',
    icon: 'film',
    categoryColor: '#4ECDC4',
  },
  {
    id: 'txn_013',
    date: '2024-09-04T06:30:00Z',
    merchant: 'Engen',
    category: 'Transportation',
    amount: 720.0,
    description: 'Fuel',
    paymentMethod: 'Credit Card',
    icon: 'car',
    categoryColor: '#45B7D1',
  },
  {
    id: 'txn_014',
    date: '2024-09-03T12:15:00Z',
    merchant: 'Spur',
    category: 'Dining',
    amount: 295.8,
    description: 'Lunch',
    paymentMethod: 'Credit Card',
    icon: 'utensils',
    categoryColor: '#F7DC6F',
  },
  {
    id: 'txn_015',
    date: '2024-09-02T15:00:00Z',
    merchant: 'Mr Price',
    category: 'Shopping',
    amount: 450.0,
    description: 'Clothing',
    paymentMethod: 'Credit Card',
    icon: 'shopping-bag',
    categoryColor: '#BB8FCE',
  },
  {
    id: 'txn_016',
    date: '2024-09-01T09:00:00Z',
    merchant: 'Vodacom',
    category: 'Utilities',
    amount: 599.0,
    description: 'Mobile bill',
    paymentMethod: 'Debit Order',
    icon: 'zap',
    categoryColor: '#85C1E9',
  },
  {
    id: 'txn_017',
    date: '2024-08-31T17:20:00Z',
    merchant: 'Spar',
    category: 'Groceries',
    amount: 198.5,
    description: 'Household essentials',
    paymentMethod: 'Debit Order',
    icon: 'shopping-cart',
    categoryColor: '#FF6B6B',
  },
  {
    id: 'txn_018',
    date: '2024-08-30T21:00:00Z',
    merchant: 'Spotify',
    category: 'Entertainment',
    amount: 79.99,
    description: 'Music subscription',
    paymentMethod: 'Debit Order',
    icon: 'film',
    categoryColor: '#4ECDC4',
  },
  {
    id: 'txn_019',
    date: '2024-08-29T08:00:00Z',
    merchant: 'Bolt',
    category: 'Transportation',
    amount: 98.6,
    description: 'Ride home',
    paymentMethod: 'Credit Card',
    icon: 'car',
    categoryColor: '#45B7D1',
  },
  {
    id: 'txn_020',
    date: '2024-08-28T19:30:00Z',
    merchant: 'Steers',
    category: 'Dining',
    amount: 132.0,
    description: 'Takeaway',
    paymentMethod: 'Credit Card',
    icon: 'utensils',
    categoryColor: '#F7DC6F',
  },
  {
    id: 'txn_021',
    date: '2024-08-27T14:00:00Z',
    merchant: 'Edgars',
    category: 'Shopping',
    amount: 780.0,
    description: 'Clothing',
    paymentMethod: 'Credit Card',
    icon: 'shopping-bag',
    categoryColor: '#BB8FCE',
  },
  {
    id: 'txn_022',
    date: '2024-08-26T09:00:00Z',
    merchant: 'City of Cape Town',
    category: 'Utilities',
    amount: 1850.0,
    description: 'Water & rates',
    paymentMethod: 'Debit Order',
    icon: 'zap',
    categoryColor: '#85C1E9',
  },
  {
    id: 'txn_023',
    date: '2024-08-25T11:30:00Z',
    merchant: "Food Lover's Market",
    category: 'Groceries',
    amount: 425.75,
    description: 'Fresh produce',
    paymentMethod: 'Credit Card',
    icon: 'shopping-cart',
    categoryColor: '#FF6B6B',
  },
  {
    id: 'txn_024',
    date: '2024-08-24T16:45:00Z',
    merchant: 'Sasol',
    category: 'Transportation',
    amount: 680.0,
    description: 'Fuel',
    paymentMethod: 'Credit Card',
    icon: 'car',
    categoryColor: '#45B7D1',
  },
  {
    id: 'txn_025',
    date: '2024-08-23T20:15:00Z',
    merchant: 'Wimpy',
    category: 'Dining',
    amount: 165.5,
    description: 'Breakfast',
    paymentMethod: 'Cash',
    icon: 'utensils',
    categoryColor: '#F7DC6F',
  },
  {
    id: 'txn_026',
    date: '2024-08-22T10:00:00Z',
    merchant: 'Dis-Chem',
    category: 'Shopping',
    amount: 342.8,
    description: 'Pharmacy',
    paymentMethod: 'Credit Card',
    icon: 'shopping-bag',
    categoryColor: '#BB8FCE',
  },
  {
    id: 'txn_027',
    date: '2024-08-21T09:00:00Z',
    merchant: 'MTN',
    category: 'Utilities',
    amount: 299.0,
    description: 'Mobile data',
    paymentMethod: 'Debit Order',
    icon: 'zap',
    categoryColor: '#85C1E9',
  },
  {
    id: 'txn_028',
    date: '2024-08-20T13:00:00Z',
    merchant: 'Pick n Pay',
    category: 'Groceries',
    amount: 310.4,
    description: 'Weekly groceries',
    paymentMethod: 'Credit Card',
    icon: 'shopping-cart',
    categoryColor: '#FF6B6B',
  },
  {
    id: 'txn_029',
    date: '2024-08-19T07:30:00Z',
    merchant: 'Uber',
    category: 'Transportation',
    amount: 145.2,
    description: 'Ride to work',
    paymentMethod: 'Credit Card',
    icon: 'car',
    categoryColor: '#45B7D1',
  },
  {
    id: 'txn_030',
    date: '2024-08-18T18:45:00Z',
    merchant: 'Game',
    category: 'Shopping',
    amount: 899.99,
    description: 'Household items',
    paymentMethod: 'Credit Card',
    icon: 'shopping-bag',
    categoryColor: '#BB8FCE',
  },
  {
    id: 'txn_031',
    date: '2024-08-17T09:00:00Z',
    merchant: 'Telkom',
    category: 'Utilities',
    amount: 999.0,
    description: 'Fibre internet',
    paymentMethod: 'Debit Order',
    icon: 'zap',
    categoryColor: '#85C1E9',
  },
  {
    id: 'txn_032',
    date: '2024-08-16T15:30:00Z',
    merchant: 'Woolworths',
    category: 'Groceries',
    amount: 478.9,
    description: 'Groceries',
    paymentMethod: 'Credit Card',
    icon: 'shopping-cart',
    categoryColor: '#FF6B6B',
  },
  {
    id: 'txn_033',
    date: '2024-08-15T12:00:00Z',
    merchant: 'Netflix',
    category: 'Entertainment',
    amount: 199.0,
    description: 'Monthly subscription',
    paymentMethod: 'Debit Order',
    icon: 'film',
    categoryColor: '#4ECDC4',
  },
  {
    id: 'txn_034',
    date: '2024-08-14T19:00:00Z',
    merchant: 'Ocean Basket',
    category: 'Dining',
    amount: 380.0,
    description: 'Family dinner',
    paymentMethod: 'Credit Card',
    icon: 'utensils',
    categoryColor: '#F7DC6F',
  },
  {
    id: 'txn_035',
    date: '2024-08-13T08:00:00Z',
    merchant: 'Shell',
    category: 'Transportation',
    amount: 790.0,
    description: 'Fuel',
    paymentMethod: 'Credit Card',
    icon: 'car',
    categoryColor: '#45B7D1',
  },
];

export const fakeApi = {
  async getCustomerProfile(customerId: string): Promise<Profile> {
    await delay(200);
    return {
      customerId,
      name: 'John Doe',
      email: 'john.doe@email.com',
      joinDate: '2023-01-15',
      accountType: 'premium',
      totalSpent: 15420.5,
      currency: 'ZAR',
    };
  },

  async getSpendingSummary(period: Period = Period.ThirtyDays): Promise<Summary> {
    await delay(200);
    const totalSpent = 4250.75;
    const transactionCount = 47;

    return {
      period,
      totalSpent,
      transactionCount,
      averageTransaction: parseFloat((totalSpent / transactionCount).toFixed(2)),
      topCategory: 'Groceries',
      comparedToPrevious: {
        spentChange: 12.5,
        transactionChange: -3.2,
      },
    };
  },

  async getSpendingByCategory(params?: CategoriesParams): Promise<CategoriesResponse> {
    await delay(200);
    return {
      dateRange: {
        startDate: params?.startDate || '2024-08-16',
        endDate: params?.endDate || '2024-09-16',
      },
      totalAmount: 4250.75,
      categories: [
        {
          name: 'Groceries',
          amount: 1250.3,
          percentage: 29.4,
          transactionCount: 15,
          color: '#FF6B6B',
          icon: 'shopping-cart',
        },
        {
          name: 'Entertainment',
          amount: 890.2,
          percentage: 20.9,
          transactionCount: 8,
          color: '#4ECDC4',
          icon: 'film',
        },
        {
          name: 'Transportation',
          amount: 680.45,
          percentage: 16.0,
          transactionCount: 12,
          color: '#45B7D1',
          icon: 'car',
        },
        {
          name: 'Dining',
          amount: 520.3,
          percentage: 12.2,
          transactionCount: 9,
          color: '#F7DC6F',
          icon: 'utensils',
        },
        {
          name: 'Shopping',
          amount: 450.8,
          percentage: 10.6,
          transactionCount: 6,
          color: '#BB8FCE',
          icon: 'shopping-bag',
        },
        {
          name: 'Utilities',
          amount: 458.7,
          percentage: 10.8,
          transactionCount: 3,
          color: '#85C1E9',
          icon: 'zap',
        },
      ],
    };
  },

  async getMonthlyTrends(months = 12): Promise<TrendsResponse> {
    await delay(200);
    const trends = [
      {
        month: '2024-01',
        totalSpent: 3890.25,
        transactionCount: 42,
        averageTransaction: 92.62,
      },
      {
        month: '2024-02',
        totalSpent: 4150.8,
        transactionCount: 38,
        averageTransaction: 109.23,
      },
      {
        month: '2024-03',
        totalSpent: 3750.6,
        transactionCount: 45,
        averageTransaction: 83.35,
      },
      {
        month: '2024-04',
        totalSpent: 4200.45,
        transactionCount: 39,
        averageTransaction: 107.7,
      },
      {
        month: '2024-05',
        totalSpent: 3980.3,
        transactionCount: 44,
        averageTransaction: 90.46,
      },
      {
        month: '2024-06',
        totalSpent: 4250.75,
        transactionCount: 47,
        averageTransaction: 90.44,
      },
    ];
    return { trends: trends.slice(0, months) };
  },

  async getTransactions(params?: TransactionsParams): Promise<TransactionsResponse> {
    await delay(200);
    const limit = params?.limit ?? 20;
    const offset = params?.offset ?? 0;
    const sortBy = params?.sortBy ?? SortBy.DateDesc;

    const filteredTransactions = [...ALL_TRANSACTIONS]
      .filter(t => !params?.category || t.category === params.category)
      .filter(
        t =>
          !params?.startDate ||
          new Date(t.date).getTime() >= new Date(params.startDate).getTime(),
      )
      .filter(
        t =>
          !params?.endDate ||
          new Date(t.date).getTime() <= new Date(params.endDate).getTime(),
      )
      .sort((a, b) => {
        switch (sortBy) {
          case SortBy.DateDesc:
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          case SortBy.DateAsc:
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          case SortBy.AmountDesc:
            return b.amount - a.amount;
          case SortBy.AmountAsc:
            return a.amount - b.amount;
          default:
            return 0;
        }
      });

    const total = filteredTransactions.length;
    const paginated = filteredTransactions.slice(offset, offset + limit);

    return {
      transactions: paginated,
      pagination: { total, limit, offset, hasMore: offset + limit < total },
    };
  },

  async getGoals(): Promise<GoalsResponse> {
    await delay(200);
    return {
      goals: [
        {
          id: 'goal_001',
          category: 'Entertainment',
          monthlyBudget: 1000,
          currentSpent: 650.3,
          percentageUsed: 65.03,
          daysRemaining: 12,
          status: 'on_track',
        },
        {
          id: 'goal_002',
          category: 'Groceries',
          monthlyBudget: 1500,
          currentSpent: 1450.8,
          percentageUsed: 96.72,
          daysRemaining: 12,
          status: 'warning',
        },
      ],
    };
  },

  async getFilters(): Promise<FiltersResponse> {
    await delay(100);
    return {
      categories: CATEGORIES,
      dateRangePresets: [
        { label: 'Last 7 days', value: '7d' },
        { label: 'Last 30 days', value: '30d' },
        { label: 'Last 90 days', value: '90d' },
        { label: 'Last year', value: '1y' },
      ],
    };
  },
};
