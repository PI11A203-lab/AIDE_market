import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
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
  const { t, i18n } = useTranslation();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  // localStorage에서 언어 설정 불러오기
  useEffect(() => {
    const savedLanguage = localStorage.getItem('appLanguage');
    if (savedLanguage && ['ko', 'ja', 'en'].includes(savedLanguage)) {
      i18n.changeLanguage(savedLanguage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        // 로그인 확인
        const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (!userFromStorage) {
          message.warning(t('subscription.reminder.loginRequired'));
          history.push(`/login?redirect=/subscription/reminder/${token}`);
          return;
        }

        // 토큰으로 구독 정보 조회
        const response = await api.subscriptions.getByReminderToken(token);
        setSubscription(response.data.subscription);
      } catch (error) {
        console.error('구독 정보 조회 실패:', error);
        const errorMessage = error.response?.data?.error || t('subscription.reminder.loadFail');
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
  }, [token, history, t]);

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
      message.success(t('subscription.reminder.couponApplied'));
    } catch (error) {
      console.error('쿠폰 적용 실패:', error);
      const errorMessage = error.response?.data?.error || t('subscription.reminder.couponApplyFail');
      message.error(errorMessage);
    } finally {
      setApplyingCoupon(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">{t('common.loading')}</div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('subscription.reminder.notFoundTitle')}</h2>
          <p className="text-gray-600">{t('subscription.reminder.notFoundDescription')}</p>
          <button
            onClick={() => history.push('/subscription/manage')}
            className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900"
          >
            {t('subscription.reminder.goToManage')}
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
              {t('subscription.reminder.title')}
            </h1>
            <SubscriptionStatusBadge status={subscription.status} />
          </div>
          <p className="text-base text-gray-600">
            {t('subscription.reminder.subtitle')}
            {daysUntilPayment > 0 && (
              <span className="ml-2 text-blue-600 font-medium">
                {t('subscription.reminder.daysRemaining', { days: daysUntilPayment })}
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
            {t('subscription.reminder.infoTitle')}
          </h3>
          <ul className="space-y-2 text-blue-800">
            {t('subscription.reminder.infoItems', { returnObjects: true }).map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </div>

        {/* 뒤로 가기 버튼 */}
        <div className="mt-6">
          <button
            onClick={() => history.push('/subscription/manage')}
            className="px-6 py-2 text-gray-600 hover:text-gray-900"
          >
            {t('subscription.reminder.backToManage')}
          </button>
        </div>
      </div>
    </div>
  );
}
