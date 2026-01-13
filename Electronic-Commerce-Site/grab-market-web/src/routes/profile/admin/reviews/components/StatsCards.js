import React from 'react';
import { useTranslation } from 'react-i18next';

export default function StatsCards({ ratingDistribution }) {
  const { t } = useTranslation();
  const ratings = [5, 4, 3, 2, 1];
  const stars = {
    5: '⭐⭐⭐⭐⭐',
    4: '⭐⭐⭐⭐',
    3: '⭐⭐⭐',
    2: '⭐⭐',
    1: '⭐'
  };

  console.log('[StatsCards] ratingDistribution:', ratingDistribution);

  return (
    <div className="stats-grid">
      {ratings.map(rating => {
        const count = ratingDistribution 
          ? (ratingDistribution[rating] || ratingDistribution[String(rating)] || 0)
          : 0;
        return (
          <div key={rating} className="stat-card">
            <div className="stat-label">{stars[rating]}</div>
            <div className="stat-value">{count}</div>
            <div className="stat-count">{t('profile.admin.reviewsPage.statsCards.reviews')}</div>
          </div>
        );
      })}
    </div>
  );
}

