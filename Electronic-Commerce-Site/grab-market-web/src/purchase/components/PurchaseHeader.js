import React from 'react';
import { useHistory } from 'react-router-dom';

export default function PurchaseHeader() {
  const history = useHistory();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm py-5 px-16">
      <div className="max-w-full mx-0 px-0 flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2 m-0">
          <span className="text-3xl">🤖</span>
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AIDE Market
          </span>
        </h1>
        <button 
          onClick={() => history.push('/')}
          className="bg-transparent border-none p-0 text-gray-700 font-semibold text-base cursor-pointer transition-colors hover:text-blue-500"
        >
          ← Back to Home
        </button>
      </div>
    </header>
  );
}
