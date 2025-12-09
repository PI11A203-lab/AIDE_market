import React from 'react';
import { useTranslation } from 'react-i18next';

export default function EmptyState({ hasFilters }) {
  const { t } = useTranslation();
  return (
    <div className="empty-state">
      <div className="empty-icon">🧾</div>
      <div className="empty-title">{t('profile.admin.orders.empty.title')}</div>
      <div className="empty-description">
        {hasFilters
          ? t('profile.admin.orders.empty.descWithFilters')
          : t('profile.admin.orders.empty.desc')}
      </div>
    </div>
  );
}


