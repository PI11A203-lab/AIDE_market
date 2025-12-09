import React from 'react';
import { Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SupportInfo() {
  const { t } = useTranslation();
  return (
    <div className="confirmation-support">
      <p className="confirmation-support-text">
        {t('purchase.confirmation.support.description')}
      </p>
      <div className="confirmation-support-links">
        <a href="mailto:support@aidemarket.com" className="confirmation-support-link">
          <Mail className="confirmation-support-link-icon" />
          {t('purchase.confirmation.support.email')}
        </a>
        <span className="confirmation-support-separator">•</span>
        <a href="/help" className="confirmation-support-link">
          {t('purchase.confirmation.support.help')}
        </a>
        <span className="confirmation-support-separator">•</span>
        <a href="/support/chat" className="confirmation-support-link">
          {t('purchase.confirmation.support.chat')}
        </a>
      </div>
    </div>
  );
}

