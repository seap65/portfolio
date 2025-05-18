import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import PortfolioTable from './components/PortfolioTable';
import SummaryCards from './components/SummaryCards';
import { Stock, SectorSummary } from './types';
import { fetchPortfolioData } from './api/stocksApi';
import { processStockData, groupStocksBySector } from './utils/portfolioCalculations';
import { RefreshCw } from 'lucide-react';

function App() {
  // State for portfolio data
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [sectorSummaries, setSectorSummaries] = useState<SectorSummary[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Track expanded sectors
  const [expandedSectors, setExpandedSectors] = useState<Set<string>>(new Set());
  
  // Function to toggle sector expansion
  const toggleSector = (sector: string) => {
    const newExpanded = new Set(expandedSectors);
    if (newExpanded.has(sector)) {
      newExpanded.delete(sector);
    } else {
      newExpanded.add(sector);
    }
    setExpandedSectors(newExpanded);
  };

  // Function to fetch and process portfolio data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const stocksData = await fetchPortfolioData();
      
      // Process stock data (add calculated values)
      const processedStocks = processStockData(stocksData);
      
      // Group stocks by sector
      const groupedBySector = groupStocksBySector(processedStocks);
      
      setStocks(stocksData);
      setSectorSummaries(groupedBySector);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching portfolio data:', err);
      setError('Failed to fetch portfolio data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchData();
    
    // Expand all sectors by default
    if (sectorSummaries.length > 0) {
      const allSectors = new Set(sectorSummaries.map(sector => sector.sector));
      setExpandedSectors(allSectors);
    }
  }, [fetchData]);

  // Set up periodic data refresh (every 15 seconds)
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      fetchData();
    }, 15000);
    
    return () => clearInterval(refreshInterval);
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header lastUpdated={lastUpdated} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-error-50 border-l-4 border-error-500 p-4 rounded-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-error-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-error-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {loading && stocks.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-6 w-6 text-primary-500 animate-spin" />
              <span className="text-gray-600">Loading portfolio data...</span>
            </div>
          </div>
        ) : (
          <>
            <SummaryCards sectorSummaries={sectorSummaries} />
            <PortfolioTable 
              sectorSummaries={sectorSummaries} 
              expandedSectors={expandedSectors}
              toggleSector={toggleSector}
            />
          </>
        )}
      </main>
      
      
    </div>
  );
}

export default App;