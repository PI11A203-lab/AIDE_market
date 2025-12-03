import React from 'react';

export default function PurchaseProtection() {
  return (
    <div className="bg-blue-50 border border-blue-300 rounded-2xl p-5 mt-4">
      <h4 className="text-base font-bold text-blue-900 mb-3">Purchase Protection</h4>
      <ul className="flex flex-col gap-2 list-none p-0 m-0">
        <li className="flex items-start gap-2 text-sm text-blue-900">
          <span>✓</span>
          <span>30-day money-back guarantee</span>
        </li>
        <li className="flex items-start gap-2 text-sm text-blue-900">
          <span>✓</span>
          <span>Secure payment processing</span>
        </li>
        <li className="flex items-start gap-2 text-sm text-blue-900">
          <span>✓</span>
          <span>Instant delivery to your email</span>
        </li>
        <li className="flex items-start gap-2 text-sm text-blue-900">
          <span>✓</span>
          <span>24/7 customer support</span>
        </li>
      </ul>
    </div>
  );
}
