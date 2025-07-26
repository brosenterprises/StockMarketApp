# API Integration Guide - Free Stock Market APIs

This guide covers integrating free stock market APIs to power your mobile application with real-time financial data.

## Overview of Free APIs

### 1. Alpha Vantage (Recommended)
- **Free Tier**: 500 requests/day
- **Features**: Real-time quotes, historical data, technical indicators
- **Best For**: Core stock data and charts
- **Signup**: https://www.alphavantage.co/support/#api-key

### 2. IEX Cloud
- **Free Tier**: 100,000 requests/month
- **Features**: Market data, company info, news
- **Best For**: High-volume applications
- **Signup**: https://iexcloud.io/

### 3. Finnhub
- **Free Tier**: 60 requests/minute
- **Features**: Real-time data, company profiles, news
- **Best For**: Real-time updates
- **Signup**: https://finnhub.io/

### 4. Yahoo Finance (Unofficial)
- **Free Tier**: Unlimited (rate-limited)
- **Features**: Basic quotes and historical data
- **Best For**: Backup data source
- **Note**: Unofficial API, use with caution

## API Implementation

### 1. Alpha Vantage Integration

#### Setup
```typescript
// src/services/alphaVantageService.ts
const API_KEY = process.env.EXPO_PUBLIC_ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

class AlphaVantageService {
  async getQuote(symbol: string) {
    const response = await fetch(
      `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
    );
    const data = await response.json();
    return this.transformQuoteData(data);
  }

  async getIntradayData(symbol: string, interval = '5min') {
    const response = await fetch(
      `${BASE_URL}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&apikey=${API_KEY}`
    );
    const data = await response.json();
    return this.transformIntradayData(data);
  }

  async getDailyData(symbol: string) {
    const response = await fetch(
      `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`
    );
    const data = await response.json();
    return this.transformDailyData(data);
  }

  private transformQuoteData(data: any) {
    const quote = data['Global Quote'];
    return {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      volume: parseInt(quote['06. volume']),
      lastUpdated: quote['07. latest trading day'],
    };
  }
}
```

#### Usage Example
```typescript
// In your component or Redux thunk
const alphaVantage = new AlphaVantageService();

