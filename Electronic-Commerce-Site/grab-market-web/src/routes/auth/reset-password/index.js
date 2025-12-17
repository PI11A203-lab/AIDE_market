import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import ResetPasswordHeader from './components/ResetPasswordHeader';
import ResetPasswordForm from './components/ResetPasswordForm';
import ResetPasswordFooter from './components/ResetPasswordFooter';
import { api } from '../../../config/api';
import './index.css';

export default function ResetPasswordPage() {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState('');
  const history = useHistory();
  const location = useLocation();

  // localStorage에서 언어 설정 불러오기
  useEffect(() => {
    const savedLanguage = localStorage.getItem('appLanguage');
    if (savedLanguage && ['ko', 'ja', 'en'].includes(savedLanguage)) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  useEffect(() => {
    // URL 파라미터에서 토큰 가져오기
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get('token');
    
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      message.error(t('auth.resetPassword.invalidToken'));
      history.push('/forgot-password');
    }
  }, [location, history, t]);

  const handleSubmit = async ({ newPassword, confirmPassword }) => {
    if (!token) {
      message.error(t('auth.resetPassword.noToken'));
      return;
    }

    if (newPassword !== confirmPassword) {
      message.error(t('auth.resetPassword.passwordMismatch'));
      return;
    }

    if (newPassword.length < 8) {
      message.error(t('auth.resetPassword.passwordMinLength'));
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.users.resetPassword(token, newPassword);
      
      if (response.data?.success) {
        message.success(t('auth.resetPassword.success'));
        setTimeout(() => {
          history.push('/login');
        }, 1500);
      }
    } catch (error) {
      console.error('Reset password error:', error);
      const errorMessage = error.response?.data?.error || error.message || t('auth.resetPassword.resetError');
      message.error(errorMessage);
      
      // 토큰이 만료되었거나 유효하지 않은 경우
      if (error.response?.status === 400) {
        setTimeout(() => {
          history.push('/forgot-password');
        }, 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return null; // 토큰이 없으면 아무것도 렌더링하지 않음
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center py-10 px-5">
      <div className="w-full max-w-[440px]">
        <ResetPasswordHeader />
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 sm:p-10">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-6 text-center">{t('auth.resetPassword.title')}</h2>
          <p className="text-sm text-[#6B7280] mb-6 text-center">
            {t('auth.resetPassword.subtitle')}
          </p>
          <ResetPasswordForm onSubmit={handleSubmit} isLoading={isLoading} />
          <ResetPasswordFooter />
        </div>
      </div>
    </div>
  );
}

