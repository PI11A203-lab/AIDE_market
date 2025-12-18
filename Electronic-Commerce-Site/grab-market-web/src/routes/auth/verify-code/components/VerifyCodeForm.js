import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function VerifyCodeForm({ onSubmit, isLoading, devCode }) {
  const { t } = useTranslation();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  useEffect(() => {
    // 개발 환경에서 코드가 있으면 자동 입력
    if (devCode && devCode.length === 6) {
      setCode(devCode.split(''));
      // 모든 입력 필드에 포커스
      inputRefs.current.forEach((ref, index) => {
        if (ref) {
          ref.value = devCode[index];
        }
      });
    }
  }, [devCode]);

  const handleChange = (index, value) => {
    // 숫자만 허용
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // 다음 입력 필드로 이동
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // 모든 필드가 채워지면 자동 제출
    if (newCode.every(digit => digit !== '') && newCode.join('').length === 6) {
      onSubmit({ code: newCode.join('') });
    }
  };

  const handleKeyDown = (index, e) => {
    // Backspace 처리
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split('');
      setCode(newCode);
      newCode.forEach((digit, index) => {
        if (inputRefs.current[index]) {
          inputRefs.current[index].value = digit;
        }
      });
      // 마지막 입력 필드에 포커스
      inputRefs.current[5]?.focus();
      // 자동 제출
      setTimeout(() => {
        onSubmit({ code: pastedData });
      }, 100);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const codeString = code.join('');
    if (codeString.length === 6) {
      onSubmit({ code: codeString });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label className="block text-sm font-semibold text-[#374151] mb-2 text-center">
          {t('auth.verifyCode.codeLabel')}
        </label>
        <div className="flex justify-center gap-2">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-12 h-14 text-center text-2xl font-bold border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#1A1A1A] focus:shadow-[0_0_0_3px_rgba(26,26,26,0.05)] transition-all"
              disabled={isLoading}
              autoFocus={index === 0}
            />
          ))}
        </div>
        <p className="text-xs text-[#9CA3AF] mt-3 text-center">
          {t('auth.verifyCode.codeHint')}
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading || code.join('').length !== 6}
        className="w-full py-3.5 bg-[#000000] text-white rounded-lg text-base font-semibold hover:bg-[#1A1A1A] transition-all disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF] disabled:cursor-not-allowed mb-6"
      >
        {isLoading ? t('auth.verifyCode.verifying') : t('auth.verifyCode.verify')}
      </button>
    </form>
  );
}

