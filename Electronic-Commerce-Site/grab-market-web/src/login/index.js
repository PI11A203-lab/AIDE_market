import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { message } from 'antd';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import LoginFooter from './components/LoginFooter';
import { api } from '../config/api';
import './index.css';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const handleLogin = async ({ email, password, rememberMe }) => {
    setIsLoading(true);

    try {
      // 사용자 목록에서 이메일로 사용자 찾기 (임시 - 실제로는 로그인 API가 필요)
      // TODO: 서버에 로그인 API가 추가되면 api.auth.login() 사용
      const usersResponse = await api.users.getList({ limit: 1000 });
      const users = usersResponse.data?.users || [];
      const user = users.find(u => u.email === email);

      if (!user) {
        message.error('이메일 또는 비밀번호가 올바르지 않습니다.');
        setIsLoading(false);
        return;
      }

      // 비밀번호 검증 (실제로는 서버에서 처리해야 함)
      // TODO: 서버에 로그인 API가 추가되면 이 부분 제거
      const passwordValid = await api.users.validatePassword(user.id, password);
      
      if (passwordValid.data?.valid) {
        // 토큰 저장 (실제로는 서버에서 받아야 함)
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('token', `mock-token-${user.id}`); // 임시 토큰
        storage.setItem('user', JSON.stringify({
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          nickname: user.username,
        }));

        message.success('로그인에 성공했습니다.');
        history.push('/');
      } else {
        message.error('이메일 또는 비밀번호가 올바르지 않습니다.');
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

