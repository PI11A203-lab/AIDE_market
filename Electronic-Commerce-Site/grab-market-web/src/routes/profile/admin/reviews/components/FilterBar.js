import React from 'react';
import { useTranslation } from 'react-i18next';

export default function FilterBar({ 
  filters, 
  products, 
  onFilterChange, 
  onReset 
}) {
  const { t } = useTranslation();
  return (
    <div className="filter-bar">
      <div className="filter-grid">
        <div className="filter-group">
          <label className="filter-label">{t('profile.admin.reviewsPage.filters.search')}</label>
          <input
            type="text"
            className="filter-input"
            placeholder={t('profile.admin.reviewsPage.filters.searchPlaceholder')}
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label className="filter-label">{t('profile.admin.reviewsPage.filters.product')}</label>
          <select
            className="filter-select"
            value={filters.product}
            onChange={(e) => onFilterChange('product', e.target.value)}
          >
            <option value="">{t('profile.admin.reviewsPage.filters.productAll')}</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.icon} {product.name}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label className="filter-label">{t('profile.admin.reviewsPage.filters.rating')}</label>
          <select
            className="filter-select"
            value={filters.rating}
            onChange={(e) => onFilterChange('rating', e.target.value)}
          >
            <option value="">{t('profile.admin.reviewsPage.filters.ratingAll')}</option>
            <option value="5">{t('profile.admin.reviewsPage.filters.ratingOption.five')}</option>
            <option value="4">{t('profile.admin.reviewsPage.filters.ratingOption.four')}</option>
            <option value="3">{t('profile.admin.reviewsPage.filters.ratingOption.three')}</option>
            <option value="2">{t('profile.admin.reviewsPage.filters.ratingOption.two')}</option>
            <option value="1">{t('profile.admin.reviewsPage.filters.ratingOption.one')}</option>
          </select>
        </div>
        <div className="filter-group">
          <label className="filter-label">{t('profile.admin.reviewsPage.filters.sort')}</label>
          <select
            className="filter-select"
            value={filters.sort}
            onChange={(e) => onFilterChange('sort', e.target.value)}
          >
            <option value="recent">{t('profile.admin.reviewsPage.filters.sortOptions.recent')}</option>
            <option value="oldest">{t('profile.admin.reviewsPage.filters.sortOptions.oldest')}</option>
            <option value="rating-high">{t('profile.admin.reviewsPage.filters.sortOptions.ratingHigh')}</option>
            <option value="rating-low">{t('profile.admin.reviewsPage.filters.sortOptions.ratingLow')}</option>
            <option value="helpful">{t('profile.admin.reviewsPage.filters.sortOptions.helpful')}</option>
          </select>
        </div>
        <div className="filter-group">
          <button className="btn btn-secondary btn-sm" onClick={onReset}>
            {t('profile.admin.reviewsPage.filters.reset')}
          </button>
        </div>
      </div>
    </div>
  );
}

