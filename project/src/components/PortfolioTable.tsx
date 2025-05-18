import React, { useMemo } from 'react';
import { ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';
import { SectorSummary, StockWithCalculatedValues } from '../types';
import { formatCurrency, formatPercentage } from '../utils/portfolioCalculations';

interface PortfolioTableProps {
  sectorSummaries: SectorSummary[];
  expandedSectors: Set<string>;
  toggleSector: (sector: string) => void;
}

const PortfolioTable: React.FC<PortfolioTableProps> = ({ 
  sectorSummaries, 
  expandedSectors, 
  toggleSector 
}) => {
  // Calculate overall portfolio totals
  const portfolioTotals = useMemo(() => {
    const totalInvestment = sectorSummaries.reduce(
      (total, sector) => total + sector.totalInvestment, 0
    );
    
    const totalPresentValue = sectorSummaries.reduce(
      (total, sector) => total + sector.totalPresentValue, 0
    );
    
    const totalGainLoss = totalPresentValue - totalInvestment;
    
    const totalGainLossPercentage = 
      totalInvestment > 0 ? (totalGainLoss / totalInvestment) * 100 : 0;
      
    return {
      totalInvestment,
      totalPresentValue,
      totalGainLoss,
      totalGainLossPercentage
    };
  }, [sectorSummaries]);

  // Function to render a sector row
  const renderSectorRow = (sector: SectorSummary) => {
    const isExpanded = expandedSectors.has(sector.sector);
    const ChevronIcon = isExpanded ? ChevronDown : ChevronRight;
    
    return (
      <React.Fragment key={sector.sector}>
        <tr 
          className="bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors"
          onClick={() => toggleSector(sector.sector)}
        >
          <td className="px-4 py-3 text-left">
            <div className="flex items-center font-medium">
              <ChevronIcon className="mr-1 h-5 w-5" />
              {sector.sector}
            </div>
          </td>
          <td className="px-4 py-3 text-right">{formatCurrency(sector.totalInvestment)}</td>
          <td className="px-4 py-3 text-right">-</td>
          <td className="px-4 py-3 text-right hidden md:table-cell">-</td>
          <td className="px-4 py-3 text-right hidden lg:table-cell">-</td>
          <td className="px-4 py-3 text-right">{formatCurrency(sector.totalPresentValue)}</td>
          <td className="px-4 py-3 text-right hidden md:table-cell">
            <span className={sector.totalGainLoss >= 0 ? 'text-success-600' : 'text-error-600'}>
              {formatCurrency(sector.totalGainLoss)}
            </span>
          </td>
          <td className="px-4 py-3 text-right">
            <span className={sector.totalGainLossPercentage >= 0 ? 'text-success-600' : 'text-error-600'}>
              {formatPercentage(sector.totalGainLossPercentage)}
            </span>
          </td>
          <td className="px-4 py-3 text-right hidden lg:table-cell">-</td>
          <td className="px-4 py-3 text-right hidden lg:table-cell">-</td>
        </tr>
        
        {isExpanded && sector.stocks.map(stock => renderStockRow(stock))}
      </React.Fragment>
    );
  };

  // Function to render a stock row
  const renderStockRow = (stock: StockWithCalculatedValues) => {
    return (
      <tr key={stock.id} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
        <td className="px-4 py-3 text-left">
          <div className="pl-6">{stock.name}</div>
        </td>
        <td className="px-4 py-3 text-right">{formatCurrency(stock.purchasePrice)}</td>
        <td className="px-4 py-3 text-right">{stock.quantity}</td>
        <td className="px-4 py-3 text-right hidden md:table-cell">{formatCurrency(stock.investment)}</td>
        <td className="px-4 py-3 text-right hidden lg:table-cell">{formatPercentage(stock.portfolioPercentage)}</td>
        <td className="px-4 py-3 text-right">
          {stock.cmp ? formatCurrency(stock.cmp) : 'Loading...'}
        </td>
        <td className="px-4 py-3 text-right hidden md:table-cell">
          <span className={stock.gainLoss >= 0 ? 'text-success-600' : 'text-error-600'}>
            {formatCurrency(stock.gainLoss)}
          </span>
        </td>
        <td className="px-4 py-3 text-right">
          <span className={stock.gainLossPercentage >= 0 ? 'text-success-600' : 'text-error-600'}>
            {formatPercentage(stock.gainLossPercentage)}
          </span>
        </td>
        <td className="px-4 py-3 text-right hidden lg:table-cell">
          {stock.peRatio ? stock.peRatio.toFixed(2) : 'Loading...'}
        </td>
        <td className="px-4 py-3 text-right hidden lg:table-cell">
          {stock.latestEarnings ? formatCurrency(stock.latestEarnings) : 'Loading...'}
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Particulars
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Purchase Price
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Qty
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Investment
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                Portfolio %
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                CMP
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Gain/Loss
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gain/Loss %
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                P/E Ratio
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                Latest Earnings
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sectorSummaries.map(sector => renderSectorRow(sector))}
            
            {/* Portfolio total row */}
            <tr className="bg-gray-100 font-medium">
              <td className="px-4 py-3 text-left">
                <div className="font-bold">Portfolio Total</div>
              </td>
              <td className="px-4 py-3 text-right">-</td>
              <td className="px-4 py-3 text-right">-</td>
              <td className="px-4 py-3 text-right hidden md:table-cell">{formatCurrency(portfolioTotals.totalInvestment)}</td>
              <td className="px-4 py-3 text-right hidden lg:table-cell">100%</td>
              <td className="px-4 py-3 text-right">-</td>
              <td className="px-4 py-3 text-right hidden md:table-cell">
                <span className={portfolioTotals.totalGainLoss >= 0 ? 'text-success-600' : 'text-error-600'}>
                  {formatCurrency(portfolioTotals.totalGainLoss)}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <span className={portfolioTotals.totalGainLossPercentage >= 0 ? 'text-success-600' : 'text-error-600'}>
                  {formatPercentage(portfolioTotals.totalGainLossPercentage)}
                </span>
              </td>
              <td className="px-4 py-3 text-right hidden lg:table-cell">-</td>
              <td className="px-4 py-3 text-right hidden lg:table-cell">-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PortfolioTable;