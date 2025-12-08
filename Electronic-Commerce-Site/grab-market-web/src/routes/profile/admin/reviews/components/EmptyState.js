import React from 'react';

export default function EmptyState({ hasFilters }) {
  return (
    <div className="reviews-container">
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <div className="empty-title">
          {hasFilters ? 'No reviews found' : 'No reviews yet'}
        </div>
        <div className="empty-description">
          {hasFilters
            ? 'Try adjusting your filters to see more results.'
            : 'Reviews will appear here once customers start leaving feedback.'}
        </div>
      </div>
    </div>
  );
}

