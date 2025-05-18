import axios from 'axios';
import { ApiResponse, Stock } from '../types';
import { stocksData } from '../data/mockData';

// This is a mock implementation since we don't have real API access
// In a real application, you would implement proper API calls here
// and handle rate limiting, caching, and error handling

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 30 * 1000; // 30 seconds cache TTL

// Simulates fetching current market price from Yahoo Finance
export const fetchStockPrice = async (ticker: string, exchange: string): Promise<ApiResponse> => {
  const cacheKey = `price_${ticker}_${exchange}`;
  
  // Check if we have cached data and it's still valid
  const cachedData = cache.get(cacheKey);
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
    return { success: true, data: cachedData.data };
  }
  
  try {
    // In a real app, this would be an actual API call to Yahoo Finance or a proxy service
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Generate a somewhat realistic price (original price +/- random variation)
    const stock = stocksData.find(s => s.ticker === ticker);
    if (!stock) return { success: false, error: 'Stock not found' };
    
    const basePriceMultiplier = Math.random() > 0.5 ? 1.1 : 0.95; // 10% up or 5% down from purchase price
    const variationMultiplier = 1 + (Math.random() * 0.06 - 0.03); // +/- 3% random variation
    const simulatedPrice = stock.purchasePrice * basePriceMultiplier * variationMultiplier;
    
    const responseData = {
      price: parseFloat(simulatedPrice.toFixed(2))
    };
    
    // Cache the result
    cache.set(cacheKey, { data: responseData, timestamp: Date.now() });
    
    return { success: true, data: responseData };
  } catch (error) {
    console.error('Error fetching stock price:', error);
    return { success: false, error: 'Failed to fetch stock price' };
  }
};

// Simulates fetching P/E ratio and earnings from Google Finance
export const fetchStockFinancials = async (ticker: string, exchange: string): Promise<ApiResponse> => {
  const cacheKey = `financials_${ticker}_${exchange}`;
  
  // Check for cached data
  const cachedData = cache.get(cacheKey);
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
    return { success: true, data: cachedData.data };
  }
  
  try {
    // In a real app, this would be an actual API call to Google Finance or a proxy service
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Generate simulated financial data
    const peRatio = parseFloat((10 + Math.random() * 25).toFixed(2));
    const latestEarnings = parseFloat((5 + Math.random() * 50).toFixed(2));
    
    const responseData = {
      peRatio,
      latestEarnings
    };
    
    // Cache the result
    cache.set(cacheKey, { data: responseData, timestamp: Date.now() });
    
    return { success: true, data: responseData };
  } catch (error) {
    console.error('Error fetching stock financials:', error);
    return { success: false, error: 'Failed to fetch stock financials' };
  }
};

// Fetch all stock data with market prices and financials
export const fetchPortfolioData = async (): Promise<Stock[]> => {
  try {
    const stocksWithData = await Promise.all(
      stocksData.map(async (stock) => {
        // Fetch price data
        const priceResponse = await fetchStockPrice(stock.ticker, stock.exchange);
        const cmp = priceResponse.success ? priceResponse.data.price : undefined;
        
        // Fetch financial data
        const financialsResponse = await fetchStockFinancials(stock.ticker, stock.exchange);
        const peRatio = financialsResponse.success ? financialsResponse.data.peRatio : undefined;
        const latestEarnings = financialsResponse.success ? financialsResponse.data.latestEarnings : undefined;
        
        return {
          ...stock,
          cmp,
          peRatio,
          latestEarnings
        };
      })
    );
    
    return stocksWithData;
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    return stocksData;
  }
};