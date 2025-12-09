import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function EmptyState({ hasFilters, onCreateNew }) {
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
      {!hasFilters && (
        <Link to="/profile/products/new" className="btn btn-primary" style={{ marginTop: '16px' }}>
          <Plus size={20} />
          {t('productAdmin.list.empty.new')}
        </Link>
      )}
    </div>
  );
}

