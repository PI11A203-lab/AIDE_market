import React from 'react';
import { useTranslation } from 'react-i18next';

export default function SummaryBar({ stats }) {
  const { t } = useTranslation();

  const items = [
    { key: 'total', labelKey: 'profile.admin.reviewsPage.summary.totalReviews', value: stats.totalReviews, type: 'default' },
    { key: 'avg', labelKey: 'profile.admin.reviewsPage.summary.averageRating', value: stats.averageRating, type: 'default' },
    { key: 'month', labelKey: 'profile.admin.reviewsPage.summary.thisMonth', value: stats.thisMonth, type: 'default' },
    { key: 'positive', labelKey: 'profile.admin.reviewsPage.summary.positive', value: stats.positive, type: 'positive' },
    { key: 'attention', labelKey: 'profile.admin.reviewsPage.summary.needsAttention', value: stats.needsAttention, type: 'attention' }
  ];

  return (
    <div className="summary-bar-clean">
      <div className="summary-items">
        {items.map(({ key, labelKey, value, type }) => (
          <div key={key} className={`summary-item-clean ${type}`}>
            <span className="summary-value-clean">{value}</span>
            <span className="summary-label-clean">{t(labelKey)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
