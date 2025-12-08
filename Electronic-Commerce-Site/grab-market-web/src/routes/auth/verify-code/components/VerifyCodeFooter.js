import React from 'react';
import { Link } from 'react-router-dom';

export default function VerifyCodeFooter() {
  return (
    <div className="text-center text-sm text-[#6B7280]">
      <p className="mb-2">코드를 받지 못하셨나요?</p>
      <Link to="/forgot-password" className="text-[#1A1A1A] font-semibold hover:underline">
        다시 전송하기
      </Link>
    </div>
  );
}

