import { Stock, StockWithCalculatedValues, SectorSummary } from '../types';

// Calculate investment amount for a stock
export const calculateInvestment = (stock: Stock): number => {
  return stock.purchasePrice * stock.quantity;
};

// Calculate present value for a stock (if CMP is available)
export const calculatePresentValue = (stock: Stock): number => {
  if (!stock.cmp) return 0;
  return stock.cmp * stock.quantity;
};

// Calculate gain or loss for a stock
export const calculateGainLoss = (stock: Stock): number => {
  if (!stock.cmp) return 0;
  const investment = calculateInvestment(stock);
  const presentValue = calculatePresentValue(stock);
  return presentValue - investment;
};

// Calculate gain or loss percentage
export const calculateGainLossPercentage = (stock: Stock): number => {
  if (!stock.cmp) return 0;
  const investment = calculateInvestment(stock);
  const gainLoss = calculateGainLoss(stock);
  return (gainLoss / investment) * 100;
};

// Calculate portfolio percentage (weight)
export const calculatePortfolioPercentage = (
  stock: Stock,
  totalInvestment: number
): number => {
  if (totalInvestment === 0) return 0;
  const investment = calculateInvestment(stock);
  return (investment / totalInvestment) * 100;
};

// Process stock data to add calculated values
export const processStockData = (stocks: Stock[]): StockWithCalculatedValues[] => {
  // Calculate total investment across all stocks
  const totalInvestment = stocks.reduce(
    (total, stock) => total + calculateInvestment(stock),
    0
  );

  // Add calculated values to each stock
  return stocks.map((stock) => {
    const investment = calculateInvestment(stock);
    const presentValue = calculatePresentValue(stock);
    const gainLoss = calculateGainLoss(stock);
    const gainLossPercentage = calculateGainLossPercentage(stock);
    const portfolioPercentage = calculatePortfolioPercentage(stock, totalInvestment);

    return {
      ...stock,
      investment,
      presentValue,
      gainLoss,
      gainLossPercentage,
      portfolioPercentage,
    };
  });
};

// Group stocks by sector and calculate sector summaries
export const groupStocksBySector = (
  stocks: StockWithCalculatedValues[]
): SectorSummary[] => {
  // Group stocks by sector
  const sectorMap = new Map<string, StockWithCalculatedValues[]>();
  
  stocks.forEach((stock) => {
    if (!sectorMap.has(stock.sector)) {
      sectorMap.set(stock.sector, []);
    }
    sectorMap.get(stock.sector)!.push(stock);
  });

  // Create sector summaries
  const sectorSummaries: SectorSummary[] = [];
  
  sectorMap.forEach((sectorStocks, sector) => {
    const totalInvestment = sectorStocks.reduce(
      (total, stock) => total + stock.investment,
      0
    );
    
    const totalPresentValue = sectorStocks.reduce(
      (total, stock) => total + stock.presentValue,
      0
    );
    
    const totalGainLoss = totalPresentValue - totalInvestment;
    
    const totalGainLossPercentage = 
      totalInvestment > 0 ? (totalGainLoss / totalInvestment) * 100 : 0;

    sectorSummaries.push({
      sector,
      totalInvestment,
      totalPresentValue,
      totalGainLoss,
      totalGainLossPercentage,
      stocks: sectorStocks,
    });
  });

  // Sort sectors by total investment (descending)
  return sectorSummaries.sort(
    (a, b) => b.totalInvestment - a.totalInvestment
  );
};

// Format currency value (INR)
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value);
};

// Format percentage
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};