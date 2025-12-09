import React from 'react';
import { useTranslation } from 'react-i18next';

export default function SummaryBar({ stats }) {
  const { t } = useTranslation();
  return (
    <div className="summary-bar">
      <div className="summary-item">
        <span className="summary-label">{t('profile.admin.reviewsPage.summary.totalReviews')}</span>
        <span className="summary-value">{stats.totalReviews}</span>
      </div>
      <div className="summary-item">
        <span className="summary-label">{t('profile.admin.reviewsPage.summary.averageRating')}</span>
        <span className="summary-value">{stats.averageRating}</span>
      </div>
      <div className="summary-item">
        <span className="summary-label">{t('profile.admin.reviewsPage.summary.thisMonth')}</span>
        <span className="summary-value">{stats.thisMonth}</span>
      </div>
      <div className="summary-item">
        <span className="summary-label">{t('profile.admin.reviewsPage.summary.positive')}</span>
        <span className="summary-value">{stats.positive}</span>
      </div>
      <div className="summary-item">
        <span className="summary-label">{t('profile.admin.reviewsPage.summary.needsAttention')}</span>
        <span className="summary-value">{stats.needsAttention}</span>
      </div>
    </div>
  );
}

