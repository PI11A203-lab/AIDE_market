import React from 'react';

export default function StatsSection({ stats, formatCurrency }) {
  return (
    <section className="admin-product-detail__stats">
      <div className="stat-card">
        <div className="stat-label">Total Sales</div>
        <div className="stat-value">{(stats.totalSales || 0).toLocaleString()}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Total Revenue</div>
        <div className="stat-value">{formatCurrency(stats.totalRevenue)}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Average Rating</div>
        <div className="stat-value">{Number(stats.avgRating || 0).toFixed(1)}</div>
      </div>
    </section>
  );
}

