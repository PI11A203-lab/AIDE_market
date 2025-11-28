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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <SignupHeader />
        <div className="bg-white p-10 rounded-2xl shadow-xl">
          <SignupForm onSubmit={handleSignup} isLoading={isLoading} />
          <SignupFooter />
        </div>
      </div>
    </div>
  );
}

