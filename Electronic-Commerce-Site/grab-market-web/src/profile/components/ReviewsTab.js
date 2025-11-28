import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

export default function ReviewsTab({ reviews }) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-16 px-8">
        <p className="text-lg text-gray-600 mb-4">작성한 리뷰가 없습니다.</p>
        <Link 
          to="/" 
          className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold no-underline transition-all hover:shadow-lg hover:-translate-y-0.5"
        >
          상품 둘러보기
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <Link 
          key={review.id || review.review_id}
          to={`/products/${review.product_id || review.order_item?.product_id}`}
          className="block bg-white border border-gray-200 rounded-xl p-6 transition-all hover:shadow-md hover:border-gray-300 no-underline"
        >
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold text-gray-900">
              {review.product?.name || review.order_item?.product?.name || review.aiName || 'AI Developer'}
            </h3>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < (review.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
          </div>
          <p className="text-gray-700 mb-3">{review.comment || review.text || ''}</p>
          <span className="text-sm text-gray-500">
            {review.created_at 
              ? new Date(review.created_at).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              : review.date || ''}
          </span>
        </Link>
      ))}
    </div>
  );
}
