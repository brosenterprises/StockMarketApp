// Stock Market Data Types
export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  peRatio?: number;
  dividendYield?: number;
  high52Week: number;
  low52Week: number;
  lastUpdated: string;
}

export interface Portfolio {
  id: string;
  name: string;
  totalValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  positions: Position[];
  createdAt: string;
  updatedAt: string;
}

export interface Position {
  id: string;
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  totalValue: number;
  gainLoss: number;
  gainLossPercent: number;
  purchaseDate: string;
}

export interface Watchlist {
  id: string;
  name: string;
  stocks: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MarketNews {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
  relatedSymbols: string[];
}

export interface ChartData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

// Navigation Types
export type RootStackParamList = {
  Home: undefined;
  StockDetail: { symbol: string };
  Portfolio: undefined;
  Watchlist: undefined;
  News: undefined;
  Search: undefined;
  Settings: undefined;
  Profile: undefined;
};

export type TabParamList = {
  Markets: undefined;
  Portfolio: undefined;
  Watchlist: undefined;
  News: undefined;
  More: undefined;
};

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface StockQuoteResponse {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: UserPreferences;
  createdAt: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  currency: string;
  notifications: NotificationSettings;
  defaultWatchlist?: string;
}

export interface NotificationSettings {
  priceAlerts: boolean;
  newsAlerts: boolean;
  portfolioUpdates: boolean;
  marketOpen: boolean;
  marketClose: boolean;
}

// Alert Types
export interface PriceAlert {
  id: string;
  symbol: string;
  type: 'above' | 'below';
  targetPrice: number;
  currentPrice: number;
  isActive: boolean;
  createdAt: string;
}

// Chart Types
export type ChartTimeframe = '1D' | '5D' | '1M' | '3M' | '6M' | '1Y' | '5Y';

export interface ChartConfig {
  timeframe: ChartTimeframe;
  showVolume: boolean;
  showMovingAverages: boolean;
  indicators: TechnicalIndicator[];
}

export type TechnicalIndicator = 'SMA' | 'EMA' | 'RSI' | 'MACD' | 'BB';

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// Theme Types
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  success: string;
  error: string;
  warning: string;
  border: string;
}

// Search Types
export interface SearchResult {
  symbol: string;
  name: string;
  type: 'stock' | 'etf' | 'mutual_fund';
  exchange: string;
}

// Market Status
export interface MarketStatus {
  isOpen: boolean;
  nextOpenTime?: string;
  nextCloseTime?: string;
  timezone: string;
}
