import React from 'react';

export default function FilterBar({ 
  filters, 
  products, 
  onFilterChange, 
  onReset 
}) {
  return (
    <div className="filter-bar">
      <div className="filter-grid">
        <div className="filter-group">
          <label className="filter-label">Search Reviews</label>
          <input
            type="text"
            className="filter-input"
            placeholder="Search by reviewer or content..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label className="filter-label">Product</label>
          <select
            className="filter-select"
            value={filters.product}
            onChange={(e) => onFilterChange('product', e.target.value)}
          >
            <option value="">All Products</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.icon} {product.name}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label className="filter-label">Rating</label>
          <select
            className="filter-select"
            value={filters.rating}
            onChange={(e) => onFilterChange('rating', e.target.value)}
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
        <div className="filter-group">
          <label className="filter-label">Sort By</label>
          <select
            className="filter-select"
            value={filters.sort}
            onChange={(e) => onFilterChange('sort', e.target.value)}
          >
            <option value="recent">Recent</option>
            <option value="oldest">Oldest</option>
            <option value="rating-high">Rating (High)</option>
            <option value="rating-low">Rating (Low)</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
        <div className="filter-group">
          <button className="btn btn-secondary btn-sm" onClick={onReset}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

