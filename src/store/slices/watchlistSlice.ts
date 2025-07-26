import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Watchlist } from '@/types';

interface WatchlistState {
  watchlists: Watchlist[];
  currentWatchlist: Watchlist | null;
  loading: boolean;
  error: string | null;
}

const initialState: WatchlistState = {
  watchlists: [],
  currentWatchlist: null,
  loading: false,
  error: null,
};

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    addToWatchlist: (state, action: PayloadAction<{ watchlistId: string; symbol: string }>) => {
      const { watchlistId, symbol } = action.payload;
      const watchlist = state.watchlists.find(w => w.id === watchlistId);
      if (watchlist && !watchlist.stocks.includes(symbol)) {
        watchlist.stocks.push(symbol);
        watchlist.updatedAt = new Date().toISOString();
      }
    },
    removeFromWatchlist: (state, action: PayloadAction<{ watchlistId: string; symbol: string }>) => {
      const { watchlistId, symbol } = action.payload;
      const watchlist = state.watchlists.find(w => w.id === watchlistId);
      if (watchlist) {
        watchlist.stocks = watchlist.stocks.filter(s => s !== symbol);
        watchlist.updatedAt = new Date().toISOString();
      }
    },
    createWatchlist: (state, action: PayloadAction<string>) => {
      const newWatchlist: Watchlist = {
        id: Date.now().toString(),
        name: action.payload,
        stocks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.watchlists.push(newWatchlist);
    },
  },
});

export const { addToWatchlist, removeFromWatchlist, createWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;
