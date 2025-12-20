import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { message } from 'antd';
import { api } from '../../../../config/api';
import { Calendar, CreditCard, Tag, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import './index.css';

export default function SubscriptionReminder() {
  const history = useHistory();
  const { token } = useParams();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        // 로그인 확인
        const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (!userFromStorage) {
          message.warning('로그인이 필요합니다.');
          history.push(`/login?redirect=/subscription/reminder/${token}`);
          return;
        }

        // 토큰으로 구독 정보 조회
        const response = await api.subscriptions.getByReminderToken(token);
        setSubscription(response.data.subscription);
      } catch (error) {
        console.error('구독 정보 조회 실패:', error);
        const errorMessage = error.response?.data?.error || '구독 정보를 불러올 수 없습니다.';
        message.error(errorMessage);
        
        // 토큰이 유효하지 않거나 만료된 경우
        if (error.response?.status === 401 || error.response?.status === 404) {
          setTimeout(() => {
            history.push('/subscription/manage');
          }, 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    loadSubscription();
  }, [token, history]);

  const handleUpdateCoupon = async () => {
    if (!couponCode.trim()) {
      message.warning('쿠폰 코드를 입력해주세요.');
      return;
    }

    setApplyingCoupon(true);
    try {
      // 쿠폰 검증
      const couponResponse = await api.coupons.validate(couponCode, subscription.items?.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0) || 0);
      
      // 구독 쿠폰 업데이트
      await api.subscriptions.updateCoupon(subscription.subscription_id, {
        couponId: couponResponse.data.coupon.coupon_id
      });

      // 구독 정보 새로고침
      const response = await api.subscriptions.getByReminderToken(token);
      setSubscription(response.data.subscription);
      setCouponCode('');
      message.success('쿠폰이 적용되었습니다.');
    } catch (error) {
      console.error('쿠폰 적용 실패:', error);
      const errorMessage = error.response?.data?.error || '쿠폰 적용에 실패했습니다.';
      message.error(errorMessage);
    } finally {
      setApplyingCoupon(false);
    }
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

  const calculateDaysUntil = (dateString) => {
    if (!dateString) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateString);
    target.setHours(0, 0, 0, 0);
    const diff = target - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const formatCurrency = (amount) => {
    return `¥${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">로딩 중...</div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">구독 정보를 찾을 수 없습니다</h2>
          <p className="text-gray-600">링크가 만료되었거나 유효하지 않습니다.</p>
          <button
            onClick={() => history.push('/subscription/manage')}
            className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900"
          >
            구독 관리로 이동
          </button>
        </div>
      </div>
    );
  }

  const daysUntilPayment = calculateDaysUntil(subscription.next_payment_date);
  const hasGracePeriod = subscription.grace_period_end_date && calculateDaysUntil(subscription.grace_period_end_date) > 0;
  const graceDaysRemaining = hasGracePeriod ? calculateDaysUntil(subscription.grace_period_end_date) : 0;
  const subscriptionTotal = subscription.items?.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-5 md:px-12 py-10">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Calendar className="w-10 h-10 text-blue-600" />
            정기결제 안내
          </h1>
          <p className="text-base text-gray-600">
            다음 결제일과 구독 정보를 확인하세요
          </p>
        </div>

        {/* 결제 정보 카드 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">결제 정보</h2>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              subscription.status === 'active' ? 'bg-green-100 text-green-800' :
              subscription.status === 'failed' ? 'bg-red-100 text-red-800' :
              subscription.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {subscription.status === 'active' ? '활성' :
               subscription.status === 'failed' ? '결제 실패' :
               subscription.status === 'paused' ? '일시정지' : '취소됨'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 다음 결제일 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">다음 결제일</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatDate(subscription.next_payment_date, subscription.user_language)}
                </p>
                {daysUntilPayment > 0 && (
                  <p className="text-sm text-blue-600 mt-1">
                    {daysUntilPayment}일 남음
                  </p>
                )}
              </div>
            </div>

            {/* 결제 금액 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">결제 금액</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(subscriptionTotal)}
                </p>
                {subscription.coupon && (
                  <p className="text-sm text-green-600 mt-1">
                    쿠폰 적용됨
                  </p>
                )}
              </div>
            </div>

            {/* 결제 수단 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">결제 수단</p>
                <p className="text-lg font-semibold text-gray-900">
                  {subscription.creditCard?.card_company || '카드 정보 없음'}
                </p>
                <p className="text-sm text-gray-500">
                  {subscription.creditCard?.exp_month && subscription.creditCard?.exp_year
                    ? `만료: ${subscription.creditCard.exp_month}/${subscription.creditCard.exp_year}`
                    : ''}
                </p>
              </div>
            </div>

            {/* 마지막 결제일 */}
            {subscription.last_payment_date && (
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">마지막 결제일</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDate(subscription.last_payment_date, subscription.user_language)}
                  </p>
                  {subscription.last_payment_status && (
                    <p className={`text-sm mt-1 ${
                      subscription.last_payment_status === 'success' ? 'text-green-600' :
                      subscription.last_payment_status === 'failed' ? 'text-red-600' :
                      'text-yellow-600'
                    }`}>
                      {subscription.last_payment_status === 'success' ? '결제 완료' :
                       subscription.last_payment_status === 'failed' ? '결제 실패' : '대기 중'}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 유예 기간 알림 */}
        {hasGracePeriod && subscription.status === 'failed' && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <Clock className="w-6 h-6 text-red-600 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-900 mb-2">결제 실패 - 유예 기간</h3>
                <p className="text-red-700 mb-2">
                  결제가 실패했습니다. {graceDaysRemaining}일 후까지 재결제하지 않으면 활성화 코드가 정지됩니다.
                </p>
                <p className="text-sm text-red-600">
                  유예 기간 종료: {formatDate(subscription.grace_period_end_date, subscription.user_language)}
                </p>
                <button
                  onClick={() => history.push('/subscription/payment-failed')}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  재결제하기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 구독 상품 목록 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">구독 중인 상품</h2>
          {subscription.items && subscription.items.length > 0 ? (
            <div className="space-y-4">
              {subscription.items.map((item) => (
                <div key={item.subscription_item_id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 font-semibold">
                      {item.product?.name?.substring(0, 2) || 'AI'}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.product?.name || '상품명 없음'}</h4>
                      <p className="text-sm text-gray-600">수량: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(item.unit_price * item.quantity)}
                    </p>
                    <p className="text-sm text-gray-600">
                      단가: {formatCurrency(item.unit_price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">구독 중인 상품이 없습니다.</p>
          )}
        </div>

        {/* 액션 버튼 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* 카드 정보 변경 */}
          <button
            onClick={() => history.push('/profile/settings')}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
          >
            <CreditCard className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-900">카드 정보 변경</span>
          </button>

          {/* 쿠폰 적용 */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <Tag className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-900">쿠폰 적용</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="쿠폰 코드 입력"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={applyingCoupon}
              />
              <button
                onClick={handleUpdateCoupon}
                disabled={applyingCoupon || !couponCode.trim()}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {applyingCoupon ? '적용 중...' : '적용'}
              </button>
            </div>
            {subscription.coupon && (
              <p className="mt-2 text-sm text-green-600">
                적용된 쿠폰: {subscription.coupon.code}
              </p>
            )}
          </div>
        </div>

        {/* 안내 섹션 */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            안내 사항
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li>• 정기결제는 매월 말일에 자동으로 결제됩니다.</li>
            <li>• 결제 실패 시 3일의 유예 기간이 제공됩니다.</li>
            <li>• 유예 기간 내 재결제하지 않으면 활성화 코드가 정지됩니다.</li>
            <li>• 구독 관리는 프로필 페이지에서 할 수 있습니다.</li>
          </ul>
        </div>

        {/* 뒤로 가기 버튼 */}
        <div className="mt-6">
          <button
            onClick={() => history.push('/subscription/manage')}
            className="px-6 py-2 text-gray-600 hover:text-gray-900"
          >
            ← 구독 관리로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}

