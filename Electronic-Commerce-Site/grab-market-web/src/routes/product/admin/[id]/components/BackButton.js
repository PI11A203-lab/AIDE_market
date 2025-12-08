import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function BackButton({ onClick }) {
  return (
    <button
      className="admin-product-detail__back"
      onClick={onClick}
    >
      <ArrowLeft size={18} />
      <span>Back to Products</span>
    </button>
  );
}

