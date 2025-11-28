import React from 'react';
import { Link } from 'react-router-dom';

export default function SignupFooter() {
  return (
    <div className="text-center mt-6">
      <p className="text-gray-600 text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 font-semibold no-underline hover:text-blue-700 hover:underline transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}

