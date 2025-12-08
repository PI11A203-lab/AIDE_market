import React from 'react';

export default function FilterBar({ filters, categories, onFilterChange, onReset }) {
  return (
    <div className="filter-bar">
      <div className="filter-grid">
        <div className="filter-group">
          <label className="filter-label">Search</label>
          <input
            type="text"
            className="filter-input"
            placeholder="Search by product name..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label className="filter-label">Category</label>
          <select
            className="filter-select"
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name_ja || cat.name}
              </option>
            ))}
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
            <option value="name">Name</option>
            <option value="sales">Sales</option>
            <option value="rating">Rating</option>
            <option value="price">Price</option>
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

