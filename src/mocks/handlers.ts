import { http, HttpResponse } from 'msw';
import { fakeApi } from '@/api/fakeApi';
import { loanFakeApi } from '@/api/loanApi';
import { branchFakeApi } from '@/api/branchApi';
import { Period, SortBy } from '@/types/api';
import type { EligibilityRequest, RateCalculationRequest } from '@/types/loan';

export const handlers = [
  http.get('/api/customers/:customerId/profile', async ({ params }) => {
    const { customerId } = params;
    const data = await fakeApi.getCustomerProfile(customerId as string);
    return HttpResponse.json(data);
  }),

  http.get('/api/customers/:customerId/spending/summary', async ({ request }) => {
    const url = new URL(request.url);
    const period = (url.searchParams.get('period') as Period) || Period.ThirtyDays;
    const data = await fakeApi.getSpendingSummary(period);
    return HttpResponse.json(data);
  }),

  http.get('/api/customers/:customerId/spending/categories', async ({ request }) => {
    const url = new URL(request.url);
    const period = url.searchParams.get('period') as Period | undefined;
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const data = await fakeApi.getSpendingByCategory({
      period,
      startDate,
      endDate,
    });
    return HttpResponse.json(data);
  }),

  http.get('/api/customers/:customerId/spending/trends', async ({ request }) => {
    const url = new URL(request.url);
    const months = parseInt(url.searchParams.get('months') || '12', 10);
    const data = await fakeApi.getMonthlyTrends(months);
    return HttpResponse.json(data);
  }),

  http.get('/api/customers/:customerId/transactions', async ({ request }) => {
    const url = new URL(request.url);
    const limit = url.searchParams.get('limit')
      ? parseInt(url.searchParams.get('limit')!, 10)
      : undefined;
    const offset = url.searchParams.get('offset')
      ? parseInt(url.searchParams.get('offset')!, 10)
      : undefined;
    const category = url.searchParams.get('category');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const sortBy = url.searchParams.get('sortBy') as unknown as SortBy;
    const data = await fakeApi.getTransactions({
      limit,
      offset,
      category,
      startDate,
      endDate,
      sortBy,
    });
    return HttpResponse.json(data);
  }),

  http.get('/api/customers/:customerId/goals', async () => {
    const data = await fakeApi.getGoals();
    return HttpResponse.json(data);
  }),

  http.get('/api/customers/:customerId/filters', async () => {
    const data = await fakeApi.getFilters();
    return HttpResponse.json(data);
  }),

  // Loan Eligibility Simulator endpoints
  http.post('/api/loans/eligibility', async ({ request }) => {
    const body = (await request.json()) as EligibilityRequest;
    const data = await loanFakeApi.checkEligibility(body);
    return HttpResponse.json(data);
  }),

  http.get('/api/loans/products', async () => {
    const data = await loanFakeApi.getLoanProducts();
    return HttpResponse.json(data);
  }),

  http.post('/api/loans/calculate-rate', async ({ request }) => {
    const body = (await request.json()) as RateCalculationRequest;
    const data = await loanFakeApi.calculateRate(body);
    return HttpResponse.json(data);
  }),

  http.get('/api/loans/validation-rules', async () => {
    const data = await loanFakeApi.getValidationRules();
    return HttpResponse.json(data);
  }),

  // Branch Locator endpoints
  http.get('/api/branches', async () => {
    const data = await branchFakeApi.getBranches();
    return HttpResponse.json(data);
  }),

  http.get('/api/branches/:branchId/popular-times', async ({ params }) => {
    const branchId = parseInt(params.branchId as string, 10);
    const data = await branchFakeApi.getPopularTimes(branchId);
    return HttpResponse.json(data);
  }),
];
