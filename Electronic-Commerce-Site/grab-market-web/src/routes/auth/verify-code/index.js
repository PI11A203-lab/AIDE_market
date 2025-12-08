import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { message } from 'antd';
import VerifyCodeHeader from './components/VerifyCodeHeader';
import VerifyCodeForm from './components/VerifyCodeForm';
import VerifyCodeFooter from './components/VerifyCodeFooter';
import { api } from '../../../config/api';
import './index.css';

export default function VerifyCodePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [devCode, setDevCode] = useState('');
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    // URL 파라미터에서 이메일과 개발 코드 가져오기
    const params = new URLSearchParams(location.search);
    const emailFromUrl = params.get('email');
    const codeFromUrl = params.get('code');
    
    if (emailFromUrl) {
      setEmail(decodeURIComponent(emailFromUrl));
    } else {
      message.error('이메일 정보가 없습니다.');
      history.push('/forgot-password');
      return;
    }
    
    if (codeFromUrl) {
      setDevCode(codeFromUrl);
      message.info(`개발 환경 코드: ${codeFromUrl}`);
    }
  }, [location, history]);

  const handleSubmit = async ({ code }) => {
    if (!email) {
      message.error('이메일 정보가 없습니다.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.users.verifyResetCode(email, code);
      
      if (response.data?.success && response.data.resetToken) {
        message.success('인증 코드가 확인되었습니다.');
        // 토큰을 URL 파라미터로 전달하여 재설정 페이지로 이동
        setTimeout(() => {
          history.push(`/reset-password?token=${response.data.resetToken}`);
        }, 1000);
      }
    } catch (error) {
      console.error('Verify code error:', error);
      const errorMessage = error.response?.data?.error || error.message || '인증 코드 확인 중 오류가 발생했습니다.';
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
          <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-6 text-center">인증 코드 입력</h2>
          <p className="text-sm text-[#6B7280] mb-2 text-center">
            <strong>{email}</strong>로 전송된
          </p>
          <p className="text-sm text-[#6B7280] mb-6 text-center">
            6자리 인증 코드를 입력해주세요.
          </p>
          <VerifyCodeForm onSubmit={handleSubmit} isLoading={isLoading} devCode={devCode} />
          <VerifyCodeFooter />
        </div>
      </div>
    </div>
  );
}

