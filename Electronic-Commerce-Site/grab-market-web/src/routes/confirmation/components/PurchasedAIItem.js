import React, { useState } from 'react';
import { Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../../../config/constants';

export default function PurchasedAIItem({ ai, index, onCopyCode }) {
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const imageUrl = ai.imageUrl ? `${API_URL}/${ai.imageUrl}` : null;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(ai.activationCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      if (onCopyCode) {
        onCopyCode(ai.activationCode);
      }
    } catch (err) {
      console.error('복사 실패:', err);
      // 폴백: 텍스트 선택 방식
      const textArea = document.createElement('textarea');
      textArea.value = ai.activationCode;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (fallbackErr) {
        console.error('폴백 복사도 실패:', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="confirmation-ai-item">
      <div className="confirmation-ai-item-content">
        <div className="confirmation-ai-avatar-wrapper">
          <div className="confirmation-ai-avatar">
            {imageUrl && !imageError ? (
              <img
                src={imageUrl}
                alt={ai.name}
                onError={() => setImageError(true)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%'
                }}
              />
            ) : (
              ai.avatar
            )}
          </div>
          <div className="confirmation-ai-number-badge">
            {index + 1}
          </div>
        </div>
        <div className="confirmation-ai-info">
          <div className="confirmation-ai-header">
            <div>
              <h4 className="confirmation-ai-name">{ai.name}</h4>
              <p className="confirmation-ai-category">{ai.category}</p>
            </div>
            <div className="confirmation-ai-price">
              ¥{ai.price.toLocaleString()}
            </div>
          </div>
          <div className="confirmation-ai-code-box">
            <div className="confirmation-ai-code-header">
              <span className="confirmation-ai-code-label">🔑 {t('purchase.confirmation.aiList.activation')}</span>
              <button
                onClick={handleCopyCode}
                className="confirmation-ai-code-copy-btn"
              >
                <Copy className="confirmation-ai-code-copy-icon" />
                {copySuccess ? (t('purchase.confirmation.email.copied') || 'コピーしました！') : t('purchase.confirmation.aiList.copy')}
              </button>
            </div>
            <code className="confirmation-ai-code">
              {ai.activationCode}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

