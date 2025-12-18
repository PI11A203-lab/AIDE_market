import React from 'react';
import { useTranslation } from 'react-i18next';

export default function PurchaseProtection() {
  const { t } = useTranslation();
  return (
    <div className="bg-blue-50 border border-blue-300 rounded-2xl p-5 mt-4">
      <h4 className="text-base font-bold text-blue-900 mb-3">{t('purchase.protection.title')}</h4>
      <ul className="flex flex-col gap-2 list-none p-0 m-0">
        <li className="flex items-start gap-2 text-sm text-blue-900">
          <span>✓</span>
          <span>{t('purchase.protection.guarantee')}</span>
        </li>
        <li className="flex items-start gap-2 text-sm text-blue-900">
          <span>✓</span>
          <span>{t('purchase.protection.secure')}</span>
        </li>
        <li className="flex items-start gap-2 text-sm text-blue-900">
          <span>✓</span>
          <span>{t('purchase.protection.delivery')}</span>
        </li>
        <li className="flex items-start gap-2 text-sm text-blue-900">
          <span>✓</span>
          <span>{t('purchase.protection.support')}</span>
        </li>
      </ul>
    </div>
  );
}
