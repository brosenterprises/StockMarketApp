import { Stock, ChartData, MarketIndex, SearchResult } from '@/types';

// Mock data for development - replace with real API calls
const MOCK_STOCKS: Record<string, Stock> = {
  'AAPL': {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 175.43,
    change: 2.15,
    changePercent: 1.24,
    volume: 45678900,
    marketCap: 2800000000000,
    peRatio: 28.5,
    dividendYield: 0.52,
    high52Week: 198.23,
    low52Week: 124.17,
    lastUpdated: new Date().toISOString(),
  },
  'GOOGL': {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 2847.63,
    change: -15.42,
    changePercent: -0.54,
    volume: 1234567,
    marketCap: 1900000000000,
    peRatio: 25.8,
    dividendYield: 0,
    high52Week: 3030.93,
    low52Week: 2193.62,
    lastUpdated: new Date().toISOString(),
  },
  'MSFT': {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 378.85,
    change: 4.23,
    changePercent: 1.13,
    volume: 23456789,
    marketCap: 2900000000000,
    peRatio: 32.1,
    dividendYield: 0.68,
    high52Week: 384.30,
    low52Week: 213.43,
    lastUpdated: new Date().toISOString(),
  },
};

const MOCK_INDICES: MarketIndex[] = [
  {
    symbol: '^GSPC',
    name: 'S&P 500',
    value: 4567.89,
    change: 23.45,
    changePercent: 0.52,
  },
  {
    symbol: '^DJI',
    name: 'Dow Jones',
    value: 34567.12,
    change: -45.67,
    changePercent: -0.13,
  },
  {
    symbol: '^IXIC',
    name: 'NASDAQ',
    value: 14234.56,
    change: 67.89,
    changePercent: 0.48,
  },
];

class StockService {
  private baseUrl = 'https://api.example.com'; // Replace with actual API
  private apiKey = process.env.EXPO_PUBLIC_STOCK_API_KEY || 'demo';

  async getStock(symbol: string): Promise<Stock> {
    try {
      // For development, return mock data
      if (MOCK_STOCKS[symbol]) {
        return MOCK_STOCKS[symbol];
      }
      
      // Real API call would be:
      // const response = await fetch(`${this.baseUrl}/quote?symbol=${symbol}&apikey=${this.apiKey}`);
      // const data = await response.json();
      // return this.transformStockData(data);
      
      throw new Error(`Stock ${symbol} not found`);
    } catch (error) {
      console.error('Error fetching stock:', error);
      throw error;
    }
  }

  async getMultipleStocks(symbols: string[]): Promise<Stock[]> {
    try {
      // For development, return mock data
      const stocks = symbols
        .map(symbol => MOCK_STOCKS[symbol])
        .filter(Boolean);
      
      return stocks;
    } catch (error) {
      console.error('Error fetching multiple stocks:', error);
      throw error;
    }
  }

  async getMarketIndices(): Promise<MarketIndex[]> {
    try {
      // For development, return mock data
      return MOCK_INDICES;
    } catch (error) {
      console.error('Error fetching market indices:', error);
      throw error;
    }
  }

  async getChartData(symbol: string, timeframe: string): Promise<ChartData[]> {
    try {
      // Generate mock chart data
      const data: ChartData[] = [];
      const now = new Date();
      const days = timeframe === '1D' ? 1 : timeframe === '5D' ? 5 : 30;
      
      for (let i = days; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        const basePrice = MOCK_STOCKS[symbol]?.price || 100;
        const randomFactor = 0.95 + Math.random() * 0.1; // ±5% variation
        const price = basePrice * randomFactor;
        
        data.push({
          timestamp: date.toISOString(),
          open: price * (0.99 + Math.random() * 0.02),
          high: price * (1.01 + Math.random() * 0.02),
          low: price * (0.97 + Math.random() * 0.02),
          close: price,
          volume: Math.floor(Math.random() * 10000000) + 1000000,
        });
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching chart data:', error);
      throw error;
    }
  }

  async searchStocks(query: string): Promise<SearchResult[]> {
    try {
      // Mock search results
      const allStocks = Object.values(MOCK_STOCKS);
      const results = allStocks
        .filter(stock => 
          stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
          stock.name.toLowerCase().includes(query.toLowerCase())
        )
        .map(stock => ({
          symbol: stock.symbol,
          name: stock.name,
          type: 'stock' as const,
          exchange: 'NASDAQ',
        }));
      
      return results;
    } catch (error) {
      console.error('Error searching stocks:', error);
      throw error;
    }
  }

  // Helper method to transform API data to our Stock interface
  private transformStockData(apiData: any): Stock {
    return {
      symbol: apiData.symbol,
      name: apiData.companyName || apiData.name,
      price: parseFloat(apiData.latestPrice || apiData.price),
      change: parseFloat(apiData.change),
      changePercent: parseFloat(apiData.changePercent) * 100,
      volume: parseInt(apiData.latestVolume || apiData.volume),
      marketCap: parseInt(apiData.marketCap),
      peRatio: parseFloat(apiData.peRatio),
      dividendYield: parseFloat(apiData.dividendYield) * 100,
      high52Week: parseFloat(apiData.week52High),
      low52Week: parseFloat(apiData.week52Low),
      lastUpdated: new Date().toISOString(),
    };
  }
}

export const stockService = new StockService();
