import React from 'react';

export default function CouponSection({ couponCode, onCouponCodeChange, onApplyCoupon, appliedCoupon }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 mt-4">
      <div className="flex items-center gap-2.5 mb-4">
        <svg className="w-5 h-5 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
          <line x1="7" y1="7" x2="7.01" y2="7"/>
        </svg>
        <h3 className="text-base font-semibold text-gray-900">Have a coupon code?</h3>
      </div>
      <div className="flex gap-3 items-stretch">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => onCouponCodeChange(e.target.value.toUpperCase())}
          placeholder="Enter code (e.g., SAVE20)"
          className="flex-1 px-4 py-3.5 border border-gray-200 rounded-[10px] text-[15px] outline-none transition-all bg-gray-50 focus:border-gray-900 focus:bg-white placeholder:text-gray-400"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              onApplyCoupon();
            }
          }}
        />
        <button
          onClick={onApplyCoupon}
          className="px-7 py-3.5 bg-gray-900 text-white border-none rounded-[10px] text-[15px] font-semibold cursor-pointer transition-all whitespace-nowrap hover:bg-black hover:-translate-y-px hover:shadow-md active:translate-y-0"
        >
          Apply
        </button>
      </div>
      {appliedCoupon && (
        <div className="mt-4 px-4 py-3 bg-green-100 border border-green-300 rounded-[10px] text-sm font-semibold text-green-800 flex items-center gap-2">
          <svg className="w-[18px] h-[18px] text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>Coupon applied: <strong>{appliedCoupon.label}</strong></span>
        </div>
      )}
    </div>
  );
}