const fetchStockData = async (symbol: string) => {
  try {
    const quote = await alphaVantage.getQuote(symbol);
    const chartData = await alphaVantage.getDailyData(symbol);
    return { quote, chartData };
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
};
```

### 2. IEX Cloud Integration

#### Setup
```typescript
// src/services/iexCloudService.ts
const API_KEY = process.env.EXPO_PUBLIC_IEX_CLOUD_API_KEY;
const BASE_URL = 'https://cloud.iexapis.com/stable';

class IEXCloudService {
  async getQuote(symbol: string) {
    const response = await fetch(
      `${BASE_URL}/stock/${symbol}/quote?token=${API_KEY}`
    );
    return await response.json();
  }

  async getBatch(symbols: string[], types: string[] = ['quote']) {
    const symbolsStr = symbols.join(',');
    const typesStr = types.join(',');
    const response = await fetch(
      `${BASE_URL}/stock/market/batch?symbols=${symbolsStr}&types=${typesStr}&token=${API_KEY}`
    );
    return await response.json();
  }

  async getCompanyInfo(symbol: string) {
    const response = await fetch(
      `${BASE_URL}/stock/${symbol}/company?token=${API_KEY}`
    );
    return await response.json();
  }

  async getNews(symbol: string, last = 10) {
    const response = await fetch(
      `${BASE_URL}/stock/${symbol}/news/last/${last}?token=${API_KEY}`
    );
    return await response.json();
  }

  async searchSymbols(query: string) {
    const response = await fetch(
      `${BASE_URL}/search/${query}?token=${API_KEY}`
    );
    return await response.json();
  }
}
```

### 3. Finnhub Integration

#### Setup
```typescript
// src/services/finnhubService.ts
const API_KEY = process.env.EXPO_PUBLIC_FINNHUB_API_KEY;
const BASE_URL = 'https://finnhub.io/api/v1';

class FinnhubService {
  async getQuote(symbol: string) {
    const response = await fetch(
      `${BASE_URL}/quote?symbol=${symbol}&token=${API_KEY}`
    );
    return await response.json();
  }

  async getCompanyProfile(symbol: string) {
    const response = await fetch(
      `${BASE_URL}/stock/profile2?symbol=${symbol}&token=${API_KEY}`
    );
    return await response.json();
  }

  async getMarketNews(category = 'general') {
    const response = await fetch(
      `${BASE_URL}/news?category=${category}&token=${API_KEY}`
    );
    return await response.json();
  }

  async getCompanyNews(symbol: string, from: string, to: string) {
    const response = await fetch(
      `${BASE_URL}/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${API_KEY}`
    );
    return await response.json();
  }

  // WebSocket for real-time data
  connectWebSocket(symbols: string[], onMessage: (data: any) => void) {
    const ws = new WebSocket(`wss://ws.finnhub.io?token=${API_KEY}`);
    
    ws.onopen = () => {
      symbols.forEach(symbol => {
        ws.send(JSON.stringify({ type: 'subscribe', symbol }));
      });
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    return ws;
  }
}
```

## Unified Service Layer

### Create a Unified Stock Service
```typescript
// src/services/stockService.ts
import { AlphaVantageService } from './alphaVantageService';
import { IEXCloudService } from './iexCloudService';
import { FinnhubService } from './finnhubService';

class UnifiedStockService {
  private alphaVantage = new AlphaVantageService();
  private iexCloud = new IEXCloudService();
  private finnhub = new FinnhubService();

  async getStock(symbol: string): Promise<Stock> {
    try {
      // Try primary source first
      const data = await this.iexCloud.getQuote(symbol);
      return this.transformToStock(data, symbol);
    } catch (error) {
      // Fallback to secondary source
      console.warn('Primary API failed, trying fallback:', error);
      try {
        const data = await this.alphaVantage.getQuote(symbol);
        return this.transformToStock(data, symbol);
      } catch (fallbackError) {
        console.error('All APIs failed:', fallbackError);
        throw new Error(`Unable to fetch data for ${symbol}`);
      }
    }
  }

  async getMultipleStocks(symbols: string[]): Promise<Stock[]> {
    try {
      // Use batch API for efficiency
      const batchData = await this.iexCloud.getBatch(symbols, ['quote']);
      return symbols.map(symbol => 
        this.transformToStock(batchData[symbol]?.quote, symbol)
      ).filter(Boolean);
    } catch (error) {
      // Fallback to individual requests
      const promises = symbols.map(symbol => 
        this.getStock(symbol).catch(() => null)
      );
      const results = await Promise.all(promises);
      return results.filter(Boolean) as Stock[];
    }
  }

  private transformToStock(data: any, symbol: string): Stock {
    // Normalize data from different APIs to our Stock interface
    return {
      symbol: data.symbol || symbol,
      name: data.companyName || data.name || symbol,
      price: data.latestPrice || data.price || 0,
      change: data.change || 0,
      changePercent: (data.changePercent || 0) * 100,
      volume: data.latestVolume || data.volume || 0,
      marketCap: data.marketCap || 0,
      peRatio: data.peRatio,
      dividendYield: (data.dividendYield || 0) * 100,
      high52Week: data.week52High || 0,
      low52Week: data.week52Low || 0,
      lastUpdated: new Date().toISOString(),
    };
  }
}

export const stockService = new UnifiedStockService();
```

## Rate Limiting & Caching

### Implement Request Caching
```typescript
// src/utils/apiCache.ts
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

class APICache {
  private cache = new Map<string, CacheItem<any>>();

  set<T>(key: string, data: T, expiresInMs: number = 60000) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn: expiresInMs,
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.expiresIn) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear() {
    this.cache.clear();
  }
}

export const apiCache = new APICache();
```

### Rate Limiting
```typescript
// src/utils/rateLimiter.ts
class RateLimiter {
  private requests: number[] = [];
  private maxRequests: number;
  private timeWindow: number;

  constructor(maxRequests: number, timeWindowMs: number) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindowMs;
  }

  async canMakeRequest(): Promise<boolean> {
    const now = Date.now();
    
    // Remove old requests outside time window
    this.requests = this.requests.filter(
      timestamp => now - timestamp < this.timeWindow
    );

    return this.requests.length < this.maxRequests;
  }

  recordRequest() {
    this.requests.push(Date.now());
  }

  async waitForSlot(): Promise<void> {
    while (!(await this.canMakeRequest())) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    this.recordRequest();
  }
}

