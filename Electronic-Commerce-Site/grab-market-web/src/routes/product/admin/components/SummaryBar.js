import React from 'react';

export default function SummaryBar({ stats }) {
  return (
    <div className="summary-bar">
      <div className="summary-item">
        <span className="summary-label">Total Products</span>
        <span className="summary-value">{stats.totalProducts}</span>
      </div>
      <div className="summary-item">
        <span className="summary-label">Total Sales</span>
        <span className="summary-value">{stats.totalSales.toLocaleString()}</span>
      </div>
      <div className="summary-item">
        <span className="summary-label">Total Revenue</span>
        <span className="summary-value">¥{stats.totalRevenue.toLocaleString()}</span>
      </div>
      <div className="summary-item">
        <span className="summary-label">Avg Rating</span>
        <span className="summary-value">{stats.avgRating}</span>
      </div>
    </div>
  );
}

