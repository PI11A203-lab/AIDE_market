import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function ForgotPasswordFooter() {
  const { t } = useTranslation();
  return (
    <div className="text-center text-sm text-[#6B7280]">
      <Link to="/login" className="text-[#1A1A1A] font-semibold hover:underline">
        {t('auth.forgotPassword.backToLogin')}
      </Link>
    </div>
  );
}

