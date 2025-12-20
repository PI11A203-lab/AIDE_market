import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { message } from 'antd';
import { api } from '../../../config/api';
import { Package, AlertCircle } from 'lucide-react';
import SubscriptionCard from '../components/SubscriptionCard';
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

  const handleUpdate = async () => {
    if (!currentUserId) return;
    try {
      const response = await api.subscriptions.getByUser(currentUserId);
      setSubscriptions(response.data.subscriptions || []);
    } catch (error) {
      console.error('구독 목록 새로고침 실패:', error);
    }
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
              {activeSubscriptions.map((subscription) => (
                <SubscriptionCard
                  key={subscription.subscription_id}
                  subscription={subscription}
                  onUpdate={handleUpdate}
                />
              ))}
            </div>
          </div>
        )}

        {/* 기타 구독 (취소됨, 일시정지 등) */}
        {otherSubscriptions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">기타 구독</h2>
            <div className="grid grid-cols-1 gap-6">
              {otherSubscriptions.map((subscription) => (
                <SubscriptionCard
                  key={subscription.subscription_id}
                  subscription={subscription}
                  onUpdate={handleUpdate}
                />
              ))}
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
