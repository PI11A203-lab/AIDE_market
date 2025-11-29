import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Edit2, Trash2, X, Check } from 'lucide-react';
import { message, Image } from 'antd';
import { api } from '../../config/api';
import { API_URL } from '../../config/constants';
import { clearRatingCache } from '../../utils/ratingCache';

export default function ReviewsTab({ reviews, onReviewUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ rating: 0, comment: '' });
  const [deletingId, setDeletingId] = useState(null);

  // 수정 시작
  const handleEditStart = (review) => {
    setEditingId(review.id || review.review_id);
    setEditForm({
      rating: review.rating || 0,
      comment: review.comment || review.text || review.review_text || ''
    });
  };

  // 수정 취소
  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm({ rating: 0, comment: '' });
  };

  // 수정 저장
  const handleEditSave = async (reviewId, productId) => {
    if (!editForm.rating || editForm.rating < 1) {
      message.warning('별점을 선택해주세요.');
      return;
    }

    // 로그인한 유저 정보 가져오기
    const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!userFromStorage) {
      message.warning('로그인이 필요합니다.');
      return;
    }

    let userData;
    try {
      userData = JSON.parse(userFromStorage);
    } catch (e) {
      message.error('사용자 정보를 불러올 수 없습니다.');
      return;
    }

    try {
      await api.reviews.update(reviewId, {
        user_id: userData.id,
        rating: editForm.rating,
        review_text: editForm.comment.trim()
      });

      message.success('리뷰가 수정되었습니다.');
      
      // 별점 캐시 삭제 (다음 로드 시 최신 별점으로 갱신)
      if (productId) {
        clearRatingCache(productId);
      }

      // 부모 컴포넌트에 리뷰 목록 새로고침 요청
      if (onReviewUpdate) {
        onReviewUpdate();
      }

      setEditingId(null);
      setEditForm({ rating: 0, comment: '' });
    } catch (error) {
      console.error('Failed to update review:', error);
      const errorMessage = error.response?.data?.error || '리뷰 수정에 실패했습니다.';
      message.error(errorMessage);
    }
  };

  // 삭제
  const handleDelete = async (reviewId, productId) => {
    if (!window.confirm('정말 이 리뷰를 삭제하시겠습니까?')) {
      return;
    }

    // 로그인한 유저 정보 가져오기
    const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!userFromStorage) {
      message.warning('로그인이 필요합니다.');
      return;
    }

    let userData;
    try {
      userData = JSON.parse(userFromStorage);
    } catch (e) {
      message.error('사용자 정보를 불러올 수 없습니다.');
      return;
    }

    setDeletingId(reviewId);
    try {
      // DELETE 요청에 user_id를 query parameter로 전달
      await api.reviews.delete(reviewId, { params: { user_id: userData.id } });

      message.success('리뷰가 삭제되었습니다.');
      
      // 별점 캐시 삭제 (다음 로드 시 최신 별점으로 갱신)
      if (productId) {
        clearRatingCache(productId);
      }

      // 부모 컴포넌트에 리뷰 목록 새로고침 요청
      if (onReviewUpdate) {
        onReviewUpdate();
      }
    } catch (error) {
      console.error('Failed to delete review:', error);
      const errorMessage = error.response?.data?.error || '리뷰 삭제에 실패했습니다.';
      message.error(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

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
      {reviews.map((review) => {
        const reviewId = review.id || review.review_id;
        const productId = review.product_id || review.order_item?.product_id;
        const isEditing = editingId === reviewId;
        const isDeleting = deletingId === reviewId;

        return (
          <div
            key={reviewId}
            className="relative bg-white border border-gray-200 rounded-xl p-6 transition-all hover:shadow-md"
          >
            {/* 수정/삭제 버튼 */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={() => handleEditStart(review)}
                disabled={isEditing || isDeleting}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="수정"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(reviewId, productId)}
                disabled={isEditing || isDeleting}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="삭제"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-start justify-between mb-3 gap-4 pr-20">
              {/* AI 이미지 / 아바타 영역 */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {(review.product?.name || review.order_item?.product?.name || review.aiName || 'AI').substring(0, 2)}
              </div>

              {/* 상품명 + 별점 */}
              <div className="flex-1 flex items-start justify-between gap-4">
                <div>
                  <Link
                    to={`/products/${productId}`}
                    className="text-xl font-bold text-gray-900 hover:text-blue-600 no-underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {review.product?.name || review.order_item?.product?.name || review.aiName || 'AI Developer'}
                  </Link>
                </div>
                {!isEditing && (
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < (review.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 수정 모드 */}
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">별점</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-6 h-6 cursor-pointer transition-colors ${
                          star <= editForm.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                        onClick={() => setEditForm({ ...editForm, rating: star })}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">{editForm.rating}점</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">리뷰 내용</label>
                  <textarea
                    value={editForm.comment}
                    onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="리뷰를 작성해주세요..."
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditSave(reviewId, productId)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    저장
                  </button>
                  <button
                    onClick={handleEditCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* 리뷰 제목 */}
                {review.title && (
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {review.title}
                  </h3>
                )}
                
                {/* 리뷰 내용 */}
                {(review.comment || review.text || review.review_text) && (
                  <p className="text-gray-700 mb-3">
                    {review.comment || review.text || review.review_text}
                  </p>
                )}
                
                {/* 리뷰 이미지 */}
                {review.review_images && Array.isArray(review.review_images) && review.review_images.length > 0 && (
                  <div className="mb-3">
                    <Image.PreviewGroup>
                      <div className="flex flex-wrap gap-2">
                        {review.review_images.map((imageUrl, index) => (
                          <Image
                            key={index}
                            src={imageUrl.startsWith('http') ? imageUrl : `${API_URL}/${imageUrl}`}
                            alt={`리뷰 이미지 ${index + 1}`}
                            className="object-cover rounded-lg"
                            width={100}
                            height={100}
                            style={{ cursor: 'pointer' }}
                            preview={{
                              mask: '확대'
                            }}
                          />
                        ))}
                      </div>
                    </Image.PreviewGroup>
                  </div>
                )}
                
                <span className="text-sm text-gray-500">
                  {review.created_at 
                    ? new Date(review.created_at).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : review.date || ''}
                </span>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
