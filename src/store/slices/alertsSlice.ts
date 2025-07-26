import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PriceAlert } from '@/types';

interface AlertsState {
  alerts: PriceAlert[];
  loading: boolean;
  error: string | null;
}

const initialState: AlertsState = {
  alerts: [],
  loading: false,
  error: null,
};

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    addAlert: (state, action: PayloadAction<Omit<PriceAlert, 'id' | 'createdAt'>>) => {
      const newAlert: PriceAlert = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      state.alerts.push(newAlert);
    },
    removeAlert: (state, action: PayloadAction<string>) => {
      state.alerts = state.alerts.filter(alert => alert.id !== action.payload);
    },
    toggleAlert: (state, action: PayloadAction<string>) => {
      const alert = state.alerts.find(a => a.id === action.payload);
      if (alert) {
        alert.isActive = !alert.isActive;
      }
    },
    updateAlertPrice: (state, action: PayloadAction<{ symbol: string; currentPrice: number }>) => {
      const { symbol, currentPrice } = action.payload;
      state.alerts.forEach(alert => {
        if (alert.symbol === symbol) {
          alert.currentPrice = currentPrice;
        }
      });
    },
  },
});

export const { addAlert, removeAlert, toggleAlert, updateAlertPrice } = alertsSlice.actions;
export default alertsSlice.reducer;
