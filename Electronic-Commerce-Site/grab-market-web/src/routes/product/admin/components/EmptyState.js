import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

export default function EmptyState({ hasFilters, onCreateNew }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">📦</div>
      <div className="empty-title">No products found</div>
      <div className="empty-description">
        {hasFilters
          ? 'Try adjusting your filters'
          : 'Get started by creating your first product'}
      </div>
      {!hasFilters && (
        <Link to="/profile/products/new" className="btn btn-primary" style={{ marginTop: '16px' }}>
          <Plus size={20} />
          New Product
        </Link>
      )}
    </div>
  );
}

