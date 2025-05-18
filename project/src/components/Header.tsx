import React from 'react';

interface HeaderProps {
  lastUpdated: Date | null;
}

const Header: React.FC<HeaderProps> = ({ lastUpdated }) => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Portfolio Dashboard
            </h1>
            <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
              <div className="mt-2 flex items-center text-sm text-gray-500">
                {lastUpdated ? (
                  <span>
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </span>
                ) : (
                  <span>Loading data...</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;