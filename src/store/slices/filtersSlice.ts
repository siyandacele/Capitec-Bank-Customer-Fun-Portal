import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FiltersState, Period } from '@/types/api';

const initialState: FiltersState = {
  customerId: '12345',
  period: Period.ThirtyDays,
  selectedCategory: null,
  dateRange: {
    startDate: null,
    endDate: null,
  },
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setPeriod: (state, action: PayloadAction<Period>) => {
      state.period = action.payload;
      state.dateRange = { startDate: null, endDate: null };
    },
    setDateRange: (
      state,
      action: PayloadAction<{ startDate: string | null; endDate: string | null }>,
    ) => {
      state.dateRange = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    setCustomerId: (state, action: PayloadAction<string>) => {
      state.customerId = action.payload;
    },
    resetFilters: state => {
      state.period = Period.ThirtyDays;
      state.selectedCategory = null;
      state.dateRange = { startDate: null, endDate: null };
    },
  },
});

export const {
  setPeriod,
  setDateRange,
  setSelectedCategory,
  setCustomerId,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
