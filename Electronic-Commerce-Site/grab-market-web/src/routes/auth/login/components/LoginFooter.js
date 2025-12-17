import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SocialLogin from './SocialLogin';

export default function LoginFooter() {
  const { t } = useTranslation();
  return (
    <>
      <SocialLogin />
      
      {/* 회원가입 링크 */}
      <div className="text-center text-sm text-[#6B7280] mb-6">
        {t('auth.login.noAccount')}{' '}
        <Link to="/signup" className="text-[#1A1A1A] font-semibold hover:underline">
          {t('auth.login.signUpLink')}
        </Link>
      </div>
    </>
  );
}

