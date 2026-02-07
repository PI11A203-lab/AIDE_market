import React from 'react';
import { useTranslation } from 'react-i18next';

export default function EmptyState({ hasFilters }) {
  const { t } = useTranslation();
  return (
    <div className="empty-state">
      <div className="empty-icon">📦</div>
      <div className="empty-title">{t('productAdmin.list.empty.title')}</div>
      <div className="empty-description">
        {hasFilters
          ? t('productAdmin.list.empty.descWithFilters')
          : t('productAdmin.list.empty.desc')}
      </div>
    </div>
  );
}

