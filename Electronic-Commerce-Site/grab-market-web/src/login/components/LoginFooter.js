import React from 'react';
import { Link } from 'react-router-dom';
import SocialLogin from './SocialLogin';

export default function LoginFooter() {
  return (
    <>
      <SocialLogin />
      
      {/* 회원가입 링크 */}
      <div className="text-center text-sm text-[#6B7280] mb-6">
        Don't have an account?{' '}
        <Link to="/signup" className="text-[#1A1A1A] font-semibold hover:underline">
          Sign up for free
        </Link>
      </div>
    </>
  );
}

