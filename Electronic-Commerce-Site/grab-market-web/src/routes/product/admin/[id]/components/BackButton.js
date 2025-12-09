import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function BackButton({ onClick }) {
  const { t } = useTranslation();
  return (
    <button
      className="admin-product-detail__back"
      onClick={onClick}
    >
      <ArrowLeft size={18} />
      <span>{t('productAdmin.detail.back')}</span>
    </button>
  );
}

