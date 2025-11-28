import React from 'react';

export default function PurchaseProtection() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mt-6">
      <h4 className="font-bold mb-4 text-blue-900">Purchase Protection</h4>
      <ul className="flex flex-col gap-3 text-sm text-blue-900 list-none p-0 m-0">
        <li className="flex items-start gap-2">
          <span className="text-blue-600 mt-0.5">✓</span>
          <span>30-day money-back guarantee</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 mt-0.5">✓</span>
          <span>Secure payment processing</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 mt-0.5">✓</span>
          <span>Instant delivery to your email</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 mt-0.5">✓</span>
          <span>24/7 customer support</span>
        </li>
      </ul>
    </div>
  );
}
