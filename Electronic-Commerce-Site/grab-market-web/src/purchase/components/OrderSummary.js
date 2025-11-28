import React from 'react';
import { CreditCard, ChevronRight, Lock } from 'lucide-react';

export default function OrderSummary({ 
  cartItems, 
  subtotal, 
  discount, 
  tax, 
  total, 
  appliedCoupon,
  onCheckout,
  showPaymentForm
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
      <h3 className="text-2xl font-bold mb-6">Order Summary</h3>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <span>Subtotal ({cartItems.length} items)</span>
          <span className="font-semibold">¥{subtotal.toLocaleString()}</span>
        </div>
        {appliedCoupon && (
          <div className="flex justify-between text-green-600">
            <span>Discount ({appliedCoupon.label})</span>
            <span className="font-semibold">-¥{discount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Tax (10%)</span>
          <span className="font-semibold">¥{tax.toLocaleString()}</span>
        </div>
        <div className="flex justify-between pt-4 border-t border-gray-200">
          <span className="text-xl font-bold">Total</span>
          <span className="text-xl font-bold">
            ¥{Math.round(total).toLocaleString()}
          </span>
        </div>
      </div>
      {!showPaymentForm && (
        <>
          <button
            onClick={onCheckout}
            className="w-full mt-6 py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            <CreditCard className="w-6 h-6" />
            Proceed to Checkout
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-600">
            <Lock className="w-4 h-4" />
            <span>Secure checkout powered by Stripe</span>
          </div>
        </>
      )}
    </div>
  );
}
