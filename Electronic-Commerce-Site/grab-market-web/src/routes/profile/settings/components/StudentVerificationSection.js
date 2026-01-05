import React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GraduationCap, CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';

export default function StudentVerificationSection({ studentStatus }) {
  const history = useHistory();
  const { t, i18n } = useTranslation();

  const getStatusInfo = () => {
    // 상태 계산 로직 - student-verification/index.js와 동일
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

    // 상태별 정보 반환
    if (status === 'verified') {
      const today = new Date();
      const expiresAt = studentStatus.student_expires_at ? new Date(studentStatus.student_expires_at) : null;
      const daysUntilExpiry = expiresAt ? Math.ceil((expiresAt - today) / (1000 * 60 * 60 * 24)) : null;
      
      return {
        status: 'verified',
        icon: <CheckCircle className="w-5 h-5" style={{ color: '#10b981' }} />,
        text: t('profile.settings.studentVerification.status.verified'),
        description: daysUntilExpiry !== null 
          ? t('profile.settings.studentVerification.description.verifiedWithExpiry', { days: daysUntilExpiry })
          : t('profile.settings.studentVerification.description.verified'),
        color: 'green'
      };
    }

    if (status === 'pending') {
      return {
        status: 'pending',
        icon: <Clock className="w-5 h-5" style={{ color: '#f59e0b' }} />,
        text: t('profile.settings.studentVerification.status.pending'),
        description: t('profile.settings.studentVerification.description.pending'),
        color: 'yellow'
      };
    }

    if (status === 'expired') {
      return {
        status: 'expired',
        icon: <XCircle className="w-5 h-5" style={{ color: '#ef4444' }} />,
        text: t('profile.settings.studentVerification.status.expired'),
        description: t('profile.settings.studentVerification.description.expired'),
        color: 'red'
      };
    }

    // not_applied
    return {
      status: 'not_applied',
      icon: <Clock className="w-5 h-5" style={{ color: '#6b7280' }} />,
      text: t('profile.settings.studentVerification.status.notApplied'),
      description: t('profile.settings.studentVerification.description.notApplied'),
      color: 'gray'
    };
  };

  const statusInfo = getStatusInfo();

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString(
      i18n.language === 'ko' ? 'ko-KR' : 
      i18n.language === 'ja' ? 'ja-JP' : 'en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <div className="settings-section-title">
          <GraduationCap className="w-6 h-6" />
          <h2>{t('profile.settings.studentVerification.title')}</h2>
        </div>
        <button
          className="btn-add"
          onClick={() => history.push('/profile/student-verification')}
        >
          {t('profile.settings.studentVerification.manage')}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="settings-section-content">
        {/* 상태 카드 */}
        <div className={`student-status-card student-status-${statusInfo.color}`}>
          <div className="student-status-header">
            {statusInfo.icon}
            <span className="student-status-text">{statusInfo.text}</span>
          </div>
          <p className="student-status-description">{statusInfo.description}</p>

          {/* 인증 정보 */}
          {statusInfo.status === 'verified' && studentStatus?.student_verified_at && (
            <div className="student-status-details">
              <div className="student-status-detail-item">
                <span className="detail-label">{t('profile.settings.studentVerification.labels.verifiedDate')}</span>
                <span className="detail-value">{formatDate(studentStatus.student_verified_at)}</span>
              </div>
              {studentStatus.student_expires_at && (
                <div className="student-status-detail-item">
                  <span className="detail-label">{t('profile.settings.studentVerification.labels.expiryDate')}</span>
                  <span className="detail-value">{formatDate(studentStatus.student_expires_at)}</span>
                </div>
              )}
            </div>
          )}

          {/* 대기 중 상태 정보 */}
          {statusInfo.status === 'pending' && (
            <div className="student-status-details">
              <div className="student-status-detail-item">
                <span className="detail-label">{t('profile.settings.studentVerification.labels.status')}</span>
                <span className="detail-value">{t('profile.settings.studentVerification.labels.pendingStatus')}</span>
              </div>
            </div>
          )}

          {/* 만료 상태 정보 */}
          {statusInfo.status === 'expired' && studentStatus?.student_expires_at && (
            <div className="student-status-details">
              <div className="student-status-detail-item">
                <span className="detail-label">{t('profile.settings.studentVerification.labels.expiryDate')}</span>
                <span className="detail-value">{formatDate(studentStatus.student_expires_at)}</span>
              </div>
            </div>
          )}
        </div>

        {/* 안내 메시지 */}
        <div className="student-verification-info">
          <ul className="student-info-list">
            <li>• {t('profile.settings.studentVerification.info.item1')}</li>
            <li>• {t('profile.settings.studentVerification.info.item2')}</li>
            <li>• {t('profile.settings.studentVerification.info.item3')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

