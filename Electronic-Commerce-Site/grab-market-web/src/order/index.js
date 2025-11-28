import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { ArrowLeft, Star, MessageSquare } from 'lucide-react';
import { message } from 'antd';
import axios from 'axios';
import { API_URL } from '../config/constants';
import { api } from '../config/api';
import ProfileHeader from '../profile/components/ProfileHeader';
import './index.css';

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const history = useHistory();
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewForms, setReviewForms] = useState({}); // 각 아이템별 리뷰 작성 상태

  useEffect(() => {
    loadOrderData();
  }, [orderId]);

  const loadOrderData = async () => {
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
          comment: '',
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
  };

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

  const handleSubmitReview = async (itemId, productId) => {
    const form = reviewForms[itemId];
    
    if (!form.rating || form.rating === 0) {
      message.warning('별점을 선택해주세요.');
      return;
    }

    if (!form.comment.trim()) {
      message.warning('리뷰 내용을 입력해주세요.');
      return;
    }

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

    try {
      await api.reviews.create({
        user_id: user.id,
        product_id: productId,
        order_item_id: itemId,
        rating: form.rating,
        review_text: form.comment.trim()
      });

      message.success('리뷰가 작성되었습니다!');

      // 주문 아이템의 has_review 업데이트
      setOrderItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, has_review: true } : item
      ));

      // 리뷰 폼 초기화
      setReviewForms(prev => ({
        ...prev,
        [itemId]: {
          rating: 0,
          comment: '',
          submitting: false
        }
      }));

      // 주문 데이터 새로고침 (상품 정보 업데이트 - 리뷰 수 반영)
      await loadOrderData();

      // 상품 정보 새로고침 (리뷰 수 업데이트)
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
                            <textarea
                              className="review-comment"
                              placeholder="리뷰를 작성해주세요..."
                              value={reviewForms[item.id]?.comment || ''}
                              onChange={(e) => handleCommentChange(item.id, e.target.value)}
                              rows={4}
                            />
                            <button
                              className="submit-review-button"
                              onClick={() => handleSubmitReview(item.id, item.product_id)}
                              disabled={reviewForms[item.id]?.submitting}
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

