import React from 'react';
import { Download, ExternalLink, Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function PurchasedAIItem({ ai, index, onCopyCode }) {
  const { t } = useTranslation();
  return (
    <div className="confirmation-ai-item">
      <div className="confirmation-ai-item-content">
        <div className="confirmation-ai-avatar-wrapper">
          <div className="confirmation-ai-avatar">
            {ai.avatar}
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
                onClick={() => onCopyCode(ai.activationCode)}
                className="confirmation-ai-code-copy-btn"
              >
                <Copy className="confirmation-ai-code-copy-icon" />
                {t('purchase.confirmation.aiList.copy')}
              </button>
            </div>
            <code className="confirmation-ai-code">
              {ai.activationCode}
            </code>
          </div>
          <div className="confirmation-ai-actions">
            <button className="confirmation-ai-download-btn">
              <Download className="confirmation-ai-download-icon" />
              {t('purchase.confirmation.aiList.download')}
            </button>
            <button className="confirmation-ai-guide-btn">
              <ExternalLink className="confirmation-ai-guide-icon" />
              {t('purchase.confirmation.aiList.guide')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

