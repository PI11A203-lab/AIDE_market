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

  // localStorage에서 언어 설정 불러오기 (메인 페이지에서 변경된 언어 반영)
  useEffect(() => {
    const savedLanguage = localStorage.getItem('appLanguage');
    if (savedLanguage && ['ko', 'ja', 'en'].includes(savedLanguage)) {
      // 저장된 언어로 강제 변경 (이미 같은 언어여도 확실하게 반영)
      i18n.changeLanguage(savedLanguage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        
        // 리다이렉트 처리: URL 파라미터 > state > 홈
        const redirectParam = new URLSearchParams(location.search).get('redirect');
        const from = redirectParam || location.state?.from?.pathname || '/';
        history.push(from);
      } else {
        // 서버에서 보낸 에러 코드를 i18n 키로 변환
        const errorCode = response.data?.error || response.data?.errorMessage;
        let errorMsg;
        
        if (errorCode && ['userNotFound', 'wrongPassword', 'googleAccount', 'invalidCredentials'].includes(errorCode)) {
          errorMsg = t(`auth.login.errors.${errorCode}`);
        } else {
          errorMsg = response.data?.error || t('auth.login.fail');
        }
        
        message.error(errorMsg);
      }
    } catch (error) {
      console.error('Login error:', error);
      // 서버에서 보낸 에러 코드를 i18n 키로 변환
      const errorCode = error.response?.data?.error || error.response?.data?.errorMessage;
      let errorMessage;
      
      if (errorCode && errorCode.startsWith('auth.login.errors.')) {
        // 이미 i18n 키 형식인 경우
        errorMessage = t(errorCode);
      } else if (errorCode && ['userNotFound', 'wrongPassword', 'googleAccount', 'invalidCredentials'].includes(errorCode)) {
        // 에러 코드를 i18n 키로 변환
        errorMessage = t(`auth.login.errors.${errorCode}`);
      } else {
        // 기본 에러 메시지
        errorMessage = error.response?.data?.error || error.message || t('auth.login.error');
      }
      
      message.error(errorMessage, 5); // 5초간 표시
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

