import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Portfolio, Position } from '@/types';
import { portfolioService } from '@/services/portfolioService';

interface PortfolioState {
  portfolios: Portfolio[];
  currentPortfolio: Portfolio | null;
  loading: boolean;
  error: string | null;
}

const initialState: PortfolioState = {
  portfolios: [],
  currentPortfolio: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchPortfolios = createAsyncThunk(
  'portfolio/fetchPortfolios',
  async () => {
    const response = await portfolioService.getPortfolios();
    return response;
  }
);

export const createPortfolio = createAsyncThunk(
  'portfolio/createPortfolio',
  async (name: string) => {
    const response = await portfolioService.createPortfolio(name);
    return response;
  }
);

export const addPosition = createAsyncThunk(
  'portfolio/addPosition',
  async ({ portfolioId, symbol, quantity, price }: {
    portfolioId: string;
    symbol: string;
    quantity: number;
    price: number;
  }) => {
    const response = await portfolioService.addPosition(portfolioId, symbol, quantity, price);
    return response;
  }
);

export const updatePosition = createAsyncThunk(
  'portfolio/updatePosition',
  async ({ portfolioId, positionId, quantity, price }: {
    portfolioId: string;
    positionId: string;
    quantity: number;
    price: number;
  }) => {
    const response = await portfolioService.updatePosition(portfolioId, positionId, quantity, price);
    return response;
  }
);

export const removePosition = createAsyncThunk(
  'portfolio/removePosition',
  async ({ portfolioId, positionId }: {
    portfolioId: string;
    positionId: string;
  }) => {
    await portfolioService.removePosition(portfolioId, positionId);
    return { portfolioId, positionId };
  }
);

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    setCurrentPortfolio: (state, action: PayloadAction<string>) => {
      state.currentPortfolio = state.portfolios.find(p => p.id === action.payload) || null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updatePortfolioValues: (state, action: PayloadAction<{ portfolioId: string; positions: Position[] }>) => {
      const { portfolioId, positions } = action.payload;
      const portfolio = state.portfolios.find(p => p.id === portfolioId);
      if (portfolio) {
        portfolio.positions = positions;
        portfolio.totalValue = positions.reduce((sum, pos) => sum + pos.totalValue, 0);
        portfolio.totalGainLoss = positions.reduce((sum, pos) => sum + pos.gainLoss, 0);
        portfolio.totalGainLossPercent = portfolio.totalValue > 0 
          ? (portfolio.totalGainLoss / (portfolio.totalValue - portfolio.totalGainLoss)) * 100 
          : 0;
        portfolio.updatedAt = new Date().toISOString();
        
        if (state.currentPortfolio?.id === portfolioId) {
          state.currentPortfolio = portfolio;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch portfolios
      .addCase(fetchPortfolios.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPortfolios.fulfilled, (state, action) => {
        state.loading = false;
        state.portfolios = action.payload;
        if (action.payload.length > 0 && !state.currentPortfolio) {
          state.currentPortfolio = action.payload[0];
        }
      })
      .addCase(fetchPortfolios.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch portfolios';
      })
      
      // Create portfolio
      .addCase(createPortfolio.fulfilled, (state, action) => {
        state.portfolios.push(action.payload);
      })
      
      // Add position
      .addCase(addPosition.fulfilled, (state, action) => {
        const portfolio = state.portfolios.find(p => p.id === action.payload.portfolioId);
        if (portfolio) {
          portfolio.positions.push(action.payload.position);
          portfolio.updatedAt = new Date().toISOString();
        }
      })
      
      // Update position
      .addCase(updatePosition.fulfilled, (state, action) => {
        const portfolio = state.portfolios.find(p => p.id === action.payload.portfolioId);
        if (portfolio) {
          const positionIndex = portfolio.positions.findIndex(p => p.id === action.payload.position.id);
          if (positionIndex !== -1) {
            portfolio.positions[positionIndex] = action.payload.position;
            portfolio.updatedAt = new Date().toISOString();
          }
        }
      })
      
      // Remove position
      .addCase(removePosition.fulfilled, (state, action) => {
        const portfolio = state.portfolios.find(p => p.id === action.payload.portfolioId);
        if (portfolio) {
          portfolio.positions = portfolio.positions.filter(p => p.id !== action.payload.positionId);
          portfolio.updatedAt = new Date().toISOString();
        }
      });
  },
});

export const { setCurrentPortfolio, clearError, updatePortfolioValues } = portfolioSlice.actions;
export default portfolioSlice.reducer;
