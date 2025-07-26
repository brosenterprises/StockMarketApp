import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MarketNews } from '@/types';

interface NewsState {
  news: MarketNews[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: NewsState = {
  news: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setNews: (state, action: PayloadAction<MarketNews[]>) => {
      state.news = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setNews, setLoading, setError } = newsSlice.actions;
export default newsSlice.reducer;
