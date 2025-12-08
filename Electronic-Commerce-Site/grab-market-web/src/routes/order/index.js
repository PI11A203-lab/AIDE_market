import React, { useEffect } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useOrderData } from './hooks/useOrderData';
import { useReviewForm } from './hooks/useReviewForm';
import OrderHeader from './components/OrderHeader';
import OrderSummary from './components/OrderSummary';
import OrderItem from './components/OrderItem';
import './index.css';

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const history = useHistory();
  const { order, orderItems, setOrderItems, loading, reloadOrderData } = useOrderData(orderId);

  const {
    reviewForms,
    initializeReviewForms,
    handleRatingClick,
    handleCommentChange,
    handleTitleChange,
    handleImageChange,
    handleImageRemove,
    handleSubmitReview
  } = useReviewForm(orderItems, setOrderItems, reloadOrderData);

  // 리뷰 폼 초기화
  useEffect(() => {
    if (orderItems.length > 0) {
      initializeReviewForms(orderItems);
    }
  }, [orderItems, initializeReviewForms]);

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
      {/* 헤더 */}
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">AIDE Market</Link>
        </div>
      </header>

      {/* 메인 */}
      <main className="main">
        <OrderHeader order={order} />
        <OrderSummary order={order} />

        {/* 주문 아이템 목록 */}
        <div className="order-items-section">
          <h2 className="section-title">주문 상품 ({orderItems.length}개)</h2>
          <div className="order-items-list">
            {orderItems.map((item) => (
              <OrderItem
                key={item.id}
                item={item}
                reviewForm={reviewForms[item.id] || {
                  rating: 0,
                  title: '',
                  comment: '',
                  images: [],
                  submitting: false
                }}
                onRatingClick={handleRatingClick}
                onTitleChange={handleTitleChange}
                onCommentChange={handleCommentChange}
                onImageChange={handleImageChange}
                onImageRemove={handleImageRemove}
                onSubmitReview={handleSubmitReview}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
