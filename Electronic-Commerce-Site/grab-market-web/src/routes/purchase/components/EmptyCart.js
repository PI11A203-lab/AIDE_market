import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function EmptyCart() {
  const { t } = useTranslation();
  return (
    <div className="text-center py-20 px-8">
      <svg className="w-20 h-20 mx-auto mb-6 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
      <h3 className="text-3xl font-bold text-gray-900 mb-3">{t('purchase.empty.title')}</h3>
      <p className="text-base text-gray-500 mb-8">
        {t('purchase.empty.description')}
      </p>
      <Link 
        to="/" 
        className="inline-block px-8 py-3.5 bg-black text-white border-none rounded-[10px] text-base font-semibold no-underline transition-all hover:bg-gray-900 hover:-translate-y-px hover:shadow-md active:translate-y-0"
      >
        {t('purchase.empty.cta')}
      </Link>
    </div>
  );
}
