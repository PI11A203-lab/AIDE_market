import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function LoginForm({ onSubmit, isLoading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password, rememberMe });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 이메일 */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-[#374151] mb-2">
          Email Address
        </label>
        <div className="relative">
          <svg 
            className="absolute left-[14px] top-1/2 transform -translate-y-1/2 text-[#9CA3AF] w-5 h-5" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full pl-[44px] pr-[14px] py-3 border border-[#E5E7EB] rounded-lg text-[15px] bg-white focus:outline-none focus:border-[#1A1A1A] focus:shadow-[0_0_0_3px_rgba(26,26,26,0.05)] transition-all"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* 비밀번호 */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-[#374151] mb-2">
          Password
        </label>
        <div className="relative">
          <svg 
            className="absolute left-[14px] top-1/2 transform -translate-y-1/2 text-[#9CA3AF] w-5 h-5" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full pl-[44px] pr-[44px] py-3 border border-[#E5E7EB] rounded-lg text-[15px] bg-white focus:outline-none focus:border-[#1A1A1A] focus:shadow-[0_0_0_3px_rgba(26,26,26,0.05)] transition-all"
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-[14px] top-1/2 transform -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] p-1"
            disabled={isLoading}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              {showPassword ? (
                <>
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </>
              ) : (
                <>
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-[18px] h-[18px] border border-[#D1D5DB] rounded checked:bg-[#1A1A1A] checked:border-[#1A1A1A] cursor-pointer"
            disabled={isLoading}
          />
          <span className="text-sm text-[#6B7280]">Remember me</span>
        </label>
        <Link to="/forgot-password" className="text-sm text-[#1A1A1A] font-medium hover:underline">
          Forgot password?
        </Link>
      </div>

      {/* 로그인 버튼 */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 bg-[#000000] text-white rounded-lg text-base font-semibold hover:bg-[#1A1A1A] transition-all disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF] disabled:cursor-not-allowed"
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}

