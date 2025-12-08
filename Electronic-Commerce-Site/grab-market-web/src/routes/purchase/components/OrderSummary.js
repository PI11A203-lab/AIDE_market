import React from 'react';

export default function OrderSummary({ 
  cartItems, 
  subtotal, 
  discount, 
  tax, 
  total, 
  appliedCoupon,
  onCheckout,
  isProcessing
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h3>
      <div className="flex flex-col">
        <div className="flex justify-between py-3 text-[15px] text-gray-600">
          <span>Subtotal ({cartItems.length} items)</span>
          <span>¥{subtotal.toLocaleString()}</span>
        </div>
        {appliedCoupon && (
          <div className="flex justify-between py-3 text-[15px] text-green-700">
            <span>Discount ({appliedCoupon.label})</span>
            <span>-¥{discount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between py-3 text-[15px] text-gray-600">
          <span>Tax (10%)</span>
          <span>¥{tax.toLocaleString()}</span>
        </div>
        <div className="flex justify-between pt-4 mt-4 border-t border-gray-200 text-xl font-bold text-gray-900">
          <span>Total</span>
          <span>¥{Math.round(total).toLocaleString()}</span>
        </div>
      </div>
      <button
        onClick={onCheckout}
        disabled={isProcessing}
        className="w-full mt-6 py-4 px-4 bg-black text-white border-none rounded-[10px] text-base font-semibold cursor-pointer transition-all flex items-center justify-center gap-2 hover:bg-gray-900 hover:-translate-y-px hover:shadow-md active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
          <line x1="1" y1="10" x2="23" y2="10"/>
        </svg>
        {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
        {!isProcessing && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        )}
      </button>
      <div className="flex items-center justify-center gap-1.5 mt-3 text-[13px] text-gray-500">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        <span>Secure checkout powered by Stripe</span>
      </div>
    </div>
  );
}
