import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { message } from 'antd';
import SignupHeader from './components/SignupHeader';
import SignupForm from './components/SignupForm';
import SignupFooter from './components/SignupFooter';
import { api } from '../config/api';
import './index.css';

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

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

        message.success('회원가입에 성공했습니다.');
        history.push('/');
      } else {
        message.error('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.error || error.message || '회원가입 중 오류가 발생했습니다.';
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
          <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-2 text-center">Create Your Account</h2>
          <p className="text-sm text-[#6B7280] text-center mb-8">Join thousands of developers building amazing AI solutions</p>
          <SignupForm onSubmit={handleSignup} isLoading={isLoading} />
          <SignupFooter />
        </div>
        
        {/* 푸터 */}
        <div className="text-center mt-8 text-[13px] text-[#9CA3AF]">
          <p>By signing up, you agree to our</p>
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

