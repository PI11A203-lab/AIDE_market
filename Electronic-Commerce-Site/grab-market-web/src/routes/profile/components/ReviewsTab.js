import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, X, Check } from 'lucide-react';
import { message, Image } from 'antd';
import axios from 'axios';
import { api } from '../../../config/api';
import { API_URL } from '../../../config/constants';
import { clearRatingCache, setRatingCache } from '../../../utils/ratingCache';
import { getReviewContent } from '../../../utils/getReviewContent';
import { useTranslation } from 'react-i18next';

export default function ReviewsTab({ reviews, onReviewUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ rating: 0, comment: '' });
  const [deletingId, setDeletingId] = useState(null);
  const { t, i18n } = useTranslation();

  // 수정 시작
  const handleEditStart = (review) => {
    setEditingId(review.id || review.review_id);
    setEditForm({
      rating: review.rating || 0,
      comment: getReviewContent(review, i18n.language) || ''
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
      message.warning(t('profile.reviews.selectRating'));
      return;
    }

    // 로그인한 유저 정보 가져오기
    const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!userFromStorage) {
      message.warning(t('profile.reviews.loginRequired'));
      return;
    }

    let userData;
    try {
      userData = JSON.parse(userFromStorage);
    } catch (e) {
      message.error(t('profile.reviews.parseError'));
      return;
    }

    try {
      await api.reviews.update(reviewId, {
        user_id: userData.id,
        rating: editForm.rating,
        review_text: editForm.comment.trim()
      });

      message.success(t('profile.reviews.updateSuccess'));
      
      // 별점 캐시 삭제 (다음 로드 시 최신 별점으로 갱신)
      if (productId) {
        clearRatingCache(productId);
        
        // 상품 정보를 즉시 업데이트하여 별점과 리뷰 수를 최신화
        let updateSuccess = false;
        try {
          const productResponse = await axios.get(`${API_URL}/api/products/${productId}`);
          const updatedProduct = productResponse.data?.product;
          
          if (updatedProduct) {
            // 업데이트된 상품 정보로 별점 캐시 갱신
            setRatingCache(productId, updatedProduct.rating_average, updatedProduct.rating_count);
            updateSuccess = true;
          }
        } catch (productError) {
          console.error('Failed to update product info after review update:', productError);
        }
        
        // 업데이트 실패 시에도 문제없음:
        // 1. 캐시는 이미 삭제되어 다음 로드 시 최신 정보를 받을 수 있음
        // 2. 백엔드에서는 이미 별점과 리뷰 수가 업데이트됨
        // 3. 페이지 새로고침 또는 상품 페이지 방문 시 자동으로 최신 정보 반영
        if (!updateSuccess) {
          console.warn(`상품 정보 즉시 업데이트 실패 (productId: ${productId}). 다음 로드 시 최신 정보가 반영됩니다.`);
        }
      }

      // 부모 컴포넌트에 리뷰 목록 새로고침 요청
      if (onReviewUpdate) {
        onReviewUpdate();
      }

      setEditingId(null);
      setEditForm({ rating: 0, comment: '' });
    } catch (error) {
      console.error('Failed to update review:', error);
      const errorMessage = error.response?.data?.error || t('profile.reviews.updateFail');
      message.error(errorMessage);
    }
  };

  // 삭제
  const handleDelete = async (reviewId, productId) => {
    if (!reviewId) {
      message.error(t('profile.reviews.noReviewId'));
      return;
    }

    if (!window.confirm(t('profile.reviews.deleteConfirm'))) {
      return;
    }

    // 로그인한 유저 정보 가져오기
    const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!userFromStorage) {
      message.warning(t('profile.reviews.loginRequired'));
      return;
    }

    let userData;
    try {
      userData = JSON.parse(userFromStorage);
    } catch (e) {
      message.error(t('profile.reviews.parseError'));
      return;
    }

    if (!userData || !userData.id) {
      message.error(t('profile.reviews.noUserId'));
      return;
    }

    setDeletingId(reviewId);
    try {
      console.log('리뷰 삭제 시도:', { 
        reviewId, 
        userId: userData.id, 
        productId,
        review: reviews.find(r => (r.id || r.review_id) === reviewId)
      });
      
      // DELETE 요청에 user_id를 query parameter로 전달
      const deleteResponse = await api.reviews.delete(reviewId, { params: { user_id: userData.id } });
      
      console.log('리뷰 삭제 API 응답:', deleteResponse.data);

      if (!deleteResponse || !deleteResponse.data) {
        throw new Error('삭제 응답이 올바르지 않습니다.');
      }

      message.success(t('profile.reviews.deleteSuccess'));
      
      // 별점 캐시 삭제 (다음 로드 시 최신 별점으로 갱신)
      if (productId) {
        clearRatingCache(productId);
        
        // 상품 정보를 즉시 업데이트하여 별점과 리뷰 수를 최신화
        let updateSuccess = false;
        try {
          const productResponse = await axios.get(`${API_URL}/api/products/${productId}`);
          const updatedProduct = productResponse.data?.product;
          
          if (updatedProduct) {
            // 업데이트된 상품 정보로 별점 캐시 갱신
            setRatingCache(productId, updatedProduct.rating_average, updatedProduct.rating_count);
            updateSuccess = true;
          }
        } catch (productError) {
          console.error('Failed to update product info after review deletion:', productError);
        }
        
        // 업데이트 실패 시에도 문제없음:
        // 1. 캐시는 이미 삭제되어 다음 로드 시 최신 정보를 받을 수 있음
        // 2. 백엔드에서는 이미 별점과 리뷰 수가 업데이트됨
        // 3. 페이지 새로고침 또는 상품 페이지 방문 시 자동으로 최신 정보 반영
        if (!updateSuccess) {
          console.warn(`상품 정보 즉시 업데이트 실패 (productId: ${productId}). 다음 로드 시 최신 정보가 반영됩니다.`);
        }
      }

      // 부모 컴포넌트에 리뷰 목록 새로고침 요청 (즉시 실행)
      console.log('리뷰 목록 새로고침 요청');
      if (onReviewUpdate) {
        onReviewUpdate();
      } else {
        console.warn('onReviewUpdate 콜백이 없습니다.');
      }
    } catch (error) {
      console.error('리뷰 삭제 실패:', {
        error,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data,
        reviewId,
        userId: userData?.id
      });
      
      let errorMessage = t('profile.reviews.deleteFail');
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.status === 400) {
        errorMessage = t('profile.reviews.deleteUnauthorized');
      } else if (error.response?.status === 404) {
        errorMessage = t('profile.reviews.deleteNotFound');
      } else if (error.response?.status === 500) {
        errorMessage = t('profile.reviews.deleteServerError');
      }
      
      message.error(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">{t('profile.reviews.empty')}</p>
      </div>
    );
  }

  return (
    <div className="reviews-container">
      {reviews.map((review) => {
        const reviewId = review.id || review.review_id;
        const productId = review.product_id || review.order_item?.product_id;
        const isEditing = editingId === reviewId;
        const isDeleting = deletingId === reviewId;

        return (
          <div
            key={reviewId}
            className="review-card"
          >
            {/* 아바타를 왼쪽에 따로 배치 */}
            <div className="review-avatar">
              {(() => {
                const productImageUrl = review.product?.imageUrl || review.order_item?.product?.imageUrl;
                const productName = review.product?.name || review.order_item?.product?.name || review.aiName || 'AI';
                
                if (productImageUrl) {
                  return (
                    <img
                      src={`${API_URL}/${productImageUrl}`}
                      alt={productName}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.textContent = productName.substring(0, 2);
                      }}
                    />
                  );
                }
                return productName.substring(0, 2);
              })()}
            </div>
            
            {/* 오른쪽 컨텐츠 영역 */}
            <div className="review-content-wrapper">
              <div className="review-header">
                <div className="review-info">
                  <Link
                    to={`/products/${productId}`}
                    className="review-product-name"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {review.product?.name || review.order_item?.product?.name || review.aiName || 'AI Developer'}
                  </Link>
                  {!isEditing && (
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
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* 수정/삭제 버튼 */}
                <div className="review-actions">
                  <button
                    onClick={() => handleEditStart(review)}
                    disabled={isEditing || isDeleting}
                    className="btn-icon"
                    title={t('profile.reviews.edit')}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(reviewId, productId)}
                    disabled={isEditing || isDeleting}
                    className="btn-icon btn-delete"
                    title={t('profile.reviews.delete')}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* 수정 모드 */}
              {isEditing ? (
                <div className="space-y-4 pb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('profile.reviews.ratingLabel')}</label>
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
                    <span className="ml-2 text-sm text-gray-600">{t('profile.reviews.ratingPoints', { rating: editForm.rating })}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('profile.reviews.reviewContentLabel')}</label>
                  <textarea
                    value={editForm.comment}
                    onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder={t('profile.reviews.reviewPlaceholder')}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditSave(reviewId, productId)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    {t('profile.reviews.save')}
                  </button>
                  <button
                    onClick={handleEditCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    {t('profile.reviews.cancel')}
                  </button>
                </div>
              </div>
              ) : (
                <div className="review-body">
                  {/* 리뷰 제목 */}
                  {review.title && (
                    <h3 className="review-title">
                      {review.title}
                    </h3>
                  )}
                  
                  {/* 리뷰 내용 */}
                  {(() => {
                    const content = getReviewContent(review, i18n.language);
                    return content ? <p className="review-content">{content}</p> : null;
                  })()}
                  
                  {/* 리뷰 이미지 */}
                  {review.review_images && Array.isArray(review.review_images) && review.review_images.length > 0 && (
                    <div className="mb-3">
                      <Image.PreviewGroup>
                        <div className="flex flex-wrap gap-2">
                          {review.review_images.map((imageUrl, index) => (
                            <Image
                              key={index}
                              src={imageUrl.startsWith('http') ? imageUrl : `${API_URL}/${imageUrl}`}
                              alt={t('profile.reviews.reviewImage', { index: index + 1 })}
                              className="object-cover rounded-lg"
                              width={100}
                              height={100}
                              style={{ cursor: 'pointer' }}
                              preview={{
                                mask: t('profile.reviews.expand')
                              }}
                            />
                          ))}
                        </div>
                      </Image.PreviewGroup>
                    </div>
                  )}
                  
                  <span className="review-date">
                    {review.created_at 
                      ? new Date(review.created_at).toLocaleDateString(
                          i18n.language === 'ko' ? 'ko-KR' : 
                          i18n.language === 'ja' ? 'ja-JP' : 'en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : review.date || ''}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
