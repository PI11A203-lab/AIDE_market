import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { ArrowLeft, Star, MessageSquare } from 'lucide-react';
import { message, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { API_URL } from '../config/constants';
import { api } from '../config/api';
import { clearRatingCache, setRatingCache } from '../utils/ratingCache';
import ProfileHeader from '../profile/components/ProfileHeader';
import './index.css';

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const history = useHistory();
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewForms, setReviewForms] = useState({}); // 각 아이템별 리뷰 작성 상태

  const loadOrderData = useCallback(async () => {
    try {
      // 주문 정보 가져오기
      const orderResponse = await api.orders.getById(orderId);
      const orderData = orderResponse.data.order;
      setOrder(orderData);

      // 주문 아이템 가져오기
      const itemsResponse = await api.orderItems.getByOrder(orderId);
      const items = itemsResponse.data?.orderItems || [];

      // 각 아이템의 상품 정보 가져오기
      const itemsWithProducts = await Promise.all(
        items.map(async (item) => {
          try {
            const productResponse = await axios.get(`${API_URL}/api/products/${item.product_id}`);
            return {
              ...item,
              product: productResponse.data.product,
              tags: productResponse.data.tags || []
            };
          } catch (error) {
            console.error(`Failed to fetch product ${item.product_id}:`, error);
            return { ...item, product: null };
          }
        })
      );

      setOrderItems(itemsWithProducts);

      // 리뷰 작성 폼 초기화
      const forms = {};
      itemsWithProducts.forEach(item => {
        forms[item.id] = {
          rating: 0,
          title: '',
          comment: '',
          images: [],
          submitting: false
        };
      });
      setReviewForms(forms);

      setLoading(false);
    } catch (error) {
      console.error('Failed to load order data:', error);
      message.error('주문 정보를 불러오는데 실패했습니다.');
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadOrderData();
  }, [loadOrderData]);

  const handleRatingClick = (itemId, rating) => {
    setReviewForms(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        rating
      }
    }));
  };

  const handleCommentChange = (itemId, comment) => {
    setReviewForms(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        comment
      }
    }));
  };

  const handleTitleChange = (itemId, title) => {
    setReviewForms(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        title
      }
    }));
  };

  const handleImageChange = (itemId, fileList) => {
    setReviewForms(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        images: fileList
      }
    }));
  };

  const handleImageRemove = (itemId, file) => {
    setReviewForms(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        images: prev[itemId].images.filter(img => img.uid !== file.uid)
      }
    }));
  };

  const handleSubmitReview = async (itemId, productId) => {
    const form = reviewForms[itemId];
    
    if (!form.rating || form.rating === 0) {
      message.warning('별점을 선택해주세요.');
      return;
    }

    // 리뷰 내용은 선택사항으로 변경 (제목만 있어도 가능)
    // if (!form.comment.trim()) {
    //   message.warning('리뷰 내용을 입력해주세요.');
    //   return;
    // }

    // 이미 리뷰가 작성되었는지 확인
    const orderItem = orderItems.find(item => item.id === itemId);
    if (orderItem?.has_review) {
      message.warning('이미 리뷰를 작성하셨습니다.');
      return;
    }

    // 사용자 정보 가져오기
    const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!userFromStorage) {
      message.warning('로그인이 필요합니다.');
      return;
    }

    let user;
    try {
      user = JSON.parse(userFromStorage);
    } catch (e) {
      message.error('사용자 정보를 불러올 수 없습니다.');
      return;
    }

    setReviewForms(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        submitting: true
      }
    }));

    // 이미지 업로드 처리 (이미 업로드된 이미지는 response에서 가져오고, 새로 추가된 이미지만 업로드)
    let imageUrls = [];
    if (form.images && form.images.length > 0) {
      try {
        const uploadPromises = form.images.map(async (img) => {
          // 이미 업로드 완료된 이미지 (response에 imageUrl이 있음)
          if (img.response?.imageUrl) {
            return img.response.imageUrl;
          }
          // 새로 추가된 이미지 (originFileObj가 있음)
          else if (img.originFileObj) {
            const formData = new FormData();
            formData.append('image', img.originFileObj);
            const uploadResponse = await api.upload.image(formData);
            return uploadResponse.data.imageUrl;
          }
          return null;
        });
        
        imageUrls = (await Promise.all(uploadPromises)).filter(url => url !== null);
      } catch (error) {
        console.error('Failed to upload images:', error);
        message.warning('이미지 업로드에 실패했습니다. 리뷰는 작성되지만 이미지는 포함되지 않습니다.');
      }
    }

    try {
      await api.reviews.create({
        user_id: user.id,
        product_id: productId,
        order_item_id: itemId,
        rating: form.rating,
        title: form.title.trim() || null,
        review_text: form.comment.trim() || null,
        review_images: imageUrls.length > 0 ? imageUrls : null
      });

      message.success('리뷰가 작성되었습니다!');

      // 해당 상품의 별점 캐시 삭제 후 최신 별점으로 갱신
      clearRatingCache(productId);
      
      // 리뷰 작성 후 상품의 최신 별점 정보 가져와서 캐시 갱신
      try {
        const productResponse = await axios.get(`${API_URL}/api/products/${productId}`);
        const updatedProduct = productResponse.data?.product;
        if (updatedProduct) {
          setRatingCache(
            productId,
            updatedProduct.rating_average || 0,
            updatedProduct.rating_count || 0
          );
        }
      } catch (error) {
        console.error('Failed to update rating cache:', error);
      }

      // 주문 아이템의 has_review 업데이트
      setOrderItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, has_review: true } : item
      ));

      // 리뷰 폼 초기화
      setReviewForms(prev => ({
        ...prev,
        [itemId]: {
          rating: 0,
          title: '',
          comment: '',
          images: [],
          submitting: false
        }
      }));

      // 주문 데이터 새로고침 (상품 정보 업데이트 - 리뷰 수 반영)
      await loadOrderData();
    } catch (error) {
      console.error('Failed to submit review:', error);
      const errorMessage = error.response?.data?.error || '리뷰 작성에 실패했습니다.';
      message.error(errorMessage);
      setReviewForms(prev => ({
        ...prev,
        [itemId]: {
          ...prev[itemId],
          submitting: false
        }
      }));
    }
  };

  if (loading) {
    return (
      <div className="order-detail-page">
        <div className="text-center py-12">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-detail-page">
        <div className="text-center py-12">
          <p className="text-gray-600">주문을 찾을 수 없습니다</p>
          <button
            onClick={() => history.push('/profile')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            프로필로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-detail-page">
      <ProfileHeader />
      <div className="order-detail-container">
        {/* 헤더 */}
        <div className="order-detail-header">
          <button
            onClick={() => history.push('/profile')}
            className="back-button"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>주문 목록으로</span>
          </button>
          <div className="order-header-info">
            <h1 className="order-title">주문 상세</h1>
            <div className="order-meta-info">
              <span className="order-number">주문번호: {order.order_number || `ORD-${order.id}`}</span>
              <span className="order-date">
                {new Date(order.purchased_at || order.createdAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        </div>

        {/* 주문 요약 */}
        <div className="order-summary-card">
          <h2 className="section-title">주문 요약</h2>
          <div className="order-summary-content">
            <div className="summary-row">
              <span className="summary-label">주문 상태</span>
              <span className="summary-value">{order.status === 'pending' ? '결제 대기' : order.status === 'completed' ? '완료' : order.status}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">총 주문 금액</span>
              <span className="summary-value total">¥{order.total_amount?.toLocaleString() || '0'}</span>
            </div>
          </div>
        </div>

        {/* 주문 아이템 목록 */}
        <div className="order-items-section">
          <h2 className="section-title">주문 상품 ({orderItems.length}개)</h2>
          <div className="order-items-list">
            {orderItems.map((item) => (
              <div key={item.id} className="order-item-card">
                {item.product ? (
                  <>
                    <div className="order-item-header">
                      <div className="order-item-product">
                        <div className="product-avatar">
                          {item.product.name.substring(0, 2)}
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
                    </div>

                    {/* 리뷰 작성 섹션 */}
                    <div className="review-section">
                      {item.has_review ? (
                        <div className="review-completed">
                          <MessageSquare className="w-5 h-5 text-green-600" />
                          <span>리뷰가 작성되었습니다</span>
                        </div>
                      ) : (
                        <>
                          <h4 className="review-title">리뷰 작성</h4>
                          <div className="review-form">
                            <div className="rating-section">
                              <span className="rating-label">별점:</span>
                              <div className="rating-stars">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`star-icon ${reviewForms[item.id]?.rating >= star ? 'filled' : 'empty'}`}
                                    onClick={() => handleRatingClick(item.id, star)}
                                  />
                                ))}
                              </div>
                              {reviewForms[item.id]?.rating > 0 && (
                                <span className="rating-value">{reviewForms[item.id].rating}점</span>
                              )}
                            </div>
                            
                            {/* 리뷰 제목 */}
                            <div className="review-title-input-section" style={{ marginTop: '16px' }}>
                              <label className="review-label" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                                리뷰 제목
                              </label>
                              <input
                                type="text"
                                className="review-title-input"
                                placeholder="리뷰 제목을 입력해주세요 (선택사항)"
                                value={reviewForms[item.id]?.title || ''}
                                onChange={(e) => handleTitleChange(item.id, e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '10px 12px',
                                  border: '1px solid #d9d9d9',
                                  borderRadius: '6px',
                                  fontSize: '14px',
                                  outline: 'none',
                                  transition: 'border-color 0.3s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#1890ff'}
                                onBlur={(e) => e.target.style.borderColor = '#d9d9d9'}
                                maxLength={200}
                              />
                            </div>

                            {/* 리뷰 내용 */}
                            <div style={{ marginTop: '16px' }}>
                              <label className="review-label" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                                리뷰 내용
                              </label>
                              <textarea
                                className="review-comment"
                                placeholder="리뷰를 작성해주세요... (선택사항)"
                                value={reviewForms[item.id]?.comment || ''}
                                onChange={(e) => handleCommentChange(item.id, e.target.value)}
                                rows={4}
                              />
                            </div>

                            {/* 이미지 업로드 */}
                            <div className="review-image-upload-section" style={{ marginTop: '16px' }}>
                              <label className="review-label" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                                사진 추가 (선택사항)
                              </label>
                              <Upload
                                listType="picture-card"
                                fileList={reviewForms[item.id]?.images || []}
                                onChange={({ fileList }) => handleImageChange(item.id, fileList)}
                                onRemove={(file) => handleImageRemove(item.id, file)}
                                beforeUpload={(file) => {
                                  // 이미지 파일만 허용
                                  const isImage = file.type.startsWith('image/');
                                  if (!isImage) {
                                    message.error('이미지 파일만 업로드 가능합니다.');
                                    return Upload.LIST_IGNORE;
                                  }
                                  // 파일 크기 제한 (5MB)
                                  const isLt5M = file.size / 1024 / 1024 < 5;
                                  if (!isLt5M) {
                                    message.error('이미지 크기는 5MB 이하여야 합니다.');
                                    return Upload.LIST_IGNORE;
                                  }
                                  return false; // 자동 업로드 방지
                                }}
                                customRequest={async ({ file, onSuccess, onError }) => {
                                  try {
                                    const formData = new FormData();
                                    formData.append('image', file);
                                    const response = await api.upload.image(formData);
                                    onSuccess({ ...file, response: response.data }, file);
                                  } catch (error) {
                                    onError(error);
                                    message.error('이미지 업로드에 실패했습니다.');
                                  }
                                }}
                                maxCount={5}
                              >
                                {(reviewForms[item.id]?.images || []).length < 5 && (
                                  <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>업로드</div>
                                  </div>
                                )}
                              </Upload>
                            </div>

                            <button
                              className="submit-review-button"
                              onClick={() => handleSubmitReview(item.id, item.product_id)}
                              disabled={reviewForms[item.id]?.submitting}
                              style={{ marginTop: '20px' }}
                            >
                              {reviewForms[item.id]?.submitting ? '작성 중...' : '리뷰 작성'}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="order-item-error">
                    <p>상품 정보를 불러올 수 없습니다</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

