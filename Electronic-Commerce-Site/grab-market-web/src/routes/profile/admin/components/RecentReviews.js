import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../../../../config/constants';

export default function RecentReviews({ reviews }) {
  const { t, i18n } = useTranslation();
  return (
    <div
      style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #E5E7EB',
      }}
    >
      <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1A1A1A', marginBottom: '24px' }}>
        {t('profile.admin.recentReviews.title')}
      </h2>
      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">{t('profile.admin.recentReviews.empty')}</p>
        </div>
      ) : (
        <div className="reviews-container">
          {reviews.map((review) => {
            const reviewId = review.id || review.review_id;
            const productId = review.product_id || review.product?.id || review.order_item?.product_id;
            const productName = review.product_name || review.product?.name || review.order_item?.product?.name || review.aiName || t('profile.admin.recentReviews.productFallback');
            const productImage = review.product_image || review.product?.image || review.order_item?.product?.imageUrl;

            return (
              <div key={reviewId} className="review-card">
                <div className="review-header">
                  <div className="review-avatar">
                    {productImage ? (
                      <img 
                        src={`${API_URL}/${productImage}`}
                        alt={productName}
                        style={{
                          width: '48px',
                          height: '48px',
                          objectFit: 'cover',
                          borderRadius: '12px',
                          border: '1px solid #E5E7EB'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.textContent = productName.substring(0, 2);
                        }}
                      />
                    ) : (
                      productName.substring(0, 2)
                    )}
                  </div>
                  <div className="review-info">
                    <Link
                      to={`/products/${productId}`}
                      className="review-product-name"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {productName}
                    </Link>
                    <div className="review-rating">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`star ${i < (review.rating || 0) ? 'filled' : 'empty'}`}
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill={i < (review.rating || 0) ? 'currentColor' : 'none'}
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="review-body">
                  {(review.comment || review.text || review.review_text) && (
                    <p className="review-content">
                      {review.comment || review.text || review.review_text}
                    </p>
                  )}
                  <span className="review-date">
                    {review.created_at
                      ? new Date(review.created_at).toLocaleDateString(i18n.language, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : review.date || ''}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


