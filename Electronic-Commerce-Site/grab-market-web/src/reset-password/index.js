import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { message } from 'antd';
import ResetPasswordHeader from './components/ResetPasswordHeader';
import ResetPasswordForm from './components/ResetPasswordForm';
import ResetPasswordFooter from './components/ResetPasswordFooter';
import { api } from '../config/api';
import './index.css';

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState('');
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    // URL 파라미터에서 토큰 가져오기
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get('token');
    
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      message.error('유효하지 않은 재설정 토큰입니다.');
      history.push('/forgot-password');
    }
  }, [location, history]);

  const handleSubmit = async ({ newPassword, confirmPassword }) => {
    if (!token) {
      message.error('토큰이 없습니다.');
      return;
    }

    if (newPassword !== confirmPassword) {
      message.error('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (newPassword.length < 8) {
      message.error('비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.users.resetPassword(token, newPassword);
      
      if (response.data?.success) {
        message.success('비밀번호가 성공적으로 변경되었습니다.');
        setTimeout(() => {
          history.push('/login');
        }, 1500);
      }
    } catch (error) {
      console.error('Reset password error:', error);
      const errorMessage = error.response?.data?.error || error.message || '비밀번호 재설정 중 오류가 발생했습니다.';
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
          <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-6 text-center">Reset Password</h2>
          <p className="text-sm text-[#6B7280] mb-6 text-center">
            새 비밀번호를 입력해주세요.
          </p>
          <ResetPasswordForm onSubmit={handleSubmit} isLoading={isLoading} />
          <ResetPasswordFooter />
        </div>
      </div>
    </div>
  );
}

