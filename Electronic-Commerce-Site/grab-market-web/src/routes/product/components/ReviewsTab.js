import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Edit2, Trash2, X, Check, ChevronLeft, ChevronRight, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { message, Image, Modal, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { api } from '../../../config/api';
import { API_URL } from '../../../config/constants';
import { clearRatingCache } from '../../../utils/ratingCache';

export default function ReviewsTab({ reviews, productId, onReviewUpdate, onHelpfulUpdate }) {
  const { t, i18n } = useTranslation();
  
  // 날짜를 언어에 맞게 포맷팅하는 함수
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // 유효하지 않은 날짜면 원본 반환
    
    const localeMap = {
      'ko': 'ko-KR',
      'ja': 'ja-JP',
      'en': 'en-US'
    };
    
    const locale = localeMap[i18n.language] || 'en-US';
    
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ rating: 0, comment: '', images: [] });
  const [uploadingImages, setUploadingImages] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [helpfulLoading, setHelpfulLoading] = useState({});
  const [reviewsState, setReviewsState] = useState(reviews);
  const [showAllImagesModal, setShowAllImagesModal] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isReviewExpanded, setIsReviewExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [developerTypeFilter, setDeveloperTypeFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState(null); // null이면 모든 별점, 숫자면 해당 별점만
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [ratingFilterDropdownOpen, setRatingFilterDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const slideContainerRef = useRef(null);
  const filterDropdownRef = useRef(null);
  const ratingFilterDropdownRef = useRef(null);
  
  const REVIEWS_PER_PAGE = 10;
  
  // reviews prop이 변경되면 상태 업데이트
  useEffect(() => {
    setReviewsState(reviews);
  }, [reviews]);

  // 리뷰 선택 시 이미지 인덱스 및 확장 상태 초기화
  useEffect(() => {
    setCurrentImageIndex(0);
    setIsReviewExpanded(false);
  }, [selectedReviewId]);

  // 찜하기 상태 확인
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!productId) return;
      
      const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (!userFromStorage) {
        setIsLiked(false);
        return;
      }

      try {
        const userData = JSON.parse(userFromStorage);
        const response = await api.favorites.check(userData.id, productId);
        setIsLiked(response.data?.isFavorite || false);
      } catch (error) {
        setIsLiked(false);
      }
    };

    checkFavoriteStatus();
  }, [productId]);

  // 찜하기 토글 핸들러
  const handleFavoriteToggle = async () => {
    if (!productId) return;

    const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!userFromStorage) {
      message.warning(t('notifications.product.selectRating'));
      return;
    }

    try {
      const userData = JSON.parse(userFromStorage);
      
      if (isLiked) {
        // 찜목록에서 제거
        await api.favorites.delete(userData.id, productId);
        setIsLiked(false);
        message.success(t('notifications.product.favoriteRemoved'));
      } else {
        // 찜목록에 추가
        await api.favorites.create({
          user_id: userData.id,
          product_id: productId,
        });
        setIsLiked(true);
        message.success(t('notifications.product.favoriteAddedToFavorites'));
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      message.error(t('notifications.product.favoriteUpdateFail'));
    }
  };

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(e.target)) {
        setFilterDropdownOpen(false);
      }
      if (ratingFilterDropdownRef.current && !ratingFilterDropdownRef.current.contains(e.target)) {
        setRatingFilterDropdownOpen(false);
      }
    };

    if (filterDropdownOpen || ratingFilterDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [filterDropdownOpen, ratingFilterDropdownOpen]);

  // 개발자 타입별 필터링된 리뷰
  const filteredReviews = useMemo(() => {
    let filtered = [...reviewsState];
    
    // 개발자 타입 필터 적용
    if (developerTypeFilter) {
      filtered = filtered.filter(review => {
        // developer_type이 정확히 일치하는지 확인
        return review.developer_type === developerTypeFilter;
      });
    }
    
    // 별점 필터 적용
    if (ratingFilter !== null) {
      filtered = filtered.filter(review => {
        const rating = Number(review.rating) || 0;
        const roundedRating = Math.round(rating);
        return roundedRating === ratingFilter;
      });
    }
    
    return filtered;
  }, [reviewsState, developerTypeFilter, ratingFilter]);

  // 페이지네이션된 리뷰
  const paginatedReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
    const endIndex = startIndex + REVIEWS_PER_PAGE;
    return filteredReviews.slice(startIndex, endIndex);
  }, [filteredReviews, currentPage]);

  // 총 페이지 수
  const totalPages = Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE);

  // 필터 변경 시 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1);
  }, [developerTypeFilter, ratingFilter]);

  // 리뷰 이미지 수집 (리뷰 ID와 함께 저장) - 필터링된 리뷰 기준
  const reviewImages = useMemo(() => {
    const images = [];
    filteredReviews.forEach(review => {
      if (review.review_images && Array.isArray(review.review_images) && review.review_images.length > 0) {
        review.review_images.forEach((imageUrl, index) => {
          images.push({
            url: imageUrl.startsWith('http') ? imageUrl : `${API_URL}/${imageUrl}`,
            reviewId: review.id,
            reviewIndex: filteredReviews.indexOf(review),
            imageIndex: index
          });
        });
      }
    });
    return images;
  }, [filteredReviews]);

  // 스크롤 가능 여부 확인
  useEffect(() => {
    const checkScroll = () => {
      const container = slideContainerRef.current;
      if (!container) return;
      
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    };

    const container = slideContainerRef.current;
    if (container) {
      checkScroll();
      container.addEventListener('scroll', checkScroll);
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, [reviewImages.length]);

  // 별점 분포 계산 (전체 리뷰 기준 - 필터와 무관)
  const calculateRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    const total = reviewsState.length;

    reviewsState.forEach(review => {
      const rating = Number(review.rating) || 0;
      // 소수점 별점을 정수로 반올림 (예: 4.5 -> 5, 3.7 -> 4)
      // rating이 0이면 기본값 3으로 설정 (모든 리뷰가 분포에 포함되도록)
      const roundedRating = rating > 0 ? Math.round(rating) : 3;
      if (roundedRating >= 1 && roundedRating <= 5) {
        distribution[roundedRating]++;
      }
    });

    return {
      distribution,
      total,
      percentages: {
        5: total > 0 ? (distribution[5] / total) * 100 : 0,
        4: total > 0 ? (distribution[4] / total) * 100 : 0,
        3: total > 0 ? (distribution[3] / total) * 100 : 0,
        2: total > 0 ? (distribution[2] / total) * 100 : 0,
        1: total > 0 ? (distribution[1] / total) * 100 : 0,
      }
    };
  };

  const ratingStats = calculateRatingDistribution();

  // 개발자 타입 라벨 변환 함수
  const getDeveloperTypeLabel = (type) => {
    if (!type) return '';
    return t(`profile.settings.personalInfo.developerTypes.${type}`, { defaultValue: type });
  };

  // 슬라이드 이동
  const handleSlide = (direction) => {
    const container = slideContainerRef.current;
    if (!container) return;

    const itemWidth = 120 + 12; // 각 이미지 너비(120px) + gap(12px)

    if (direction === 'left') {
      container.scrollBy({ left: -itemWidth * 2, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: itemWidth * 2, behavior: 'smooth' });
    }
  };

  // 특정 리뷰로 스크롤
  const scrollToReview = (reviewId) => {
    const reviewElement = document.querySelector(`[data-review-id="${reviewId}"]`);
    if (reviewElement) {
      reviewElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // 하이라이트 효과
      reviewElement.style.backgroundColor = '#fef3c7';
      setTimeout(() => {
        reviewElement.style.backgroundColor = '';
      }, 2000);
    }
  };

  // 수정 시작
  const handleEditStart = (review) => {
    setEditingId(review.id);
    setEditForm({
      rating: review.rating || 0,
      comment: review.text || '',
      images: review.review_images || []
    });
    setUploadingImages([]);
  };

  // 수정 취소
  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm({ rating: 0, comment: '', images: [] });
    setUploadingImages([]);
  };

  // 수정 저장
  const handleEditSave = async (reviewId) => {
    if (!editForm.rating || editForm.rating < 1) {
      message.warning(t('notifications.product.selectRating'));
      return;
    }

    // 로그인한 유저 정보 가져오기
    const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!userFromStorage) {
      message.warning(t('notifications.product.loginRequired'));
      return;
    }

    let userData;
    try {
      userData = JSON.parse(userFromStorage);
    } catch (e) {
      message.error(t('notifications.product.userInfoLoadFail'));
      return;
    }

    try {
      // 업로드된 새 이미지 URL 가져오기
      const uploadedImageUrls = await Promise.all(
        uploadingImages.map(async (file) => {
          const formData = new FormData();
          formData.append('image', file);
          const response = await axios.post(`${API_URL}/image`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          return response.data.imageUrl;
        })
      );

      // 기존 이미지와 새로 업로드한 이미지 합치기
      const allImages = [...editForm.images, ...uploadedImageUrls];

      await api.reviews.update(reviewId, {
        user_id: userData.id,
        rating: editForm.rating,
        review_text: editForm.comment.trim(),
        review_images: allImages
      });

      message.success(t('notifications.product.reviewUpdated'));
      
      // 별점 캐시 삭제 (다음 로드 시 최신 별점으로 갱신)
      if (productId) {
        clearRatingCache(productId);
      }

      // 부모 컴포넌트에 리뷰 목록 새로고침 요청
      if (onReviewUpdate) {
        onReviewUpdate();
      }

      setEditingId(null);
      setEditForm({ rating: 0, comment: '', images: [] });
      setUploadingImages([]);
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
    
    // Mock 리뷰인지 확인 (ID가 'mock_'로 시작하는 경우)
    const isMockReview = reviewId.toString().startsWith('mock_');
    
    if (isMockReview) {
      // Mock 리뷰의 경우 클라이언트 사이드에서만 처리
      const currentReview = reviewsState.find(r => r.id === reviewId);
      if (!currentReview) return;
      
      const newIsHelpful = !currentReview.is_helpful;
      const newHelpfulCount = newIsHelpful 
        ? (currentReview.helpful || 0) + 1 
        : Math.max(0, (currentReview.helpful || 0) - 1);

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
      
      return;
    }
    
    // 실제 API 리뷰의 경우 기존 로직 사용
    // 로그인한 유저 정보 가져오기
    const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!userFromStorage) {
      message.warning(t('notifications.product.loginRequired'));
      return;
    }

    let userData;
    try {
      userData = JSON.parse(userFromStorage);
    } catch (e) {
      message.error(t('notifications.product.userInfoLoadFail'));
      return;
    }

    // 본인 리뷰는 helpful 할 수 없음
    const review = reviewsState.find(r => r.id === reviewId);
    if (review && review.isCurrentUser) {
      message.warning(t('notifications.product.ownReviewHelpful'));
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
      message.warning(t('notifications.product.loginRequired'));
      return;
    }

    let userData;
    try {
      userData = JSON.parse(userFromStorage);
    } catch (e) {
      message.error(t('notifications.product.userInfoLoadFail'));
      return;
    }

    setDeletingId(reviewId);
    try {
      // DELETE 요청에 user_id를 query parameter로 전달
      await api.reviews.delete(reviewId, { params: { user_id: userData.id } });

      message.success(t('notifications.product.reviewDeleted'));
      
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
      {/* 필터 섹션 - 개발자 타입 및 별점 필터 */}
      {reviewsState.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
              {t('product.reviews.filter.label')}
            </label>
            <div className="custom-dropdown" ref={filterDropdownRef} style={{ minWidth: '200px' }}>
              <button
                className={`dropdown-button ${filterDropdownOpen ? 'active' : ''}`}
                onClick={() => setFilterDropdownOpen((v) => !v)}
              >
                <span className="dropdown-label">
                  {developerTypeFilter 
                    ? getDeveloperTypeLabel(developerTypeFilter)
                    : t('product.reviews.filter.all')}
                </span>
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div className={`dropdown-menu ${filterDropdownOpen ? 'show' : ''}`}>
                <div
                  className={`dropdown-item ${!developerTypeFilter ? 'active' : ''}`}
                  onClick={() => {
                    setDeveloperTypeFilter('');
                    setFilterDropdownOpen(false);
                  }}
                >
                  {t('product.reviews.filter.all')}
                </div>
                <div
                  className={`dropdown-item ${developerTypeFilter === 'frontend' ? 'active' : ''}`}
                  onClick={() => {
                    setDeveloperTypeFilter('frontend');
                    setFilterDropdownOpen(false);
                  }}
                >
                  {getDeveloperTypeLabel('frontend')}
                </div>
                <div
                  className={`dropdown-item ${developerTypeFilter === 'backend' ? 'active' : ''}`}
                  onClick={() => {
                    setDeveloperTypeFilter('backend');
                    setFilterDropdownOpen(false);
                  }}
                >
                  {getDeveloperTypeLabel('backend')}
                </div>
                <div
                  className={`dropdown-item ${developerTypeFilter === 'fullstack' ? 'active' : ''}`}
                  onClick={() => {
                    setDeveloperTypeFilter('fullstack');
                    setFilterDropdownOpen(false);
                  }}
                >
                  {getDeveloperTypeLabel('fullstack')}
                </div>
                <div
                  className={`dropdown-item ${developerTypeFilter === 'mobile' ? 'active' : ''}`}
                  onClick={() => {
                    setDeveloperTypeFilter('mobile');
                    setFilterDropdownOpen(false);
                  }}
                >
                  {getDeveloperTypeLabel('mobile')}
                </div>
                <div
                  className={`dropdown-item ${developerTypeFilter === 'devops' ? 'active' : ''}`}
                  onClick={() => {
                    setDeveloperTypeFilter('devops');
                    setFilterDropdownOpen(false);
                  }}
                >
                  {getDeveloperTypeLabel('devops')}
                </div>
                <div
                  className={`dropdown-item ${developerTypeFilter === 'data' ? 'active' : ''}`}
                  onClick={() => {
                    setDeveloperTypeFilter('data');
                    setFilterDropdownOpen(false);
                  }}
                >
                  {getDeveloperTypeLabel('data')}
                </div>
                <div
                  className={`dropdown-item ${developerTypeFilter === 'security' ? 'active' : ''}`}
                  onClick={() => {
                    setDeveloperTypeFilter('security');
                    setFilterDropdownOpen(false);
                  }}
                >
                  {getDeveloperTypeLabel('security')}
                </div>
                <div
                  className={`dropdown-item ${developerTypeFilter === 'infrastructure' ? 'active' : ''}`}
                  onClick={() => {
                    setDeveloperTypeFilter('infrastructure');
                    setFilterDropdownOpen(false);
                  }}
                >
                  {getDeveloperTypeLabel('infrastructure')}
                </div>
                <div
                  className={`dropdown-item ${developerTypeFilter === 'server' ? 'active' : ''}`}
                  onClick={() => {
                    setDeveloperTypeFilter('server');
                    setFilterDropdownOpen(false);
                  }}
                >
                  {getDeveloperTypeLabel('server')}
                </div>
                <div
                  className={`dropdown-item ${developerTypeFilter === 'management' ? 'active' : ''}`}
                  onClick={() => {
                    setDeveloperTypeFilter('management');
                    setFilterDropdownOpen(false);
                  }}
                >
                  {getDeveloperTypeLabel('management')}
                </div>
                <div
                  className={`dropdown-item ${developerTypeFilter === 'other' ? 'active' : ''}`}
                  onClick={() => {
                    setDeveloperTypeFilter('other');
                    setFilterDropdownOpen(false);
                  }}
                >
                  {getDeveloperTypeLabel('other')}
                </div>
              </div>
            </div>
            
            {/* 별점 필터 */}
            <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
              {t('product.reviews.filter.ratingLabel')}:
            </label>
            <div className="custom-dropdown" ref={ratingFilterDropdownRef} style={{ minWidth: '150px' }}>
              <button
                className={`dropdown-button ${ratingFilterDropdownOpen ? 'active' : ''}`}
                onClick={() => setRatingFilterDropdownOpen((v) => !v)}
              >
                <span className="dropdown-label">
                  {ratingFilter !== null 
                    ? `★${ratingFilter}`
                    : t('product.reviews.filter.all')}
                </span>
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div className={`dropdown-menu ${ratingFilterDropdownOpen ? 'show' : ''}`}>
                <div
                  className={`dropdown-item ${ratingFilter === null ? 'active' : ''}`}
                  onClick={() => {
                    setRatingFilter(null);
                    setRatingFilterDropdownOpen(false);
                  }}
                >
                  {t('product.reviews.filter.all')}
                </div>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div
                    key={rating}
                    className={`dropdown-item ${ratingFilter === rating ? 'active' : ''}`}
                    onClick={() => {
                      setRatingFilter(rating);
                      setRatingFilterDropdownOpen(false);
                    }}
                  >
                    ★{rating}
                  </div>
                ))}
              </div>
            </div>
            
            {(developerTypeFilter || ratingFilter !== null) && (
              <span className="text-sm text-gray-600">
                ({filteredReviews.length}{t('product.reviews.filter.count')})
              </span>
            )}
          </div>
        </div>
      )}

      {/* 별점 분포 차트 - 필터와 무관하게 항상 표시 */}
      {reviewsState.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">レビュー評価分布</h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingStats.distribution[rating];
              const percentage = ratingStats.percentages[rating];
              
              return (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-base font-bold" style={{ color: '#717171' }}>★</span>
                    <span className="text-base font-bold text-gray-700">{rating}</span>
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-md h-6 relative overflow-hidden">
                    <div
                      className="bg-yellow-400 h-full rounded-md transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-12 text-right">
                    <span className="text-sm text-gray-600">{count}件</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 리뷰 사진 섹션 */}
      {reviewImages.length > 0 && (
        <div className="bg-white py-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">イメージ付きのレビュー</h3>
            <button
              onClick={() => setShowAllImagesModal(true)}
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              すべての写真を見る &gt;
            </button>
          </div>
          
          <div className="relative">
            {/* 왼쪽 화살표 */}
            {reviewImages.length > 4 && canScrollLeft && (
              <button
                onClick={() => handleSlide('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-lg p-2 shadow-md hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
            )}
            
            {/* 이미지 슬라이드 */}
            <div
              ref={slideContainerRef}
              className="flex gap-3 overflow-x-auto scroll-smooth hide-scrollbar"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none'
              }}
              onScroll={() => {
                const container = slideContainerRef.current;
                if (container) {
                  setCanScrollLeft(container.scrollLeft > 0);
                  setCanScrollRight(
                    container.scrollLeft < container.scrollWidth - container.clientWidth - 10
                  );
                }
              }}
            >
              {reviewImages.map((imageData, index) => (
                <div
                  key={`${imageData.reviewId}-${imageData.imageIndex}`}
                  className="flex-shrink-0 cursor-pointer group"
                  onClick={() => scrollToReview(imageData.reviewId)}
                >
                  <Image
                    src={imageData.url}
                    alt={`리뷰 이미지 ${index + 1}`}
                    className="object-cover rounded-lg transition-transform group-hover:scale-105"
                    width={120}
                    height={120}
                    preview={false}
                  />
                </div>
              ))}
            </div>

            {/* 오른쪽 화살표 */}
            {reviewImages.length > 4 && canScrollRight && (
              <button
                onClick={() => handleSlide('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-lg p-2 shadow-md hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            )}
          </div>
          {/* 구분선 */}
          {filteredReviews.length > 0 && (
            <div className="border-t border-gray-200 mt-6"></div>
          )}
        </div>
      )}

      {/* 전체 사진 팝업 모달 */}
      <Modal
        open={showAllImagesModal}
        onCancel={() => {
          setShowAllImagesModal(false);
          setSelectedReviewId(null);
        }}
        footer={null}
        width="80%"
        style={{ maxWidth: '1000px' }}
        centered
        closeIcon={<X className="w-5 h-5" />}
        className="review-images-modal"
      >
        {selectedReviewId ? (
          // 선택된 리뷰 상세 정보 표시
          (() => {
            const selectedReview = filteredReviews.find(r => r.id === selectedReviewId);
            const reviewImagesList = reviewImages.filter(img => img.reviewId === selectedReviewId);
            const currentImage = reviewImagesList[currentImageIndex] || reviewImagesList[0];
            const hasMultipleImages = reviewImagesList.length > 1;
            
            if (!selectedReview) return null;
            
            // 이미지 변경 핸들러
            const handlePreviousImage = () => {
              setCurrentImageIndex((prev) => 
                prev > 0 ? prev - 1 : reviewImagesList.length - 1
              );
            };
            
            const handleNextImage = () => {
              setCurrentImageIndex((prev) => 
                prev < reviewImagesList.length - 1 ? prev + 1 : 0
              );
            };
            
            return (
              <div className="p-6 relative">
                {/* 뒤로가기 버튼 - 왼쪽 위, X 버튼과 같은 높이, hover 시 밑줄 표시 */}
                <button
                  onClick={() => {
                    setSelectedReviewId(null);
                    setCurrentImageIndex(0);
                  }}
                  className="absolute -top-4 left-0 px-4 py-2 text-gray-700 rounded-lg hover:underline transition-colors z-10"
                >
                  ← すべての写真に戻る
                </button>
                
                <div className="flex gap-6">
                  {/* 왼쪽: 이미지 - 50% */}
                  <div className="flex-1 relative">
                    {currentImage && (
                      <>
                        <Image
                          src={currentImage.url}
                          alt="리뷰 이미지"
                          className="object-cover rounded-lg w-full h-full"
                          style={{ maxHeight: '600px', objectFit: 'contain' }}
                          preview={false}
                        />
                        
                        {/* 화살표 버튼들 */}
                        {hasMultipleImages && (
                          <>
                            {/* 왼쪽 화살표 */}
                            <button
                              onClick={handlePreviousImage}
                              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 border border-gray-300 rounded-lg p-2 shadow-md transition-all z-10"
                            >
                              <ChevronLeft className="w-6 h-6 text-gray-700" />
                            </button>
                            
                            {/* 오른쪽 화살표 */}
                            <button
                              onClick={handleNextImage}
                              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 border border-gray-300 rounded-lg p-2 shadow-md transition-all z-10"
                            >
                              <ChevronRight className="w-6 h-6 text-gray-700" />
                            </button>
                          </>
                        )}
                        
                        {/* 찜하기 버튼 - 오른쪽 아래 */}
                        <button
                          onClick={handleFavoriteToggle}
                          className={`absolute bottom-4 right-4 w-11 h-11 border rounded-lg flex items-center justify-center transition-all z-10 shadow-md ${
                            isLiked 
                              ? 'bg-red-50 border-red-600 text-red-600' 
                              : 'bg-white bg-opacity-80 hover:bg-opacity-100 border-gray-300 text-gray-700'
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                        </button>
                        
                        {/* 이미지 인덱스 표시 */}
                        {hasMultipleImages && (
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm z-10">
                            {currentImageIndex + 1} / {reviewImagesList.length}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  
                  {/* 오른쪽: 리뷰 정보 - 50% */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                        {selectedReview.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-base text-gray-900 mb-0.5">{selectedReview.author}</div>
                        <div className="text-[13px] text-gray-400">{selectedReview.date}</div>
                      </div>
                    </div>
                    
                    {/* 별점 */}
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${
                            i < (selectedReview.rating || 0)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-200 fill-gray-200'
                          }`}
                          viewBox="0 0 24 24"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                      ))}
                    </div>
                    
                    {/* 프로젝트명 */}
                    <div className="mb-3">
                      <span className="inline-block px-3.5 py-1.5 bg-blue-50 text-blue-700 rounded-md text-[13px] font-semibold">
                        {selectedReview.project}
                      </span>
                    </div>
                    
                    {/* 리뷰 제목 */}
                    {selectedReview.title && (
                      <h4 className="text-base font-bold text-gray-900 mb-2">
                        {selectedReview.title}
                      </h4>
                    )}
                    
                    {/* 리뷰 내용 */}
                    {selectedReview.text && (() => {
                      const maxLength = 200; // 표시할 최대 글자 수
                      const isLongText = selectedReview.text.length > maxLength;
                      const displayText = isLongText && !isReviewExpanded 
                        ? selectedReview.text.substring(0, maxLength) + '...'
                        : selectedReview.text;
                      
                      return (
                        <div className="mb-4">
                          <p className="text-[15px] text-gray-600 leading-[1.7]">{displayText}</p>
                          {isLongText && (
                            <button
                              onClick={() => setIsReviewExpanded(!isReviewExpanded)}
                              className="mt-2 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                            >
                              {isReviewExpanded ? (
                                <>
                                  詳細を非表示
                                  <ChevronUp className="w-4 h-4" />
                                </>
                              ) : (
                                <>
                                  詳細を表示
                                  <ChevronDown className="w-4 h-4" />
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      );
                    })()}
                    
                    {/* 리뷰 이미지들 */}
                    {selectedReview.review_images && Array.isArray(selectedReview.review_images) && selectedReview.review_images.length > 0 && (
                      <div className="mb-4">
                        <Image.PreviewGroup>
                          <div className="flex flex-wrap gap-2">
                            {selectedReview.review_images.map((imageUrl, index) => (
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
                    
                    {/* Helpful 정보 */}
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">
                        {selectedReview.helpful || 0}人のお客様がこれが役に立ったと考えています
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()
        ) : (
          // 전체 사진 그리드
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">すべての写真</h3>
            <div className="grid grid-cols-3 gap-4 max-h-[70vh] overflow-y-scroll pr-2">
              {reviewImages.map((imageData, index) => (
                <div
                  key={`${imageData.reviewId}-${imageData.imageIndex}`}
                  className="cursor-pointer group"
                  onClick={() => setSelectedReviewId(imageData.reviewId)}
                >
                  <Image
                    src={imageData.url}
                    alt={`리뷰 이미지 ${index + 1}`}
                    className="object-cover rounded-lg w-full h-40"
                    preview={false}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
      
      {filteredReviews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {developerTypeFilter 
              ? t('product.reviews.filter.emptyFiltered', { type: getDeveloperTypeLabel(developerTypeFilter) })
              : t('product.reviews.filter.empty')}
          </p>
        </div>
      ) : (
        <>
        {paginatedReviews.map((review) => {
        const isEditing = editingId === review.id;
        const isDeleting = deletingId === review.id;
        const isCurrentUserReview = review.isCurrentUser || false;

        return (
          <div 
            key={review.id} 
            data-review-id={review.id}
            className={`pb-8 transition-colors duration-500 ${review.id !== paginatedReviews[paginatedReviews.length - 1]?.id ? 'border-b border-gray-200' : ''}`}
          >
            <div className="flex items-start gap-4">
              {/* 48px 아바타 */}
              <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                {review.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <div className="font-bold text-base text-gray-900">{review.author}</div>
                      {review.developer_type && (
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-semibold">
                          {getDeveloperTypeLabel(review.developer_type)}
                        </span>
                      )}
                    </div>
                    <div className="text-[13px] text-gray-400">{formatDate(review.date)}</div>
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">리뷰 이미지</label>
                      <div className="flex flex-wrap gap-3">
                        {/* 기존 이미지 표시 */}
                        {editForm.images.map((imageUrl, index) => (
                          <div key={index} className="relative">
                            <Image
                              src={imageUrl.startsWith('http') ? imageUrl : `${API_URL}/${imageUrl}`}
                              alt={`리뷰 이미지 ${index + 1}`}
                              className="object-cover rounded-lg"
                              width={100}
                              height={100}
                              preview={false}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newImages = editForm.images.filter((_, i) => i !== index);
                                setEditForm({ ...editForm, images: newImages });
                              }}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        
                        {/* 업로드 중인 이미지 표시 */}
                        {uploadingImages.map((file, index) => (
                          <div key={`uploading-${index}`} className="relative">
                            <Image
                              src={URL.createObjectURL(file)}
                              alt={`업로드 중 ${index + 1}`}
                              className="object-cover rounded-lg opacity-50"
                              width={100}
                              height={100}
                              preview={false}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs text-gray-600">업로드 중...</span>
                            </div>
                          </div>
                        ))}
                        
                        {/* 이미지 업로드 버튼 */}
                        <Upload
                          name="image"
                          action={`${API_URL}/image`}
                          listType="picture-card"
                          showUploadList={false}
                          beforeUpload={(file) => {
                            setUploadingImages([...uploadingImages, file]);
                            return false; // 자동 업로드 방지
                          }}
                          accept="image/*"
                          multiple
                        >
                          <div>
                            <PlusOutlined />
                            <div className="mt-2 text-xs">이미지 추가</div>
                          </div>
                        </Upload>
                      </div>
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
        
        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
            >
              <ChevronLeft className="w-4 h-4" />
              {t('home.pagination.prev')}
            </button>
            
            <span className="text-sm text-gray-600">
              {currentPage} / {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
            >
              {t('home.pagination.next')}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
        </>
      )}
    </div>
  );
}
