import { Portfolio, Position } from '@/types';

// Mock portfolio service - replace with real backend integration
class PortfolioService {
  private portfolios: Portfolio[] = [
    {
      id: '1',
      name: 'My Portfolio',
      totalValue: 25000,
      totalGainLoss: 2500,
      totalGainLossPercent: 11.11,
      positions: [
        {
          id: '1',
          symbol: 'AAPL',
          quantity: 50,
          averagePrice: 150.00,
          currentPrice: 175.43,
          totalValue: 8771.50,
          gainLoss: 1271.50,
          gainLossPercent: 16.95,
          purchaseDate: '2024-01-15',
        },
        {
          id: '2',
          symbol: 'GOOGL',
          quantity: 5,
          averagePrice: 2800.00,
          currentPrice: 2847.63,
          totalValue: 14238.15,
          gainLoss: 238.15,
          gainLossPercent: 1.70,
          purchaseDate: '2024-02-01',
        },
      ],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: new Date().toISOString(),
    },
  ];

  async getPortfolios(): Promise<Portfolio[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.portfolios;
  }

  async createPortfolio(name: string): Promise<Portfolio> {
    const newPortfolio: Portfolio = {
      id: Date.now().toString(),
      name,
      totalValue: 0,
      totalGainLoss: 0,
      totalGainLossPercent: 0,
      positions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.portfolios.push(newPortfolio);
    return newPortfolio;
  }

  async addPosition(
    portfolioId: string,
    symbol: string,
    quantity: number,
    price: number
  ): Promise<{ portfolioId: string; position: Position }> {
    const portfolio = this.portfolios.find(p => p.id === portfolioId);
    if (!portfolio) {
      throw new Error('Portfolio not found');
    }

    const newPosition: Position = {
      id: Date.now().toString(),
      symbol,
      quantity,
      averagePrice: price,
      currentPrice: price, // Will be updated with real-time data
      totalValue: quantity * price,
      gainLoss: 0,
      gainLossPercent: 0,
      purchaseDate: new Date().toISOString().split('T')[0],
    };

    portfolio.positions.push(newPosition);
    this.updatePortfolioTotals(portfolio);

    return { portfolioId, position: newPosition };
  }

  async updatePosition(
    portfolioId: string,
    positionId: string,
    quantity: number,
    price: number
  ): Promise<{ portfolioId: string; position: Position }> {
    const portfolio = this.portfolios.find(p => p.id === portfolioId);
    if (!portfolio) {
      throw new Error('Portfolio not found');
    }

    const position = portfolio.positions.find(p => p.id === positionId);
    if (!position) {
      throw new Error('Position not found');
    }

    position.quantity = quantity;
    position.averagePrice = price;
    position.totalValue = quantity * position.currentPrice;
    position.gainLoss = position.totalValue - (quantity * price);
    position.gainLossPercent = price > 0 ? (position.gainLoss / (quantity * price)) * 100 : 0;

    this.updatePortfolioTotals(portfolio);

    return { portfolioId, position };
  }

  async removePosition(portfolioId: string, positionId: string): Promise<void> {
    const portfolio = this.portfolios.find(p => p.id === portfolioId);
    if (!portfolio) {
      throw new Error('Portfolio not found');
    }

    portfolio.positions = portfolio.positions.filter(p => p.id !== positionId);
    this.updatePortfolioTotals(portfolio);
  }

  private updatePortfolioTotals(portfolio: Portfolio) {
    portfolio.totalValue = portfolio.positions.reduce((sum, pos) => sum + pos.totalValue, 0);
    portfolio.totalGainLoss = portfolio.positions.reduce((sum, pos) => sum + pos.gainLoss, 0);
    
    const totalCost = portfolio.positions.reduce(
      (sum, pos) => sum + (pos.quantity * pos.averagePrice), 
      0
    );
    
    portfolio.totalGainLossPercent = totalCost > 0 ? (portfolio.totalGainLoss / totalCost) * 100 : 0;
    portfolio.updatedAt = new Date().toISOString();
  }
}

export const portfolioService = new PortfolioService();
