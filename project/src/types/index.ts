export interface Stock {
  id: string;
  name: string;
  ticker: string;
  exchange: 'NSE' | 'BSE';
  sector: string;
  purchasePrice: number;
  quantity: number;
  cmp?: number;
  peRatio?: number;
  latestEarnings?: number;
}

export interface StockWithCalculatedValues extends Stock {
  investment: number;
  portfolioPercentage: number;
  presentValue: number;
  gainLoss: number;
  gainLossPercentage: number;
}

export interface SectorSummary {
  sector: string;
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
  stocks: StockWithCalculatedValues[];
}

export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}