import React from 'react';

export default function SummaryBar({ stats }) {
  return (
    <div className="summary-bar">
      <div className="summary-item">
        <span className="summary-label">Total Orders</span>
        <span className="summary-value">{stats.totalOrders?.toLocaleString?.() ?? 0}</span>
      </div>
      <div className="summary-item">
        <span className="summary-label">This Month</span>
        <span className="summary-value">¥{(stats.thisMonth || 0).toLocaleString()}</span>
      </div>
      <div className="summary-item">
        <span className="summary-label">Completed</span>
        <span className="summary-value">{stats.completed?.toLocaleString?.() ?? 0}</span>
      </div>
      <div className="summary-item">
        <span className="summary-label">Pending</span>
        <span className="summary-value">{stats.pending?.toLocaleString?.() ?? 0}</span>
      </div>
      <div className="summary-item">
        <span className="summary-label">Avg Order Value</span>
        <span className="summary-value">¥{(stats.avgOrderValue || 0).toLocaleString()}</span>
      </div>
    </div>
  );
}


