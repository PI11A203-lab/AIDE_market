import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { message } from 'antd';
import ForgotPasswordHeader from './components/ForgotPasswordHeader';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import ForgotPasswordFooter from './components/ForgotPasswordFooter';
import { api } from '../config/api';
import './index.css';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const handleSubmit = async ({ email }) => {
    setIsLoading(true);

    try {
      const response = await api.users.requestPasswordReset(email);
      
      if (response.data?.success) {
        // 이메일 서버가 없어서 코드가 반환된 경우 (개발 편의)
        if (response.data.code) {
          message.warning(`이메일 서버가 설정되지 않아 코드를 표시합니다: ${response.data.code}`);
          console.log('인증 코드:', response.data.code);
          // 이메일과 함께 코드 입력 페이지로 이동
          history.push(`/verify-code?email=${encodeURIComponent(email)}&code=${response.data.code}`);
        } else {
          // 이메일 서버가 설정되어 있고 실제 이메일이 전송된 경우
          message.success('인증 코드를 이메일로 전송했습니다. 이메일을 확인해주세요.');
          // 코드 입력 페이지로 이동 (코드 없이)
          history.push(`/verify-code?email=${encodeURIComponent(email)}`);
        }
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      const errorMessage = error.response?.data?.error || error.message || '비밀번호 재설정 요청 중 오류가 발생했습니다.';
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
          <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-6 text-center">Forgot Password</h2>
          <p className="text-sm text-[#6B7280] mb-6 text-center">
            비밀번호를 재설정하기 위해 이메일 주소를 입력해주세요.
          </p>
          <ForgotPasswordForm onSubmit={handleSubmit} isLoading={isLoading} />
          <ForgotPasswordFooter />
        </div>
      </div>
    </div>
  );
}

