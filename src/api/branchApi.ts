import type { Branch, PopularTimesByDay } from '@/types';
import branchesData from '@/mocks/data/branches.json';
import popularTimesData from '@/mocks/data/popular-times.json';

const MOCK_BRANCHES: Branch[] = branchesData as Branch[];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const branchFakeApi = {
  async getBranches(): Promise<Branch[]> {
    await delay(600);
    return MOCK_BRANCHES;
  },

  async getPopularTimes(_branchId: number): Promise<PopularTimesByDay> {
    await delay(200);
    return popularTimesData as unknown as PopularTimesByDay;
  },
};
