import React from 'react';
import { useTranslation } from 'react-i18next';

export default function EmptyState({ hasFilters }) {
  const { t } = useTranslation();
  return (
    <div className="reviews-container">
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <div className="empty-title">
          {hasFilters ? t('profile.admin.reviewsPage.empty.titleWithFilters') : t('profile.admin.reviewsPage.empty.title')}
        </div>
        <div className="empty-description">
          {hasFilters
            ? t('profile.admin.reviewsPage.empty.descWithFilters')
            : t('profile.admin.reviewsPage.empty.desc')}
        </div>
      </div>
    </div>
  );
}

