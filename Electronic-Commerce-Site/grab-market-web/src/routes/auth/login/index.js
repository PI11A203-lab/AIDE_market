import React, { useState, useEffect } from 'react';
import { useHistory, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import LoginFooter from './components/LoginFooter';
import { api } from '../../../config/api';
import './index.css';

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const location = useLocation();

  // localStorage에서 언어 설정 불러오기
  useEffect(() => {
    const savedLanguage = localStorage.getItem('appLanguage');
    if (savedLanguage && ['ko', 'ja', 'en'].includes(savedLanguage)) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const handleLogin = async ({ email, password, rememberMe }) => {
    setIsLoading(true);

    try {
      // 실제 로그인 API 호출
      const response = await api.auth.login({ email, password });
      
      if (response.data?.success && response.data?.token) {
        // 토큰과 사용자 정보 저장
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('token', response.data.token);
        storage.setItem('user', JSON.stringify({
          id: response.data.user.id,
          username: response.data.user.username,
          email: response.data.user.email,
          role: response.data.user.role,
          nickname: response.data.user.username,
          profile_image: response.data.user.profile_image,
        }));

        message.success(t('auth.login.success'));
        
        // 원래 접근하려던 페이지로 리다이렉트 (없으면 홈으로)
        const from = location.state?.from?.pathname || '/';
        history.push(from);
      } else {
        message.error(t('auth.login.fail'));
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error || error.message || t('auth.login.error');
      message.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center py-10 px-5">
      <div className="w-full max-w-[440px]">
        <LoginHeader />
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 sm:p-10">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-6 text-center">{t('auth.login.title')}</h2>
          <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
          <LoginFooter />
        </div>
        
        {/* 푸터 */}
        <div className="text-center mt-8 text-[13px] text-[#9CA3AF]">
          <p>{t('auth.login.agreeText')}</p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <Link to="/terms" className="text-[#6B7280] hover:text-[#1A1A1A]">
              {t('auth.login.terms')}
            </Link>
            <span className="text-[#D1D5DB]">•</span>
            <Link to="/privacy" className="text-[#6B7280] hover:text-[#1A1A1A]">
              {t('auth.login.privacy')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

