import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import StarRating from '../../components/StarRating';

export default function LatestReviewSection({ latestReview, productId, formatDate }) {
  return (
    <section className="admin-product-detail__review">
      <div className="section-header">
        <div>
          <div className="section-title">Latest Review</div>
          <div className="section-subtitle">최근 1개의 리뷰</div>
        </div>
        <Link to={`/products/${productId}#reviews`} className="view-all">
          View All Reviews
          <ExternalLink size={14} />
        </Link>
      </div>
      {latestReview ? (
        <div className="review-card">
          <div className="review-avatar">
            {(latestReview.author || 'A').substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="review-header">
              <div className="review-author">{latestReview.author}</div>
              <StarRating rating={latestReview.rating} />
            </div>
            <div className="review-date">{formatDate(latestReview.date)}</div>
            <p className="review-comment">{latestReview.comment || 'No comment provided.'}</p>
          </div>
        </div>
      ) : (
        <div className="review-empty">아직 리뷰가 없습니다.</div>
      )}
    </section>
  );
}

