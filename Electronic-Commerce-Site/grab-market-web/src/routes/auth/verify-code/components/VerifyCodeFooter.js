import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function VerifyCodeFooter() {
  const { t } = useTranslation();
  
  return (
    <div className="text-center text-sm text-[#6B7280]">
      <p className="mb-2">{t('auth.verifyCode.noCodeReceived')}</p>
      <Link to="/forgot-password" className="text-[#1A1A1A] font-semibold hover:underline">
        {t('auth.verifyCode.resend')}
      </Link>
    </div>
  );
}

