import React from 'react';
import { Link } from 'react-router-dom';

export default function SignupFooter() {
  return (
    <div className="text-center text-sm text-[#6B7280]">
      Already have an account?{' '}
      <Link to="/login" className="text-[#1A1A1A] font-semibold hover:underline">
        Sign in
      </Link>
    </div>
  );
}

