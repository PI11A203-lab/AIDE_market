import React from 'react';
import { formatCurrency } from '../utils/formatters';

export default function SubscriptionProductList({ items }) {
  if (!items || items.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">구독 중인 상품</h2>
        <p className="text-gray-600">구독 중인 상품이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">구독 중인 상품</h2>
      <div className="space-y-4">
        {items.map((item) => (
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
    </div>
  );
}

