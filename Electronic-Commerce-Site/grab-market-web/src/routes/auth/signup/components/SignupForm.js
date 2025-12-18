import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function SignupForm({ onSubmit, isLoading }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // 사용자명 검증
    if (!formData.username.trim()) {
      newErrors.username = t('auth.signup.errors.usernameRequired');
    } else if (formData.username.length < 3) {
      newErrors.username = t('auth.signup.errors.usernameMinLength');
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = t('auth.signup.errors.usernameInvalid');
    }

    // 이메일 검증
    if (!formData.email.trim()) {
      newErrors.email = t('auth.signup.errors.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('auth.signup.errors.emailInvalid');
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = t('auth.signup.errors.passwordRequired');
    } else if (formData.password.length < 8) {
      newErrors.password = t('auth.signup.errors.passwordMinLength');
    }

    // 비밀번호 확인 검증
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.signup.errors.confirmPasswordRequired');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.signup.errors.passwordMismatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 필드 변경 시 해당 필드의 에러 제거
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 사용자명 */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-[#374151] mb-2">
          {t('auth.signup.usernameLabel')}
        </label>
        <div className="relative">
          <svg 
            className="absolute left-[14px] top-1/2 transform -translate-y-1/2 text-[#9CA3AF] w-5 h-5" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => handleChange('username', e.target.value)}
            placeholder={t('auth.signup.usernamePlaceholder')}
            className={`w-full pl-[44px] pr-[14px] py-3 border rounded-lg text-[15px] bg-white focus:outline-none transition-all ${
              errors.username 
                ? 'border-[#DC2626] focus:border-[#DC2626] focus:shadow-[0_0_0_3px_rgba(220,38,38,0.1)]' 
                : 'border-[#E5E7EB] focus:border-[#1A1A1A] focus:shadow-[0_0_0_3px_rgba(26,26,26,0.05)]'
            }`}
            required
            disabled={isLoading}
          />
        </div>
        {errors.username && (
          <p className="mt-1.5 text-[13px] text-[#DC2626]">{errors.username}</p>
        )}
      </div>

      {/* 이메일 */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-[#374151] mb-2">
          {t('auth.signup.emailLabel')}
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
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder={t('auth.signup.emailPlaceholder')}
            className={`w-full pl-[44px] pr-[14px] py-3 border rounded-lg text-[15px] bg-white focus:outline-none transition-all ${
              errors.email 
                ? 'border-[#DC2626] focus:border-[#DC2626] focus:shadow-[0_0_0_3px_rgba(220,38,38,0.1)]' 
                : 'border-[#E5E7EB] focus:border-[#1A1A1A] focus:shadow-[0_0_0_3px_rgba(26,26,26,0.05)]'
            }`}
            required
            disabled={isLoading}
          />
        </div>
        {errors.email && (
          <p className="mt-1.5 text-[13px] text-[#DC2626]">{errors.email}</p>
        )}
      </div>

      {/* 비밀번호 */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-[#374151] mb-2">
          {t('auth.signup.passwordLabel')}
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
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder={t('auth.signup.passwordPlaceholder')}
            className={`w-full pl-[44px] pr-[44px] py-3 border rounded-lg text-[15px] bg-white focus:outline-none transition-all ${
              errors.password 
                ? 'border-[#DC2626] focus:border-[#DC2626] focus:shadow-[0_0_0_3px_rgba(220,38,38,0.1)]' 
                : 'border-[#E5E7EB] focus:border-[#1A1A1A] focus:shadow-[0_0_0_3px_rgba(26,26,26,0.05)]'
            }`}
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
        {errors.password && (
          <p className="mt-1.5 text-[13px] text-[#DC2626]">{errors.password}</p>
        )}
      </div>

      {/* 비밀번호 확인 */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-[#374151] mb-2">
          {t('auth.signup.confirmPasswordLabel')}
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
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            placeholder={t('auth.signup.passwordPlaceholder')}
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

      {/* Remember Me */}
      <div className="mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.rememberMe}
            onChange={(e) => handleChange('rememberMe', e.target.checked)}
            className="w-[18px] h-[18px] border border-[#D1D5DB] rounded checked:bg-[#1A1A1A] checked:border-[#1A1A1A] cursor-pointer"
            disabled={isLoading}
          />
          <span className="text-sm text-[#6B7280]">{t('auth.signup.rememberMe')}</span>
        </label>
      </div>

      {/* 회원가입 버튼 */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 bg-[#000000] text-white rounded-lg text-base font-semibold hover:bg-[#1A1A1A] transition-all disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF] disabled:cursor-not-allowed mb-6"
      >
        {isLoading ? t('auth.signup.creating') : t('auth.signup.createButton')}
      </button>
    </form>
  );
}

