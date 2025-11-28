import React from 'react';
import { Link } from 'react-router-dom';

export default function SignupHeader() {
  return (
    <div className="text-center mb-8">
      <Link to="/" className="inline-flex items-center gap-2 no-underline mb-6">
        <span className="text-3xl">🤖</span>
        <span className="text-2xl font-bold text-blue-800">AIDE Market</span>
      </Link>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Your Account</h1>
      <p className="text-gray-600 text-sm">
        Join thousands of developers building amazing AI solutions
      </p>
    </div>
  );
}

