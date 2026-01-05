import React, { useState } from 'react';
import { Mail, Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function EmailNotification({ userEmail, onCopyEmail }) {
  const { t } = useTranslation();
  const [emailCopied, setEmailCopied] = useState(false);

  const handleCopy = () => {
    onCopyEmail(userEmail);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  return (
    <div className="confirmation-email-card">
      <div className="confirmation-email-content">
        <div className="confirmation-email-icon-wrapper">
          <Mail className="confirmation-email-icon" />
        </div>
        <div className="confirmation-email-main">
          <h3 className="confirmation-email-title">{t('purchase.confirmation.email.title')}</h3>
          <p className="confirmation-email-description">
            {t('purchase.confirmation.email.description')}
          </p>
          <div className="confirmation-email-box">
            <div className="confirmation-email-box-content">
              <span className="confirmation-email-address">{userEmail}</span>
              <button
                onClick={handleCopy}
                className="confirmation-email-copy-btn"
              >
                <Copy className="confirmation-email-copy-icon" />
                {emailCopied ? t('purchase.confirmation.email.copied') : t('purchase.confirmation.email.copy')}
              </button>
            </div>
          </div>
          <div className="confirmation-email-steps">
            <p className="confirmation-email-steps-title">{t('purchase.confirmation.email.stepsTitle')}</p>
            <ol className="confirmation-email-steps-list">
              {t('purchase.confirmation.email.steps', { returnObjects: true }).map((step, idx) => (
                <li key={idx} className="confirmation-email-step-item">
                  <span className="confirmation-email-step-number">{idx + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

