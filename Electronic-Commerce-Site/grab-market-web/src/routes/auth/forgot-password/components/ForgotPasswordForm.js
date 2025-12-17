import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ForgotPasswordForm({ onSubmit, isLoading }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 이메일 */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-[#374151] mb-2">
          {t('auth.forgotPassword.emailLabel')}
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
            placeholder={t('auth.forgotPassword.emailPlaceholder')}
            className="w-full pl-[44px] pr-[14px] py-3 border border-[#E5E7EB] rounded-lg text-[15px] bg-white focus:outline-none focus:border-[#1A1A1A] focus:shadow-[0_0_0_3px_rgba(26,26,26,0.05)] transition-all"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* 제출 버튼 */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 bg-[#000000] text-white rounded-lg text-base font-semibold hover:bg-[#1A1A1A] transition-all disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF] disabled:cursor-not-allowed mb-6"
      >
        {isLoading ? t('auth.forgotPassword.submitting') : t('auth.forgotPassword.submitButton')}
      </button>
    </form>
  );
}

