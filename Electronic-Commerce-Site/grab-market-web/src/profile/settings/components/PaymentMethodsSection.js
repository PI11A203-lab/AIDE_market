import React, { useState } from 'react';
import { CreditCard, Plus, Trash2, Save, X } from 'lucide-react';
import { message } from 'antd';

export default function PaymentMethodsSection({ paymentMethods, onAdd, onDelete }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    payment_method: 'credit_card',
    card_company: 'VISA',
    card_number: '',
    card_cvc: '',
    exp_month: '',
    exp_year: ''
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAdd = async () => {
    // 유효성 검사
    if (!formData.card_number || !formData.card_cvc || !formData.exp_month || !formData.exp_year) {
      message.error('모든 필드를 입력해주세요.');
      return;
    }

    if (formData.card_number.length < 13 || formData.card_number.length > 19) {
      message.error('카드 번호는 13~19자리여야 합니다.');
      return;
    }

    if (formData.card_cvc.length !== 3 && formData.card_cvc.length !== 4) {
      message.error('CVC는 3자리 또는 4자리여야 합니다.');
      return;
    }

    const month = parseInt(formData.exp_month);
    const year = parseInt(formData.exp_year);
    if (month < 1 || month > 12) {
      message.error('만료 월은 1~12 사이여야 합니다.');
      return;
    }

    const currentYear = new Date().getFullYear();
    if (year < currentYear || year > currentYear + 20) {
      message.error('만료 연도가 유효하지 않습니다.');
      return;
    }

    setSaving(true);
    try {
      const result = await onAdd({
        ...formData,
        exp_month: parseInt(formData.exp_month),
        exp_year: parseInt(formData.exp_year)
      });

      if (result.success) {
        message.success('결제방법이 추가되었습니다.');
        setFormData({
          payment_method: 'credit_card',
          card_company: 'VISA',
          card_number: '',
          card_cvc: '',
          exp_month: '',
          exp_year: ''
        });
        setShowAddForm(false);
      } else {
        message.error(result.error || '결제방법 추가에 실패했습니다.');
      }
    } catch (error) {
      message.error('결제방법 추가 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('이 결제방법을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const result = await onDelete(id);
      if (result.success) {
        message.success('결제방법이 삭제되었습니다.');
      } else {
        message.error(result.error || '결제방법 삭제에 실패했습니다.');
      }
    } catch (error) {
      message.error('결제방법 삭제 중 오류가 발생했습니다.');
    }
  };

  const maskCardNumber = (cardNumber) => {
    if (!cardNumber) return '';
    // 백엔드에서 이미 마스킹된 경우 그대로 반환
    if (cardNumber.includes('****')) {
      return cardNumber;
    }
    const last4 = cardNumber.slice(-4);
    return `****-****-****-${last4}`;
  };

  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <div className="settings-section-title">
          <CreditCard className="w-6 h-6" />
          <h2>결제방법</h2>
        </div>
        {!showAddForm && (
          <button 
            className="btn-add"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="w-4 h-4" />
            추가
          </button>
        )}
      </div>

      <div className="settings-section-content">
        {showAddForm && (
          <div className="payment-form">
            <div className="form-group">
              <label className="form-label no-icon">결제 방법</label>
              <select
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                className="form-select"
              >
                <option value="credit_card">신용카드</option>
                <option value="debit_card">체크카드</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label no-icon">카드사</label>
              <select
                name="card_company"
                value={formData.card_company}
                onChange={handleChange}
                className="form-select"
              >
                <option value="VISA">VISA</option>
                <option value="Master">Master</option>
                <option value="JCB">JCB</option>
                <option value="AMEX">AMEX</option>
                <option value="Diners">Diners</option>
                <option value="etc">기타</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label no-icon">카드 번호</label>
              <input
                type="text"
                name="card_number"
                value={formData.card_number}
                onChange={handleChange}
                className="form-input"
                placeholder="카드 번호를 입력하세요"
                maxLength="19"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label no-icon">만료 월</label>
                <input
                  type="number"
                  name="exp_month"
                  value={formData.exp_month}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="MM"
                  min="1"
                  max="12"
                  maxLength="2"
                />
              </div>

              <div className="form-group">
                <label className="form-label no-icon">만료 연도</label>
                <input
                  type="number"
                  name="exp_year"
                  value={formData.exp_year}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="YYYY"
                  min={new Date().getFullYear()}
                  maxLength="4"
                />
              </div>

              <div className="form-group">
                <label className="form-label no-icon">CVC</label>
                <input
                  type="text"
                  name="card_cvc"
                  value={formData.card_cvc}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="CVC"
                  maxLength="4"
                />
              </div>
            </div>

            <div className="form-actions">
              <button 
                className="btn-cancel"
                onClick={() => {
                  setShowAddForm(false);
                  setFormData({
                    payment_method: 'credit_card',
                    card_company: 'VISA',
                    card_number: '',
                    card_cvc: '',
                    exp_month: '',
                    exp_year: ''
                  });
                }}
                disabled={saving}
              >
                <X className="w-4 h-4" />
                취소
              </button>
              <button 
                className="btn-save"
                onClick={handleAdd}
                disabled={saving}
              >
                <Save className="w-4 h-4" />
                저장
              </button>
            </div>
          </div>
        )}

        <div className="payment-methods-list">
          {paymentMethods.length === 0 ? (
            <div className="empty-state">
              <CreditCard className="w-12 h-12" />
              <p className="empty-state-text">등록된 결제방법이 없습니다.</p>
            </div>
          ) : (
            paymentMethods.map((method) => (
              <div key={method.id} className="payment-method-card">
                <div className="payment-method-info">
                  <CreditCard className="w-5 h-5" />
                  <div className="payment-method-details">
                    <div className="payment-method-company">{method.card_company}</div>
                    <div className="payment-method-number">
                      {method.card_number || maskCardNumber(method.card_number_encrypted)}
                    </div>
                    <div className="payment-method-expiry">
                      만료일: {String(method.exp_month).padStart(2, '0')}/{method.exp_year}
                    </div>
                  </div>
                </div>
                <button
                  className="btn-delete-payment"
                  onClick={() => handleDelete(method.id)}
                  title="삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

