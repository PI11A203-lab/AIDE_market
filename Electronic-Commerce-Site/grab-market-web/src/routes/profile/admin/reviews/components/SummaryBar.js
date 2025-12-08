import React from 'react';

export default function SummaryBar({ stats }) {
  return (
    <div className="summary-bar">
      <div className="summary-item">
        <span className="summary-label">Total Reviews</span>
        <span className="summary-value">{stats.totalReviews}</span>
      </div>
      <div className="summary-item">
        <span className="summary-label">Average Rating</span>
        <span className="summary-value">{stats.averageRating}</span>
      </div>
      <div className="summary-item">
        <span className="summary-label">This Month</span>
        <span className="summary-value">{stats.thisMonth}</span>
      </div>
      <div className="summary-item">
        <span className="summary-label">Positive (4-5★)</span>
        <span className="summary-value">{stats.positive}</span>
      </div>
      <div className="summary-item">
        <span className="summary-label">Needs Attention (1-3★)</span>
        <span className="summary-value">{stats.needsAttention}</span>
      </div>
    </div>
  );
}

