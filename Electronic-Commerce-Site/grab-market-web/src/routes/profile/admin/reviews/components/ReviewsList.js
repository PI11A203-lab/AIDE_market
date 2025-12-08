import React from 'react';
import ReviewItem from './ReviewItem';
import EmptyState from './EmptyState';

export default function ReviewsList({ reviews, hasFilters }) {
  if (reviews.length === 0) {
    return <EmptyState hasFilters={hasFilters} />;
  }

  return (
    <div className="reviews-container">
      <div className="reviews-list">
        {reviews.map(review => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}

