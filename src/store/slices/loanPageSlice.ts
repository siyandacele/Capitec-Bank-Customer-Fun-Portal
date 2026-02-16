import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { EligibilityResponse } from '@/types/loan';

interface LoanPageState {
  title: string;
  subtitle: string;
  eligibilityResult: EligibilityResponse | null;
}

const initialState: LoanPageState = {
  title: 'Loan Eligibility',
  subtitle: 'Check if you qualify and find the best loan for you.',
  eligibilityResult: null,
};

const loanPageSlice = createSlice({
  name: 'loanPage',
  initialState,
  reducers: {
    setLoanPageContext: (
      state,
      action: PayloadAction<{ title: string; subtitle: string }>,
    ) => {
      state.title = action.payload.title;
      state.subtitle = action.payload.subtitle;
    },
    setEligibilityResult: (
      state,
      action: PayloadAction<EligibilityResponse>,
    ) => {
      state.eligibilityResult = action.payload;
    },
    clearEligibilityResult: (state) => {
      state.eligibilityResult = null;
    },
  },
});

export const { setLoanPageContext, setEligibilityResult, clearEligibilityResult } =
  loanPageSlice.actions;
export default loanPageSlice.reducer;
