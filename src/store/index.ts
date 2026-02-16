import { configureStore } from '@reduxjs/toolkit';
import filtersReducer from './slices/filtersSlice';
import profileReducer from './slices/profileSlice';
import loanPageReducer from './slices/loanPageSlice';
import branchPageReducer from './slices/branchPageSlice';

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
    profile: profileReducer,
    loanPage: loanPageReducer,
    branchPage: branchPageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
