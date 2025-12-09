import React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function ProductHeader() {
  const history = useHistory();
  const { t } = useTranslation();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-12 py-5">
        <div className="flex items-center justify-between">
          <a href="/" className="text-2xl font-bold text-gray-900 no-underline">
            AIDE Market
          </a>
          <a 
            href="/"
            onClick={(e) => {
              e.preventDefault();
              history.push('/');
            }}
            className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-lg text-[15px] font-semibold no-underline hover:bg-gray-900 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            {t('product.header.backHome')}
          </a>
        </div>
      </div>
    </header>
  );
}

