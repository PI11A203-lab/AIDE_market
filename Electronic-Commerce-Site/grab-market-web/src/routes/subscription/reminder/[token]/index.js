import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { message } from 'antd';
import { api } from '../../../../config/api';
import { Calendar, AlertCircle } from 'lucide-react';
import PaymentInfoCard from '../../components/PaymentInfoCard';
import SubscriptionProductList from '../../components/SubscriptionProductList';
import GracePeriodAlert from '../../components/GracePeriodAlert';
import CouponApplySection from '../../components/CouponApplySection';
import SubscriptionActions from '../../components/SubscriptionActions';
import SubscriptionStatusBadge from '../../components/SubscriptionStatusBadge';
import { calculateDaysUntil } from '../../utils/formatters';
import './index.css';

export default function SubscriptionReminder() {
  const history = useHistory();
  const { token } = useParams();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
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

  const handleUpdateCoupon = async (couponCode) => {
    setApplyingCoupon(true);
    try {
      // 쿠폰 검증
      const subscriptionTotal = subscription.items?.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0) || 0;
      const couponResponse = await api.coupons.validate(couponCode, subscriptionTotal);
      
      // 구독 쿠폰 업데이트
      await api.subscriptions.updateCoupon(subscription.subscription_id, {
        couponId: couponResponse.data.coupon.coupon_id
      });

      // 구독 정보 새로고침
      const response = await api.subscriptions.getByReminderToken(token);
      setSubscription(response.data.subscription);
      message.success('쿠폰이 적용되었습니다.');
    } catch (error) {
      console.error('쿠폰 적용 실패:', error);
      const errorMessage = error.response?.data?.error || '쿠폰 적용에 실패했습니다.';
      message.error(errorMessage);
    } finally {
      setApplyingCoupon(false);
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-5 md:px-12 py-10">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <Calendar className="w-10 h-10 text-blue-600" />
              정기결제 안내
            </h1>
            <SubscriptionStatusBadge status={subscription.status} />
          </div>
          <p className="text-base text-gray-600">
            다음 결제일과 구독 정보를 확인하세요
            {daysUntilPayment > 0 && (
              <span className="ml-2 text-blue-600 font-medium">
                ({daysUntilPayment}일 남음)
              </span>
            )}
          </p>
        </div>

        {/* 유예 기간 알림 */}
        <GracePeriodAlert 
          subscription={subscription}
          onRetryPayment={(subscriptionId) => history.push('/subscription/payment-failed')}
        />

        {/* 결제 정보 카드 */}
        <PaymentInfoCard subscription={subscription} />

        {/* 구독 상품 목록 */}
        <div className="mb-6">
          <SubscriptionProductList items={subscription.items} />
        </div>

        {/* 액션 버튼 및 쿠폰 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <SubscriptionActions subscription={subscription} />
          <CouponApplySection 
            subscription={subscription}
            onApplyCoupon={handleUpdateCoupon}
            applyingCoupon={applyingCoupon}
          />
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
