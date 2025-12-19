import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import authReducer from '../features/auth/authSlice';
import fieldPlotReducer from '../features/fieldPlots/fieldPlotSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    fieldPlots: fieldPlotReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

