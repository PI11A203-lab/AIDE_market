import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function ActionButtons() {
  const history = useHistory();
  const { t } = useTranslation();

  return (
    <div className="confirmation-action-buttons">
      <button
        onClick={() => history.push('/')}
        className="confirmation-action-btn-primary"
      >
        {t('purchase.confirmation.actions.browse')}
        <ArrowRight className="confirmation-action-btn-icon" />
      </button>
      <button
        onClick={() => history.push('/profile')}
        className="confirmation-action-btn-secondary"
      >
        {t('purchase.confirmation.actions.history')}
      </button>
    </div>
  );
}

