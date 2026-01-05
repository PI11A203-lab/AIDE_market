import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { formatDate, calculateDaysUntil } from '../../../subscription/utils/formatters';

export default function StudentStatusCard({ studentStatus }) {
  const { t, i18n } = useTranslation();
  const daysUntilExpiry = () => {
    if (!studentStatus?.student_expires_at) return null;
    return calculateDaysUntil(studentStatus.student_expires_at);
  };

  const getStatusBadge = (status) => {
    if (status === 'verified') {
      return (
        <span className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          {t('profile.studentVerification.page.statusBadge.verified')}
        </span>
      );
    } else if (status === 'pending') {
      return (
        <span className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
          <Clock className="w-4 h-4" />
          {t('profile.studentVerification.page.statusBadge.pending')}
        </span>
      );
    } else {
      return (
        <span className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">
          <XCircle className="w-4 h-4" />
          {t('profile.studentVerification.page.statusBadge.notApplied')}
        </span>
      );
    }
  };

  // 상태 계산 로직 개선 - index.js와 동일한 로직 사용
  const getStatus = () => {
    // student_verified_at이 null이 아니면 승인됨 (또는 만료됨)
    if (studentStatus?.student_verified_at) {
      if (studentStatus.student_expires_at) {
        const today = new Date();
        const expiresAt = new Date(studentStatus.student_expires_at);
        return expiresAt > today ? 'verified' : 'expired';
      }
      return 'verified';
    }
    
    // student_verified_at이 null이고 student_verification_document가 있으면 대기 중
    if (studentStatus?.student_verification_document) {
      return 'pending';
    }
    
    // 그 외에는 미신청
    return 'not_applied';
  };

  const status = getStatus();

  const days = daysUntilExpiry();

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">{t('profile.studentVerification.page.currentStatus')}</h2>
        {getStatusBadge(status)}
      </div>

      {status === 'verified' && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">{t('profile.studentVerification.page.statusCard.verifiedDate')}</p>
              <p className="font-semibold text-gray-900">
                {formatDate(studentStatus.student_verified_at, i18n.language)}
              </p>
            </div>
          </div>
          {studentStatus.student_expires_at && (
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">{t('profile.studentVerification.page.statusCard.expiryDate')}</p>
                <p className="font-semibold text-gray-900">
                  {formatDate(studentStatus.student_expires_at, i18n.language)}
                </p>
                {days !== null && (
                  <p className={`text-sm mt-1 ${days > 30 ? 'text-green-600' : days > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {days > 0 
                      ? t('profile.studentVerification.page.statusCard.daysRemaining', { days })
                      : t('profile.studentVerification.page.statusCard.expired')}
                  </p>
                )}
              </div>
            </div>
          )}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <p className="text-green-800 font-semibold">
              {t('profile.studentVerification.page.statusCard.discountApplied')}
            </p>
          </div>
        </div>
      )}

      {status === 'pending' && (
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⏳</span>
            <div>
              <p className="text-yellow-900 font-semibold mb-1">
                {t('profile.studentVerification.page.statusCard.pendingTitle')}
              </p>
              <p className="text-sm text-yellow-800">
                {t('profile.studentVerification.page.statusCard.pendingDescription')}
              </p>
            </div>
          </div>
        </div>
      )}

      {status === 'not_applied' && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-gray-800">
            {t('profile.studentVerification.page.statusCard.notAppliedDescription')}
          </p>
        </div>
      )}

      {status === 'expired' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-semibold mb-2">
            {t('profile.studentVerification.page.statusCard.expiredTitle')}
          </p>
          <p className="text-red-700">
            {t('profile.studentVerification.page.statusCard.expiredDescription', { date: formatDate(studentStatus.student_expires_at, i18n.language) })}
          </p>
          <p className="text-sm text-red-600 mt-2">
            {t('profile.studentVerification.page.statusCard.expiredRenew')}
          </p>
        </div>
      )}
    </div>
  );
}

