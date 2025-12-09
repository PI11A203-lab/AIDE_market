import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function PurchaseHeader() {
  const history = useHistory();
  const { t } = useTranslation();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-5 md:px-[40px] py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-inherit no-underline">
          <span className="text-[24px] font-bold text-gray-900">AIDE Market</span>
        </Link>
        <button 
          onClick={() => history.push('/')}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white border-none rounded-[10px] text-[15px] font-semibold cursor-pointer transition-colors hover:bg-gray-900"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          {t('purchase.header.backHome')}
        </button>
      </div>
    </header>
  );
}