// Create rate limiters for different APIs
export const alphaVantageRateLimit = new RateLimiter(5, 60000); // 5 per minute
export const finnhubRateLimit = new RateLimiter(60, 60000); // 60 per minute
```

## Real-time Updates

### WebSocket Implementation
```typescript
// src/services/realtimeService.ts
class RealtimeService {
  private ws: WebSocket | null = null;
  private subscribers = new Map<string, Set<(data: any) => void>>();

  connect() {
    const finnhub = new FinnhubService();
    this.ws = finnhub.connectWebSocket(
      Array.from(this.subscribers.keys()),
      this.handleMessage.bind(this)
    );
  }

  subscribe(symbol: string, callback: (data: any) => void) {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, new Set());
    }
    this.subscribers.get(symbol)!.add(callback);

    // Subscribe to WebSocket if connected
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'subscribe', symbol }));
    }
  }

  unsubscribe(symbol: string, callback: (data: any) => void) {
    const callbacks = this.subscribers.get(symbol);
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        this.subscribers.delete(symbol);
        // Unsubscribe from WebSocket
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({ type: 'unsubscribe', symbol }));
        }
      }
    }
  }

  private handleMessage(data: any) {
    if (data.type === 'trade') {
      data.data.forEach((trade: any) => {
        const callbacks = this.subscribers.get(trade.s);
        if (callbacks) {
          callbacks.forEach(callback => callback(trade));
        }
      });
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const realtimeService = new RealtimeService();
```

## Error Handling

### Robust Error Handling
```typescript
// src/utils/apiErrorHandler.ts
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public apiSource?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export const handleAPIError = (error: any, apiSource: string) => {
  if (error.response) {
    // HTTP error response
    const statusCode = error.response.status;
    const message = error.response.data?.message || 'API request failed';
    throw new APIError(message, statusCode, apiSource);
  } else if (error.request) {
    // Network error
    throw new APIError('Network error - please check your connection', 0, apiSource);
  } else {
    // Other error
    throw new APIError(error.message || 'Unknown error occurred', 0, apiSource);
  }
};
```

## Testing API Integration

### Mock API Responses
```typescript
// src/services/__mocks__/stockService.ts
export const mockStockService = {
  getStock: jest.fn().mockResolvedValue({
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 150.00,
    change: 2.50,
    changePercent: 1.69,
    volume: 50000000,
    marketCap: 2500000000000,
    lastUpdated: new Date().toISOString(),
  }),

  getMultipleStocks: jest.fn().mockResolvedValue([
    // Mock array of stocks
  ]),
};
```

### Integration Tests
```typescript
// src/services/__tests__/stockService.test.ts
import { stockService } from '../stockService';

describe('StockService', () => {
  test('should fetch stock data', async () => {
    const stock = await stockService.getStock('AAPL');
    
    expect(stock).toHaveProperty('symbol', 'AAPL');
    expect(stock).toHaveProperty('price');
    expect(typeof stock.price).toBe('number');
  });

  test('should handle API errors gracefully', async () => {
    await expect(stockService.getStock('INVALID')).rejects.toThrow();
  });
});
```

## Best Practices

### 1. API Key Security
- Store API keys in environment variables
- Never commit API keys to version control
- Use different keys for development/production
- Rotate keys regularly

### 2. Performance Optimization
- Implement caching for frequently requested data
- Use batch requests when available
- Implement request deduplication
- Use compression for large responses

### 3. Reliability
- Implement fallback APIs
- Add retry logic with exponential backoff
- Handle rate limiting gracefully
- Monitor API usage and quotas

### 4. User Experience
- Show loading states during API calls
- Implement offline mode with cached data
- Provide meaningful error messages
- Use optimistic updates where appropriate

## Monitoring & Analytics

### Track API Usage
```typescript
// src/utils/apiAnalytics.ts
class APIAnalytics {
  trackRequest(apiSource: string, endpoint: string, success: boolean, responseTime: number) {
    // Send to analytics service
    console.log(`API Request: ${apiSource}/${endpoint} - ${success ? 'Success' : 'Failed'} - ${responseTime}ms`);
  }

  trackQuotaUsage(apiSource: string, used: number, limit: number) {
    // Monitor quota usage
    const percentage = (used / limit) * 100;
    if (percentage > 80) {
      console.warn(`API quota warning: ${apiSource} at ${percentage}%`);
    }
  }
}

export const apiAnalytics = new APIAnalytics();
```

This comprehensive API integration guide provides everything you need to connect your stock market app to free financial data APIs while maintaining reliability, performance, and user experience.
