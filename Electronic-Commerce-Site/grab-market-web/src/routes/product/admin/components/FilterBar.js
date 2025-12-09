import React from 'react';
import { useTranslation } from 'react-i18next';

export default function FilterBar({ filters, categories, onFilterChange, onReset }) {
  const { t } = useTranslation();
  return (
    <div className="filter-bar">
      <div className="filter-grid">
        <div className="filter-group">
          <label className="filter-label">{t('productAdmin.list.filters.search')}</label>
          <input
            type="text"
            className="filter-input"
            placeholder={t('productAdmin.list.filters.searchPlaceholder')}
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label className="filter-label">{t('productAdmin.list.filters.category')}</label>
          <select
            className="filter-select"
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
          >
            <option value="">{t('productAdmin.list.filters.categoryAll')}</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name_ja || cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label className="filter-label">{t('productAdmin.list.filters.sort')}</label>
          <select
            className="filter-select"
            value={filters.sort}
            onChange={(e) => onFilterChange('sort', e.target.value)}
          >
            <option value="recent">{t('productAdmin.list.filters.sortOptions.recent')}</option>
            <option value="name">{t('productAdmin.list.filters.sortOptions.name')}</option>
            <option value="sales">{t('productAdmin.list.filters.sortOptions.sales')}</option>
            <option value="rating">{t('productAdmin.list.filters.sortOptions.rating')}</option>
            <option value="price">{t('productAdmin.list.filters.sortOptions.price')}</option>
          </select>
        </div>
        <div className="filter-group">
          <button className="btn btn-secondary btn-sm" onClick={onReset}>
            {t('productAdmin.list.filters.reset')}
          </button>
        </div>
      </div>
    </div>
  );
}

