import React from 'react';
import ReviewForm from '../ReviewForm';
import './index.css';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../../../../config/constants';

export default function OrderItem({
  item,
  reviewForm,
  onRatingClick,
  onTitleChange,
  onCommentChange,
  onImageChange,
  onImageRemove,
  onSubmitReview
}) {
  const { t } = useTranslation();
  if (!item.product) {
    return (
      <div className="order-item">
        <div className="order-item-error">
          <p>{t('order.item.noProduct')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-item">
      <div className="product-header">
        <div className="product-avatar">
          {item.product.imageUrl ? (
            <img 
              src={`${API_URL}/${item.product.imageUrl}`} 
              alt={item.product.name}
              className="product-image"
            />
          ) : (
            <span>{item.product.name.substring(0, 2)}</span>
          )}
        </div>
        <div className="product-info">
          <h3 className="product-name">{item.product.name}</h3>
          <p className="product-category">{item.product.category_name || 'NLP'}</p>
          <div className="product-tags">
            {(item.tags || []).slice(0, 3).map((tag, idx) => (
              <span key={idx} className="product-tag">
                {tag.name || tag}
              </span>
            ))}
          </div>
        </div>
        <div className="product-price">
          ¥{item.unit_price?.toLocaleString() || item.product.price?.toLocaleString() || '0'}
        </div>
      </div>

      {/* 리뷰 작성 섹션 */}
      <div className="review-section">
        <ReviewForm
          itemId={item.id}
          productId={item.product_id}
          hasReview={item.has_review}
          reviewForm={reviewForm}
          onRatingClick={onRatingClick}
          onTitleChange={onTitleChange}
          onCommentChange={onCommentChange}
          onImageChange={onImageChange}
          onImageRemove={onImageRemove}
          onSubmitReview={onSubmitReview}
        />
      </div>
    </div>
  );
}

