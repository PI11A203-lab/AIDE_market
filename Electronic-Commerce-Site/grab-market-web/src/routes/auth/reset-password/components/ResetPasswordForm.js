import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ResetPasswordForm({ onSubmit, isLoading }) {
  const { t } = useTranslation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    if (!newPassword) {
      newErrors.newPassword = t('auth.resetPassword.passwordRequired');
    } else if (newPassword.length < 8) {
      newErrors.newPassword = t('auth.resetPassword.passwordMinLength');
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = t('auth.resetPassword.confirmPasswordRequired');
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = t('auth.resetPassword.passwordMismatch');
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit({ newPassword, confirmPassword });
    }
  };

  const handleChange = (field, value) => {
    if (field === 'newPassword') {
      setNewPassword(value);
    } else if (field === 'confirmPassword') {
      setConfirmPassword(value);
    }
    
    // 필드 변경 시 해당 필드의 에러 제거
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 새 비밀번호 */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-[#374151] mb-2">
          {t('auth.resetPassword.newPasswordLabel')}
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
            type={showNewPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => handleChange('newPassword', e.target.value)}
            placeholder="••••••••"
            className={`w-full pl-[44px] pr-[44px] py-3 border rounded-lg text-[15px] bg-white focus:outline-none transition-all ${
              errors.newPassword 
                ? 'border-[#DC2626] focus:border-[#DC2626] focus:shadow-[0_0_0_3px_rgba(220,38,38,0.1)]' 
                : 'border-[#E5E7EB] focus:border-[#1A1A1A] focus:shadow-[0_0_0_3px_rgba(26,26,26,0.05)]'
            }`}
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
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
              {showNewPassword ? (
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
        {errors.newPassword && (
          <p className="mt-1.5 text-[13px] text-[#DC2626]">{errors.newPassword}</p>
        )}
      </div>

      {/* 비밀번호 확인 */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-[#374151] mb-2">
          {t('auth.resetPassword.confirmPasswordLabel')}
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
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            placeholder="••••••••"
            className={`w-full pl-[44px] pr-[44px] py-3 border rounded-lg text-[15px] bg-white focus:outline-none transition-all ${
              errors.confirmPassword 
                ? 'border-[#DC2626] focus:border-[#DC2626] focus:shadow-[0_0_0_3px_rgba(220,38,38,0.1)]' 
                : 'border-[#E5E7EB] focus:border-[#1A1A1A] focus:shadow-[0_0_0_3px_rgba(26,26,26,0.05)]'
            }`}
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
              {showConfirmPassword ? (
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
        {errors.confirmPassword && (
          <p className="mt-1.5 text-[13px] text-[#DC2626]">{errors.confirmPassword}</p>
        )}
      </div>

      {/* 제출 버튼 */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 bg-[#000000] text-white rounded-lg text-base font-semibold hover:bg-[#1A1A1A] transition-all disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF] disabled:cursor-not-allowed mb-6"
      >
        {isLoading ? t('auth.resetPassword.submitting') : t('auth.resetPassword.submitButton')}
      </button>
    </form>
  );
}

