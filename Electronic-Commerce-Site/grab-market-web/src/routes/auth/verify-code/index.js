import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import VerifyCodeHeader from './components/VerifyCodeHeader';
import VerifyCodeForm from './components/VerifyCodeForm';
import VerifyCodeFooter from './components/VerifyCodeFooter';
import { api } from '../../../config/api';
import './index.css';

export default function VerifyCodePage() {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [devCode, setDevCode] = useState('');
  const history = useHistory();
  const location = useLocation();

  // localStorage에서 언어 설정 불러오기 (메인 페이지에서 변경된 언어 반영)
  useEffect(() => {
    const savedLanguage = localStorage.getItem('appLanguage');
    if (savedLanguage && ['ko', 'ja', 'en'].includes(savedLanguage)) {
      // 저장된 언어로 강제 변경 (이미 같은 언어여도 확실하게 반영)
      i18n.changeLanguage(savedLanguage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // URL 파라미터에서 이메일과 개발 코드 가져오기
    const params = new URLSearchParams(location.search);
    const emailFromUrl = params.get('email');
    const codeFromUrl = params.get('code');
    
    if (emailFromUrl) {
      setEmail(decodeURIComponent(emailFromUrl));
    } else {
      message.error(t('auth.verifyCode.noEmail'));
      history.push('/forgot-password');
      return;
    }
    
    if (codeFromUrl) {
      setDevCode(codeFromUrl);
      message.info(t('auth.verifyCode.devCodeInfo', { code: codeFromUrl }));
    }
  }, [location, history, t]);

  const handleSubmit = async ({ code }) => {
    if (!email) {
      message.error(t('auth.verifyCode.noEmail'));
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.users.verifyResetCode(email, code);
      
      if (response.data?.success && response.data.resetToken) {
        message.success(t('auth.verifyCode.verifySuccess'));
        // 토큰을 URL 파라미터로 전달하여 재설정 페이지로 이동
        setTimeout(() => {
          history.push(`/reset-password?token=${response.data.resetToken}`);
        }, 1000);
      }
    } catch (error) {
      console.error('Verify code error:', error);
      const errorMessage = error.response?.data?.error || error.message || t('auth.verifyCode.verifyError');
      message.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center py-10 px-5">
      <div className="w-full max-w-[440px]">
        <VerifyCodeHeader />
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 sm:p-10">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-6 text-center">{t('auth.verifyCode.title')}</h2>
          <p className="text-sm text-[#6B7280] mb-2 text-center">
            {t('auth.verifyCode.subtitle1', { email })}
          </p>
          <p className="text-sm text-[#6B7280] mb-6 text-center">
            {t('auth.verifyCode.subtitle2')}
          </p>
          <VerifyCodeForm onSubmit={handleSubmit} isLoading={isLoading} devCode={devCode} />
          <VerifyCodeFooter />
        </div>
      </div>
    </div>
  );
}

