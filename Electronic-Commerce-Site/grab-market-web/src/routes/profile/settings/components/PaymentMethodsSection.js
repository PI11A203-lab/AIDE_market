import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, Plus, Trash2, Save, X } from 'lucide-react';
import { message } from 'antd';

export default function PaymentMethodsSection({ paymentMethods, onAdd, onDelete }) {
  const { t } = useTranslation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    payment_method: 'credit_card',
    card_company: 'VISA',
    card_number: '',
    cvc: '',  // ⚠️ card_cvc → cvc로 변경
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
    if (!formData.card_number || !formData.cvc || !formData.exp_month || !formData.exp_year) {
      message.error(t('profile.settings.paymentMethods.allFieldsRequired'));
      return;
    }

    if (formData.card_number.length < 13 || formData.card_number.length > 19) {
      message.error(t('profile.settings.paymentMethods.cardNumberInvalid'));
      return;
    }

    if (formData.cvc.length !== 3 && formData.cvc.length !== 4) {
      message.error(t('profile.settings.paymentMethods.cvcInvalid'));
      return;
    }

    const month = parseInt(formData.exp_month);
    const year = parseInt(formData.exp_year);
    if (month < 1 || month > 12) {
      message.error(t('profile.settings.paymentMethods.expMonthInvalid'));
      return;
    }

    const currentYear = new Date().getFullYear();
    if (year < currentYear || year > currentYear + 20) {
      message.error(t('profile.settings.paymentMethods.expYearInvalid'));
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
        message.success(t('profile.settings.paymentMethods.addSuccess'));
        setFormData({
          payment_method: 'credit_card',
          card_company: 'VISA',
          card_number: '',
          cvc: '',  // ⚠️ card_cvc → cvc로 변경
          exp_month: '',
          exp_year: ''
        });
        setShowAddForm(false);
      } else {
        message.error(result.error || t('profile.settings.paymentMethods.addFail'));
      }
    } catch (error) {
      message.error(t('profile.settings.paymentMethods.addError'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    // 최소 하나의 결제 수단은 유지해야 함
    if (paymentMethods.length <= 1) {
      message.warning(t('profile.settings.paymentMethods.cannotDeleteLast'), 5);
      // 안내 메시지 후 추가 폼 표시
      if (!showAddForm) {
        setTimeout(() => {
          setShowAddForm(true);
        }, 500);
      }
      return;
    }

    if (!window.confirm(t('profile.settings.paymentMethods.deleteConfirm'))) {
      return;
    }

    try {
      const result = await onDelete(id);
      if (result.success) {
        message.success(t('profile.settings.paymentMethods.deleteSuccess'));
      } else {
        message.error(result.error || t('profile.settings.paymentMethods.deleteFail'));
      }
    } catch (error) {
      message.error(t('profile.settings.paymentMethods.deleteError'));
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
          <h2>{t('profile.settings.paymentMethods.title')}</h2>
        </div>
        {!showAddForm && (
          <button 
            className="btn-add"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="w-4 h-4" />
            {t('profile.settings.paymentMethods.add')}
          </button>
        )}
      </div>

      <div className="settings-section-content">
        {showAddForm && (
          <div className="payment-form">
            <div className="form-group">
              <label className="form-label no-icon">{t('profile.settings.paymentMethods.paymentMethod')}</label>
              <select
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                className="form-select"
              >
                <option value="credit_card">{t('profile.settings.paymentMethods.creditCard')}</option>
                <option value="debit_card">{t('profile.settings.paymentMethods.debitCard')}</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label no-icon">{t('profile.settings.paymentMethods.cardCompany')}</label>
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
                <option value="etc">{t('profile.settings.personalInfo.developerTypes.other')}</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label no-icon">{t('profile.settings.paymentMethods.cardNumber')}</label>
              <input
                type="text"
                name="card_number"
                value={formData.card_number}
                onChange={handleChange}
                className="form-input"
                placeholder={t('profile.settings.paymentMethods.cardNumberPlaceholder')}
                maxLength="19"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label no-icon">{t('profile.settings.paymentMethods.expMonth')}</label>
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
                <label className="form-label no-icon">{t('profile.settings.paymentMethods.expYear')}</label>
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
                <label className="form-label no-icon">{t('profile.settings.paymentMethods.cvc')}</label>
                <input
                  type="text"
                  name="cvc"
                  value={formData.cvc}
                  onChange={handleChange}
                  className="form-input"
                  placeholder={t('profile.settings.paymentMethods.cvc')}
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
                    cvc: '',
                    exp_month: '',
                    exp_year: ''
                  });
                }}
                disabled={saving}
              >
                <X className="w-4 h-4" />
                {t('profile.settings.paymentMethods.cancel')}
              </button>
              <button 
                className="btn-save"
                onClick={handleAdd}
                disabled={saving}
              >
                <Save className="w-4 h-4" />
                {t('profile.settings.paymentMethods.save')}
              </button>
            </div>
          </div>
        )}

        <div className="payment-methods-list">
          {paymentMethods.length === 0 ? (
            <div className="empty-state">
              <CreditCard className="w-12 h-12" />
              <p className="empty-state-text">{t('profile.settings.paymentMethods.empty')}</p>
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
                      {t('profile.settings.paymentMethods.expiryDate')}: {method.exp_month ? String(method.exp_month).padStart(2, '0') : '--'}/{method.exp_year || '----'}
                    </div>
                  </div>
                </div>
                <button
                  className={`btn-delete-payment ${paymentMethods.length <= 1 ? 'disabled' : ''}`}
                  onClick={() => handleDelete(method.id)}
                  title={paymentMethods.length <= 1 
                    ? t('profile.settings.paymentMethods.cannotDeleteLastTooltip')
                    : t('profile.settings.paymentMethods.delete')}
                  disabled={paymentMethods.length <= 1}
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

