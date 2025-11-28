import React from 'react';
import { Tag } from 'lucide-react';

export default function CouponSection({ couponCode, onCouponCodeChange, onApplyCoupon, appliedCoupon }) {
  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-2xl p-6 mt-8">
      <div className="flex items-center gap-3 mb-4">
        <Tag className="w-6 h-6 text-yellow-600" />
        <h3 className="text-xl font-bold">Have a coupon code?</h3>
      </div>
      <div className="flex gap-3">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => onCouponCodeChange(e.target.value.toUpperCase())}
          placeholder="Enter code (e.g., SAVE20)"
          className="flex-1 px-4 py-3 border-2 border-yellow-400 rounded-xl outline-none text-base focus:border-yellow-500"
        />
        <button
          onClick={onApplyCoupon}
          className="px-6 py-3 bg-yellow-400 border-none rounded-xl font-semibold cursor-pointer transition-colors hover:bg-yellow-500"
        >
          Apply
        </button>
      </div>
      {appliedCoupon && (
        <div className="mt-3 text-green-600 font-semibold flex items-center gap-2">
          ✓ Coupon applied: {appliedCoupon.label}
        </div>
      )}
    </div>
  );
}
