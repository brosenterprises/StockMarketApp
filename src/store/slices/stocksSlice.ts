import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Stock, ChartData, MarketIndex, SearchResult } from '@/types';
import { stockService } from '@/services/stockService';

interface StocksState {
  stocks: Record<string, Stock>;
  marketIndices: MarketIndex[];
  chartData: Record<string, ChartData[]>;
  searchResults: SearchResult[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: StocksState = {
  stocks: {},
  marketIndices: [],
  chartData: {},
  searchResults: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

// Async thunks
export const fetchStock = createAsyncThunk(
  'stocks/fetchStock',
  async (symbol: string) => {
    const response = await stockService.getStock(symbol);
    return response;
  }
);

export const fetchMultipleStocks = createAsyncThunk(
  'stocks/fetchMultipleStocks',
  async (symbols: string[]) => {
    const response = await stockService.getMultipleStocks(symbols);
    return response;
  }
);

export const fetchMarketIndices = createAsyncThunk(
  'stocks/fetchMarketIndices',
  async () => {
    const response = await stockService.getMarketIndices();
    return response;
  }
);

export const fetchChartData = createAsyncThunk(
  'stocks/fetchChartData',
  async ({ symbol, timeframe }: { symbol: string; timeframe: string }) => {
    const response = await stockService.getChartData(symbol, timeframe);
    return { symbol, data: response };
  }
);

export const searchStocks = createAsyncThunk(
  'stocks/searchStocks',
  async (query: string) => {
    const response = await stockService.searchStocks(query);
    return response;
  }
);

const stocksSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    updateStockPrice: (state, action: PayloadAction<{ symbol: string; price: number; change: number; changePercent: number }>) => {
      const { symbol, price, change, changePercent } = action.payload;
      if (state.stocks[symbol]) {
        state.stocks[symbol].price = price;
        state.stocks[symbol].change = change;
        state.stocks[symbol].changePercent = changePercent;
        state.stocks[symbol].lastUpdated = new Date().toISOString();
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch single stock
      .addCase(fetchStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStock.fulfilled, (state, action) => {
        state.loading = false;
        state.stocks[action.payload.symbol] = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch stock';
      })
      
      // Fetch multiple stocks
      .addCase(fetchMultipleStocks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMultipleStocks.fulfilled, (state, action) => {
        state.loading = false;
        action.payload.forEach(stock => {
          state.stocks[stock.symbol] = stock;
        });
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchMultipleStocks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch stocks';
      })
      
      // Fetch market indices
      .addCase(fetchMarketIndices.fulfilled, (state, action) => {
        state.marketIndices = action.payload;
      })
      
      // Fetch chart data
      .addCase(fetchChartData.fulfilled, (state, action) => {
        state.chartData[action.payload.symbol] = action.payload.data;
      })
      
      // Search stocks
      .addCase(searchStocks.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchStocks.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchStocks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Search failed';
      });
  },
});

export const { clearError, clearSearchResults, updateStockPrice } = stocksSlice.actions;
export default stocksSlice.reducer;
