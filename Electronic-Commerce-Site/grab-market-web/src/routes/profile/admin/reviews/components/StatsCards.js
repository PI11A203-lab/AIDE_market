import React from 'react';
import { useTranslation } from 'react-i18next';

export default function StatsCards({ ratingDistribution }) {
  const { t } = useTranslation();
  const ratings = [5, 4, 3, 2, 1];
  const starLabels = {
    5: '★★★★★',
    4: '★★★★☆',
    3: '★★★☆☆',
    2: '★★☆☆☆',
    1: '★☆☆☆☆'
  };

  return (
    <div className="stats-distribution-minimal">
      <span className="stats-dist-label">{t('profile.admin.reviewsPage.statsCards.distributionTitle', '평점 분포')}</span>
      <div className="stats-dist-row">
        {ratings.map(rating => {
          const count = ratingDistribution
            ? (ratingDistribution[rating] ?? ratingDistribution[String(rating)] ?? 0)
            : 0;
          return (
            <div key={rating} className="stats-dist-item">
              <span className="stats-dist-stars">{starLabels[rating]}</span>
              <span className="stats-dist-count">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
