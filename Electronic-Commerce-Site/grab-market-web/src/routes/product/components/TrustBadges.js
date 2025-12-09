import React from 'react';
import { useTranslation } from 'react-i18next';

export default function TrustBadges() {
  const { t } = useTranslation();
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h4 className="text-base font-bold text-gray-900 mb-4">{t('product.trust.title')}</h4>
      <div className="flex flex-col gap-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="7"/>
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
            </svg>
          </div>
          <span className="text-sm text-gray-700 font-medium">{t('product.trust.identity')}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <span className="text-sm text-gray-700 font-medium">{t('product.trust.topRated')}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              <polyline points="17 6 23 6 23 12"/>
            </svg>
          </div>
          <span className="text-sm text-gray-700 font-medium">{t('product.trust.success')}</span>
        </div>
      </div>
    </div>
  );
}

