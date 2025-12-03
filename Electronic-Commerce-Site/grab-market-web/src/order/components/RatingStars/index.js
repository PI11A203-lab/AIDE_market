import React from 'react';
import { Star } from 'lucide-react';
import './index.css';

export default function RatingStars({ rating, onRatingClick, interactive = true }) {
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
        <span className="rating-value">{rating}점</span>
      )}
    </div>
  );
}

