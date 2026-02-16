import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BranchPageState {
  title: string;
  subtitle: string;
}

const initialState: BranchPageState = {
  title: 'Branch Locator',
  subtitle: 'Find a Capitec branch or ATM near you.',
};

const branchPageSlice = createSlice({
  name: 'branchPage',
  initialState,
  reducers: {
    setBranchPageContext: (
      state,
      action: PayloadAction<{ title: string; subtitle: string }>,
    ) => {
      state.title = action.payload.title;
      state.subtitle = action.payload.subtitle;
    },
  },
});

export const { setBranchPageContext } = branchPageSlice.actions;
export default branchPageSlice.reducer;
