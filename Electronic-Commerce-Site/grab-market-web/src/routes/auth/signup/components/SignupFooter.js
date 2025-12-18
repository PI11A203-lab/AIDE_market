import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function SignupFooter() {
  const { t } = useTranslation();
  
  return (
    <div className="text-center text-sm text-[#6B7280]">
      {t('auth.signup.alreadyHaveAccount')}{' '}
      <Link to="/login" className="text-[#1A1A1A] font-semibold hover:underline">
        {t('auth.signup.signIn')}
      </Link>
    </div>
  );
}

