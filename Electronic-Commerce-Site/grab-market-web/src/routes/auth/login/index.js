import React, { useState } from 'react';
import { useHistory, useLocation, Link } from 'react-router-dom';
import { message } from 'antd';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import LoginFooter from './components/LoginFooter';
import { api } from '../../../config/api';
import './index.css';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const location = useLocation();

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

        message.success('로그인에 성공했습니다.');
        
        // 원래 접근하려던 페이지로 리다이렉트 (없으면 홈으로)
        const from = location.state?.from?.pathname || '/';
        history.push(from);
      } else {
        message.error('로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error || error.message || '로그인 중 오류가 발생했습니다.';
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
          <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-6 text-center">Sign In</h2>
          <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
          <LoginFooter />
        </div>
        
        {/* 푸터 */}
        <div className="text-center mt-8 text-[13px] text-[#9CA3AF]">
          <p>By signing in, you agree to our</p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <Link to="/terms" className="text-[#6B7280] hover:text-[#1A1A1A]">
              Terms of Service
            </Link>
            <span className="text-[#D1D5DB]">•</span>
            <Link to="/privacy" className="text-[#6B7280] hover:text-[#1A1A1A]">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

