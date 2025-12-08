import React from 'react';

export default function StatsCards({ ratingDistribution }) {
  const ratings = [5, 4, 3, 2, 1];
  const stars = {
    5: '⭐⭐⭐⭐⭐',
    4: '⭐⭐⭐⭐',
    3: '⭐⭐⭐',
    2: '⭐⭐',
    1: '⭐'
  };

  return (
    <div className="stats-grid">
      {ratings.map(rating => (
        <div key={rating} className="stat-card">
          <div className="stat-label">{stars[rating]}</div>
          <div className="stat-value">{ratingDistribution[rating] || 0}</div>
          <div className="stat-count">reviews</div>
        </div>
      ))}
    </div>
  );
}

