import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import ForgotPasswordHeader from './components/ForgotPasswordHeader';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import ForgotPasswordFooter from './components/ForgotPasswordFooter';
import { api } from '../../../config/api';
import './index.css';

export default function ForgotPasswordPage() {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  // localStorage에서 언어 설정 불러오기
  useEffect(() => {
    const savedLanguage = localStorage.getItem('appLanguage');
    if (savedLanguage && ['ko', 'ja', 'en'].includes(savedLanguage)) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const handleSubmit = async ({ email }) => {
    setIsLoading(true);

    try {
      const response = await api.users.requestPasswordReset(email);
      
      if (response.data?.success) {
        // 이메일 서버가 없어서 코드가 반환된 경우 (개발 편의)
        if (response.data.code) {
          message.warning(t('auth.forgotPassword.emailServerNotConfigured', { code: response.data.code }));
          console.log('인증 코드:', response.data.code);
          // 이메일과 함께 코드 입력 페이지로 이동
          history.push(`/verify-code?email=${encodeURIComponent(email)}&code=${response.data.code}`);
        } else {
          // 이메일 서버가 설정되어 있고 실제 이메일이 전송된 경우
          message.success(t('auth.forgotPassword.emailSent'));
          // 코드 입력 페이지로 이동 (코드 없이)
          history.push(`/verify-code?email=${encodeURIComponent(email)}`);
        }
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      const errorMessage = error.response?.data?.error || error.message || t('auth.forgotPassword.requestError');
      message.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center py-10 px-5">
      <div className="w-full max-w-[440px]">
        <ForgotPasswordHeader />
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 sm:p-10">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-6 text-center">{t('auth.forgotPassword.title')}</h2>
          <p className="text-sm text-[#6B7280] mb-6 text-center">
            {t('auth.forgotPassword.subtitle')}
          </p>
          <ForgotPasswordForm onSubmit={handleSubmit} isLoading={isLoading} />
          <ForgotPasswordFooter />
        </div>
      </div>
    </div>
  );
}

