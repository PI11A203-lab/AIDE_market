import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { message, Modal } from 'antd';
import { api } from '../../../config/api';
import { Calendar, CreditCard, Package, Trash2, AlertCircle } from 'lucide-react';
import './index.css';

export default function SubscriptionManage() {
  const history = useHistory();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const loadSubscriptions = async () => {
      try {
        const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (!userFromStorage) {
          message.warning('로그인이 필요합니다.');
          history.push('/login');
          return;
        }

        const userData = JSON.parse(userFromStorage);
        setCurrentUserId(userData.id);

        const response = await api.subscriptions.getByUser(userData.id);
        setSubscriptions(response.data.subscriptions || []);
      } catch (error) {
        console.error('구독 목록 조회 실패:', error);
        message.error('구독 목록을 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadSubscriptions();
  }, [history]);

  const handleCancelSubscription = async (subscriptionId) => {
    Modal.confirm({
      title: '구독 취소 확인',
      content: '정말 이 구독을 취소하시겠습니까? 취소 후에도 현재 결제된 기간까지는 사용할 수 있습니다.',
      okText: '취소하기',
      cancelText: '닫기',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await api.subscriptions.cancel(subscriptionId);
          message.success('구독이 취소되었습니다.');
          
          // 목록 새로고침
          const response = await api.subscriptions.getByUser(currentUserId);
          setSubscriptions(response.data.subscriptions || []);
        } catch (error) {
          console.error('구독 취소 실패:', error);
          const errorMessage = error.response?.data?.error || '구독 취소에 실패했습니다.';
          message.error(errorMessage);
        }
      }
    });
  };

  const formatDate = (dateString, locale = 'ko') => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const localeMap = {
      'ko': 'ko-KR',
      'en': 'en-US',
      'ja': 'ja-JP'
    };
    return date.toLocaleDateString(localeMap[locale] || 'ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return `¥${amount.toLocaleString()}`;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'active': { label: '활성', className: 'bg-green-100 text-green-800' },
      'failed': { label: '결제 실패', className: 'bg-red-100 text-red-800' },
      'paused': { label: '일시정지', className: 'bg-yellow-100 text-yellow-800' },
      'cancelled': { label: '취소됨', className: 'bg-gray-100 text-gray-800' }
    };
    
    const config = statusConfig[status] || statusConfig['cancelled'];
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${config.className}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">로딩 중...</div>
      </div>
    );
  }

  const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
  const failedSubscriptions = subscriptions.filter(s => s.status === 'failed');
  const otherSubscriptions = subscriptions.filter(s => s.status !== 'active' && s.status !== 'failed');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-5 md:px-12 py-10">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Package className="w-10 h-10 text-blue-600" />
            구독 관리
          </h1>
          <p className="text-base text-gray-600">
            정기결제 구독을 관리하고 결제 정보를 확인하세요
          </p>
        </div>

        {/* 결제 실패 구독 알림 */}
        {failedSubscriptions.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-600 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-900 mb-2">결제 실패한 구독이 있습니다</h3>
                <p className="text-red-700 mb-3">
                  {failedSubscriptions.length}개의 구독 결제가 실패했습니다. 유예 기간 내에 재결제해주세요.
                </p>
                <button
                  onClick={() => history.push('/subscription/payment-failed')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  결제 실패 페이지로 이동
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 활성 구독 목록 */}
        {activeSubscriptions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">활성 구독</h2>
            <div className="grid grid-cols-1 gap-6">
              {activeSubscriptions.map((subscription) => {
                const subscriptionTotal = subscription.items?.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0) || 0;
                return (
                  <div key={subscription.subscription_id} className="bg-white border border-gray-200 rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            구독 #{subscription.subscription_id}
                          </h3>
                          {getStatusBadge(subscription.status)}
                        </div>
                        <p className="text-sm text-gray-600">
                          생성일: {formatDate(subscription.created_at, subscription.user_language)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCancelSubscription(subscription.subscription_id)}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>구독 취소</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">다음 결제일</p>
                          <p className="font-semibold text-gray-900">
                            {formatDate(subscription.next_payment_date, subscription.user_language)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-600">결제 금액</p>
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(subscriptionTotal)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-sm text-gray-600">결제 수단</p>
                          <p className="font-semibold text-gray-900">
                            {subscription.creditCard?.card_company || '정보 없음'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 상품 목록 */}
                    {subscription.items && subscription.items.length > 0 && (
                      <div className="border-t border-gray-200 pt-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">구독 상품:</p>
                        <div className="flex flex-wrap gap-2">
                          {subscription.items.map((item) => (
                            <span
                              key={item.subscription_item_id}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm"
                            >
                              {item.product?.name || '상품명 없음'} (x{item.quantity})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 액션 버튼 */}
                    <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => history.push('/profile/settings')}
                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition"
                      >
                        결제 수단 변경
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            // 구독 상세 정보를 조회하여 reminder_token 확인
                            const response = await api.subscriptions.getById(subscription.subscription_id);
                            const subscriptionDetail = response.data.subscription;
                            
                            // reminder token이 있으면 해당 페이지로, 없으면 구독 상세 정보를 모달로 표시
                            if (subscriptionDetail.reminder_token) {
                              history.push(`/subscription/reminder/${subscriptionDetail.reminder_token}`);
                            } else {
                              // reminder token이 없는 경우 구독 ID로 관리 페이지는 없으므로
                              // 구독 관리 페이지에 머물거나 메시지 표시
                              message.info('이메일 링크는 다음 결제 안내 이메일에서 확인할 수 있습니다.');
                            }
                          } catch (error) {
                            console.error('구독 정보 조회 실패:', error);
                            message.error('구독 정보를 불러올 수 없습니다.');
                          }
                        }}
                        className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition"
                      >
                        상세 정보
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 기타 구독 (취소됨, 일시정지 등) */}
        {otherSubscriptions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">기타 구독</h2>
            <div className="grid grid-cols-1 gap-6">
              {otherSubscriptions.map((subscription) => {
                const subscriptionTotal = subscription.items?.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0) || 0;
                return (
                  <div key={subscription.subscription_id} className="bg-white border border-gray-200 rounded-2xl p-6 opacity-75">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            구독 #{subscription.subscription_id}
                          </h3>
                          {getStatusBadge(subscription.status)}
                        </div>
                        <p className="text-sm text-gray-600">
                          생성일: {formatDate(subscription.created_at, subscription.user_language)}
                        </p>
                        {subscription.status === 'cancelled' && subscription.updated_at && (
                          <p className="text-sm text-gray-600">
                            취소일: {formatDate(subscription.updated_at, subscription.user_language)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="text-sm text-gray-600">결제 금액</p>
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(subscriptionTotal)}
                          </p>
                        </div>
                      </div>
                      {subscription.items && subscription.items.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-2">구독 상품:</p>
                          <div className="flex flex-wrap gap-2">
                            {subscription.items.map((item) => (
                              <span
                                key={item.subscription_item_id}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm"
                              >
                                {item.product?.name || '상품명 없음'} (x{item.quantity})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 구독이 없는 경우 */}
        {subscriptions.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">구독이 없습니다</h3>
            <p className="text-gray-600 mb-6">
              정기결제 구독을 시작하려면 상품을 구매할 때 정기결제 옵션을 선택하세요.
            </p>
            <button
              onClick={() => history.push('/')}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900"
            >
              상품 둘러보기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

