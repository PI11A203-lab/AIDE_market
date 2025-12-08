import React from 'react';
import { Link } from 'react-router-dom';
import StarRating from '../../../../product/admin/components/StarRating';

export default function ReviewItem({ review }) {
  const getInitials = (username) => {
    if (!username) return 'U';
    const parts = username.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return username.substring(0, 2).toUpperCase();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="review-item">
      <div className="review-header">
        <div className="review-avatar">
          {getInitials(review.user?.username || 'User')}
        </div>
        <div className="review-info">
          <div className="review-top">
            <div>
              <div className="review-author">{review.user?.username || 'User'}</div>
              <div className="review-meta">
                <span>{formatDate(review.created_at)}</span>
                <span>•</span>
                <span>{review.verified ? 'Verified Purchase' : 'Not Verified'}</span>
              </div>
            </div>
            <div className="review-stars">
              <StarRating rating={review.rating} />
            </div>
          </div>
          <span className="review-product">
            {review.product?.icon} {review.product?.name}
          </span>
          <p className="review-text">{review.comment}</p>
          <div className="review-footer">
            <div className="review-helpful">
              <span className="helpful-count">
                {review.helpful_count || 0} people found this helpful
              </span>
            </div>
            <div className="review-actions">
              <Link 
                to={`/products/${review.product?.id}`}
                className="btn btn-secondary btn-sm"
              >
                View Product
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

