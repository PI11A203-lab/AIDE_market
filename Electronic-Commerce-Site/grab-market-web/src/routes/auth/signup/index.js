import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import SignupHeader from './components/SignupHeader';
import SignupForm from './components/SignupForm';
import SignupFooter from './components/SignupFooter';
import { api } from '../../../config/api';
import './index.css';

export default function SignupPage() {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  // localStorage에서 언어 설정 불러오기 (메인 페이지에서 변경된 언어 반영)
  useEffect(() => {
    const savedLanguage = localStorage.getItem('appLanguage');
    if (savedLanguage && ['ko', 'ja', 'en'].includes(savedLanguage)) {
      // 저장된 언어로 강제 변경 (이미 같은 언어여도 확실하게 반영)
      i18n.changeLanguage(savedLanguage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignup = async (formData) => {
    setIsLoading(true);

    try {
      // 회원가입 API 호출
      const response = await api.users.create({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: 'user',
        profile_image: formData.profileImage || null,
      });

      if (response.data?.user) {
        const user = response.data.user;
        
        // 사용자 정보 저장
        const storage = formData.rememberMe ? localStorage : sessionStorage;
        storage.setItem('user', JSON.stringify({
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          nickname: user.username,
        }));

        message.success(t('auth.signup.success'));
        history.push('/');
      } else {
        message.error(t('auth.signup.fail'));
      }
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.error || error.message || t('auth.signup.error');
      message.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center py-10 px-5">
      <div className="w-full max-w-[440px]">
        <SignupHeader />
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 sm:p-10">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-2 text-center">{t('auth.signup.title')}</h2>
          <p className="text-sm text-[#6B7280] text-center mb-8">{t('auth.signup.subtitle')}</p>
          <SignupForm onSubmit={handleSignup} isLoading={isLoading} />
          <SignupFooter />
        </div>
        
        {/* 푸터 */}
        <div className="text-center mt-8 text-[13px] text-[#9CA3AF]">
          <p>{t('auth.signup.agreeText')}</p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <Link to="/terms" className="text-[#6B7280] hover:text-[#1A1A1A]">
              {t('auth.signup.terms')}
            </Link>
            <span className="text-[#D1D5DB]">•</span>
            <Link to="/privacy" className="text-[#6B7280] hover:text-[#1A1A1A]">
              {t('auth.signup.privacy')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

