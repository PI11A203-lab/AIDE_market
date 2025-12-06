import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, X, Check } from 'lucide-react';
import { message, Image } from 'antd';
import { api } from '../../config/api';
import { API_URL } from '../../config/constants';
import { clearRatingCache } from '../../utils/ratingCache';

export default function ReviewsTab({ reviews, productId, onReviewUpdate, onHelpfulUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ rating: 0, comment: '' });
  const [deletingId, setDeletingId] = useState(null);
  const [helpfulLoading, setHelpfulLoading] = useState({});
  const [reviewsState, setReviewsState] = useState(reviews);
  
  // reviews prop이 변경되면 상태 업데이트
  useEffect(() => {
    setReviewsState(reviews);
  }, [reviews]);

  // 수정 시작
  const handleEditStart = (review) => {
    setEditingId(review.id);
    setEditForm({
      rating: review.rating || 0,
      comment: review.text || ''
    });
  };

  // 수정 취소
  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm({ rating: 0, comment: '' });
  };

  // 수정 저장
  const handleEditSave = async (reviewId) => {
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

  // helpful 버튼 클릭 핸들러
  const handleHelpfulToggle = async (reviewId, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    
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

    // 본인 리뷰는 helpful 할 수 없음
    const review = reviewsState.find(r => r.id === reviewId);
    if (review && review.isCurrentUser) {
      message.warning('본인의 리뷰에는 helpful을 할 수 없습니다.');
      return;
    }

    setHelpfulLoading({ ...helpfulLoading, [reviewId]: true });
    
    try {
      const response = await api.reviews.toggleHelpful(reviewId, userData.id);
      const { helpful_count, action } = response.data;

      const newHelpfulCount = helpful_count || 0;
      const newIsHelpful = action === 'added';

      // 로컬 리뷰 상태 즉시 업데이트
      setReviewsState(prevReviews => 
        prevReviews.map(r => 
          r.id === reviewId 
            ? { 
                ...r, 
                helpful: newHelpfulCount,
                is_helpful: newIsHelpful
              }
            : r
        )
      );

      // 부모 컴포넌트에 즉시 업데이트
      if (onHelpfulUpdate) {
        onHelpfulUpdate(reviewId, newHelpfulCount, newIsHelpful);
      }

      // 백그라운드에서 전체 리뷰 목록 새로고침 (선택적)
      if (onReviewUpdate) {
        onReviewUpdate();
      }
    } catch (error) {
      console.error('Failed to toggle helpful:', error);
      const errorMessage = error.response?.data?.error || 'helpful 처리에 실패했습니다.';
      message.error(errorMessage);
    } finally {
      setHelpfulLoading({ ...helpfulLoading, [reviewId]: false });
    }
  };

  // 삭제
  const handleDelete = async (reviewId) => {
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

  return (
    <div className="flex flex-col gap-8">
      {reviewsState.map((review) => {
        const isEditing = editingId === review.id;
        const isDeleting = deletingId === review.id;
        const isCurrentUserReview = review.isCurrentUser || false;

        return (
          <div key={review.id} className="pb-8 border-b border-gray-200 last:border-0 last:pb-0">
            <div className="flex items-start gap-4">
              {/* 48px 아바타 */}
              <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                {review.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="font-bold text-base text-gray-900 mb-0.5">{review.author}</div>
                    <div className="text-[13px] text-gray-400">{review.date}</div>
                  </div>
                  {/* 본인 리뷰만 수정/삭제 버튼 표시 */}
                  {isCurrentUserReview && !isEditing && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditStart(review)}
                        disabled={isDeleting}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="수정"
                      >
                        <Edit2 className="w-4.5 h-4.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(review.id)}
                        disabled={isDeleting}
                        className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="삭제"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  )}
                </div>
                {!isEditing && (
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < (review.rating || 0)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-200 fill-gray-200'
                        }`}
                        viewBox="0 0 24 24"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    ))}
                  </div>
                )}
                <div className="mb-3">
                  <span className="inline-block px-3.5 py-1.5 bg-blue-50 text-blue-700 rounded-md text-[13px] font-semibold">
                    {review.project}
                  </span>
                </div>

                {/* 수정 모드 */}
                {isEditing ? (
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">별점</label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-6 h-6 cursor-pointer transition-colors ${
                              star <= editForm.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300 fill-gray-300'
                            }`}
                            onClick={() => setEditForm({ ...editForm, rating: star })}
                            viewBox="0 0 24 24"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                          </svg>
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
                        onClick={() => handleEditSave(review.id)}
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
                      <h4 className="text-base font-bold text-gray-900 mb-2">
                        {review.title}
                      </h4>
                    )}
                    
                    {/* 리뷰 내용 */}
                    {review.text && (
                      <p className="text-[15px] text-gray-600 leading-[1.7] mb-4">{review.text}</p>
                    )}
                    
                    {/* 리뷰 이미지 */}
                    {review.review_images && Array.isArray(review.review_images) && review.review_images.length > 0 && (
                      <div className="mb-4">
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
                    
                    {/* Helpful 정보 표시 */}
                    <div className="flex items-center gap-4">
                      {/* Helpful 수 표시 (모든 리뷰에 표시) */}
                      <span className="text-sm text-gray-500">
                        {review.helpful || 0}人のお客様がこれが役に立ったと考えています
                      </span>
                      
                      {/* Helpful 버튼 (본인 리뷰가 아닐 때만 표시) */}
                      {!isCurrentUserReview && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleHelpfulToggle(review.id, e);
                          }}
                          onMouseDown={(e) => {
                            e.preventDefault();
                          }}
                          disabled={helpfulLoading[review.id]}
                          className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            review.is_helpful
                              ? 'bg-blue-50 text-blue-700 border-blue-300'
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                          }`}
                          style={{ 
                            pointerEvents: helpfulLoading[review.id] ? 'none' : 'auto',
                            cursor: helpfulLoading[review.id] ? 'not-allowed' : 'pointer',
                            zIndex: 10,
                            position: 'relative'
                          }}
                        >
                          <svg className={`w-4 h-4 ${review.is_helpful ? 'fill-current' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                          </svg>
                          参考になった
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
