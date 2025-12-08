import React, { useState } from 'react';
import { CreditCard, Lock } from 'lucide-react';

export default function PaymentForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardCvc: '',
    expMonth: '',
    expYear: '',
    cardCompany: 'VISA',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // 카드 번호 검증 (16자리 숫자)
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = '카드 번호를 입력해주세요.';
    } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = '올바른 카드 번호 형식이 아닙니다. (16자리 숫자)';
    }

    // CVC 검증 (3자리 숫자)
    if (!formData.cardCvc.trim()) {
      newErrors.cardCvc = 'CVC를 입력해주세요.';
    } else if (!/^\d{3,4}$/.test(formData.cardCvc)) {
      newErrors.cardCvc = '올바른 CVC 형식이 아닙니다. (3-4자리 숫자)';
    }

    // 만료 월 검증
    if (!formData.expMonth) {
      newErrors.expMonth = '만료 월을 선택해주세요.';
    } else {
      const month = parseInt(formData.expMonth);
      if (month < 1 || month > 12) {
        newErrors.expMonth = '올바른 월을 선택해주세요.';
      }
    }

    // 만료 연도 검증
    if (!formData.expYear) {
      newErrors.expYear = '만료 연도를 선택해주세요.';
    } else {
      const year = parseInt(formData.expYear);
      const currentYear = new Date().getFullYear();
      if (year < currentYear || year > currentYear + 10) {
        newErrors.expYear = '올바른 연도를 선택해주세요.';
      }
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
    // 카드 번호는 숫자만 허용하고 16자리로 제한
    if (field === 'cardNumber') {
      value = value.replace(/\D/g, '').slice(0, 16);
    }
    // CVC는 숫자만 허용하고 4자리로 제한
    else if (field === 'cardCvc') {
      value = value.replace(/\D/g, '').slice(0, 4);
    }

    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear + i);

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-gray-200 mt-8">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-800">Payment Information</h3>
      </div>

      <div className="flex flex-col gap-5">
        {/* 카드 회사 선택 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Card Company</label>
          <select
            value={formData.cardCompany}
            onChange={(e) => handleChange('cardCompany', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg text-base transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.cardCompany ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
          >
            <option value="VISA">VISA</option>
            <option value="Master">Master</option>
            <option value="JCB">JCB</option>
            <option value="AMEX">AMEX</option>
            <option value="Diners">Diners</option>
            <option value="etc">Other</option>
          </select>
          {errors.cardCompany && (
            <p className="text-xs text-red-600 mt-1">{errors.cardCompany}</p>
          )}
        </div>

        {/* 카드 번호 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Card Number</label>
          <div className="relative">
            <input
              type="text"
              value={formData.cardNumber.replace(/(.{4})/g, '$1 ').trim()}
              onChange={(e) => handleChange('cardNumber', e.target.value.replace(/\s/g, ''))}
              placeholder="1234 5678 9012 3456"
              className={`w-full px-4 py-3 pr-12 border rounded-lg text-base transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.cardNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              maxLength={19}
              disabled={isLoading}
            />
            <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          {errors.cardNumber && (
            <p className="text-xs text-red-600 mt-1">{errors.cardNumber}</p>
          )}
        </div>

        {/* 만료일 및 CVC */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Expiration Month</label>
            <select
              value={formData.expMonth}
              onChange={(e) => handleChange('expMonth', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg text-base transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.expMonth ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
            >
              <option value="">Month</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={month.toString().padStart(2, '0')}>
                  {month.toString().padStart(2, '0')}
                </option>
              ))}
            </select>
            {errors.expMonth && (
              <p className="text-xs text-red-600 mt-1">{errors.expMonth}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Expiration Year</label>
            <select
              value={formData.expYear}
              onChange={(e) => handleChange('expYear', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg text-base transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.expYear ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
            >
              <option value="">Year</option>
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {errors.expYear && (
              <p className="text-xs text-red-600 mt-1">{errors.expYear}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">CVC</label>
            <input
              type="text"
              value={formData.cardCvc}
              onChange={(e) => handleChange('cardCvc', e.target.value)}
              placeholder="123"
              className={`w-full px-4 py-3 border rounded-lg text-base transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.cardCvc ? 'border-red-500' : 'border-gray-300'
              }`}
              maxLength={4}
              disabled={isLoading}
            />
            {errors.cardCvc && (
              <p className="text-xs text-red-600 mt-1">{errors.cardCvc}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing...' : 'Complete Payment'}
        </button>
      </div>
    </form>
  );
}
