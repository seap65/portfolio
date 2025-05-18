import React, { useMemo } from 'react';
import { SectorSummary } from '../types';
import { ArrowUpCircle, ArrowDownCircle, DollarSign, Percent } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/portfolioCalculations';

interface SummaryCardsProps {
  sectorSummaries: SectorSummary[];
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ sectorSummaries }) => {
  // Calculate portfolio summary statistics
  const summary = useMemo(() => {
    const totalInvestment = sectorSummaries.reduce(
      (total, sector) => total + sector.totalInvestment, 0
    );
    
    const totalPresentValue = sectorSummaries.reduce(
      (total, sector) => total + sector.totalPresentValue, 0
    );
    
    const totalGainLoss = totalPresentValue - totalInvestment;
    
    const totalGainLossPercentage = 
      totalInvestment > 0 ? (totalGainLoss / totalInvestment) * 100 : 0;
    
    // Find best and worst performing sectors
    let bestSector = { sector: 'None', totalGainLossPercentage: -Infinity };
    let worstSector = { sector: 'None', totalGainLossPercentage: Infinity };
    
    sectorSummaries.forEach(sector => {
      if (sector.totalGainLossPercentage > bestSector.totalGainLossPercentage) {
        bestSector = { 
          sector: sector.sector, 
          totalGainLossPercentage: sector.totalGainLossPercentage 
        };
      }
      
      if (sector.totalGainLossPercentage < worstSector.totalGainLossPercentage) {
        worstSector = { 
          sector: sector.sector, 
          totalGainLossPercentage: sector.totalGainLossPercentage 
        };
      }
    });

    return {
      totalInvestment,
      totalPresentValue,
      totalGainLoss,
      totalGainLossPercentage,
      bestSector,
      worstSector
    };
  }, [sectorSummaries]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Investment Card */}
      <div className="bg-white rounded-lg shadow-card p-4 border-l-4 border-primary-500">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Investment</p>
            <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalInvestment)}</h3>
          </div>
          <div className="bg-primary-100 p-2 rounded-full">
            <DollarSign className="h-6 w-6 text-primary-600" />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">Current value: {formatCurrency(summary.totalPresentValue)}</p>
      </div>

      {/* Gain/Loss Card */}
      <div className={`bg-white rounded-lg shadow-card p-4 border-l-4 ${
        summary.totalGainLoss >= 0 ? 'border-success-500' : 'border-error-500'
      }`}>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Gain/Loss</p>
            <h3 className={`text-2xl font-bold ${
              summary.totalGainLoss >= 0 ? 'text-success-600' : 'text-error-600'
            }`}>
              {formatCurrency(summary.totalGainLoss)}
            </h3>
          </div>
          <div className={`p-2 rounded-full ${
            summary.totalGainLoss >= 0 ? 'bg-success-100' : 'bg-error-100'
          }`}>
            {summary.totalGainLoss >= 0 ? (
              <ArrowUpCircle className="h-6 w-6 text-success-600" />
            ) : (
              <ArrowDownCircle className="h-6 w-6 text-error-600" />
            )}
          </div>
        </div>
        <p className={`text-sm ${
          summary.totalGainLossPercentage >= 0 ? 'text-success-600' : 'text-error-600'
        } mt-2`}>
          {formatPercentage(summary.totalGainLossPercentage)}
        </p>
      </div>

      {/* Best Performing Sector Card */}
      <div className="bg-white rounded-lg shadow-card p-4 border-l-4 border-success-500">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Best Performing Sector</p>
            <h3 className="text-xl font-bold text-gray-900">{summary.bestSector.sector}</h3>
          </div>
          <div className="bg-success-100 p-2 rounded-full">
            <ArrowUpCircle className="h-6 w-6 text-success-600" />
          </div>
        </div>
        <p className="text-sm text-success-600 mt-2">
          {formatPercentage(summary.bestSector.totalGainLossPercentage)}
        </p>
      </div>

      {/* Worst Performing Sector Card */}
      <div className="bg-white rounded-lg shadow-card p-4 border-l-4 border-warning-500">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Worst Performing Sector</p>
            <h3 className="text-xl font-bold text-gray-900">{summary.worstSector.sector}</h3>
          </div>
          <div className="bg-warning-100 p-2 rounded-full">
            <ArrowDownCircle className="h-6 w-6 text-warning-600" />
          </div>
        </div>
        <p className="text-sm text-warning-600 mt-2">
          {formatPercentage(summary.worstSector.totalGainLossPercentage)}
        </p>
      </div>
    </div>
  );
};

export default SummaryCards;