import React from 'react';
import { Link } from 'react-router-dom';

export default function ResetPasswordFooter() {
  return (
    <div className="text-center text-sm text-[#6B7280]">
      <Link to="/login" className="text-[#1A1A1A] font-semibold hover:underline">
        로그인으로 돌아가기
      </Link>
    </div>
  );
}

