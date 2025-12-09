import React from 'react';
import { Star } from 'lucide-react';
import './index.css';
import { useTranslation } from 'react-i18next';

export default function RatingStars({ rating, onRatingClick, interactive = true }) {
  const { t } = useTranslation();
  return (
    <div className="rating-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`star-icon ${rating >= star ? 'filled' : 'empty'}`}
          onClick={interactive ? () => onRatingClick(star) : undefined}
          style={interactive ? { cursor: 'pointer' } : { cursor: 'default' }}
        />
      ))}
      {rating > 0 && (
        <span className="rating-value">{t('order.review.ratingValue', { rating })}</span>
      )}
    </div>
  );
}

