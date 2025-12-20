import React, { useState } from 'react';
import { Tag } from 'lucide-react';

export default function CouponApplySection({ 
  subscription, 
  onApplyCoupon, 
  applyingCoupon 
}) {
  const [couponCode, setCouponCode] = useState('');

  const handleSubmit = () => {
    if (!couponCode.trim()) {
      return;
    }
    onApplyCoupon(couponCode);
    setCouponCode('');
  };

  return (
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
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="쿠폰 코드 입력"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={applyingCoupon}
        />
        <button
          onClick={handleSubmit}
          disabled={applyingCoupon || !couponCode.trim()}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {applyingCoupon ? '적용 중...' : '적용'}
        </button>
      </div>
      {subscription?.coupon && (
        <p className="mt-2 text-sm text-green-600">
          적용된 쿠폰: {subscription.coupon.code}
        </p>
      )}
    </div>
  );
}

